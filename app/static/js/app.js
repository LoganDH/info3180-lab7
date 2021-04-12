/* Add your Application JavaScript */
// Instantiate our main Vue Instance
const app = Vue.createApp({
    data() {
        return {

        }
    }
});

app.component('app-header', {
    name: 'AppHeader',
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/api/upload">Upload <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

app.component('app-footer', {
    name: 'AppFooter',
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
    data() {
        return {
            year: (new Date).getFullYear()
        }
    }
});

const uploadForm =  {
    name: 'uploadForm', 
    template: `
    <h1>Upload Form</h1>
    <form @submit.prevent="uploadPhoto" id="uploadForm">
        <div class="alert" id="showAlert">
            {{ message }}
        <ul>
            <li v-for = "error in errors"> {{ error }} </li>
        </ul>
        </div>

        <div class="form-group">
            <label for="description">Description</label><br>
            <input type="text" id="description" name="description"><br>
        </div>

        <div class="form-group">
            <label for="photo">Photo</label><br>
            <input type="file" id="photo" name="photo" accept="image/png, image/jpeg"><br>
        </div>

        <input type="submit" value="Submit" class="btn btn-primary">
    </form>
    `,
    methods: {
        uploadPhoto() {
            let self = this;
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            let displayAlert = document.getElementById('showAlert');
            fetch("/api/upload", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                // display a success message
                if (jsonResponse['upload']) {
                    self.message = jsonResponse['upload']['message'];
                    self.errors = [];
                    displayAlert.classList.add("alert-success");
                    displayAlert.classList.remove("alert-danger");
                }
                else if (jsonResponse['errors']) {
                    self.message = '';
                    self.errors = jsonResponse['errors'];
                    displayAlert.classList.add('alert-danger');
                    displayAlert.classList.remove('alert-success');
                }
            })
            .catch(function (error) {
                console.log(error);
                self.errors = error;
            });
        }
    }, 
    data() {
        return {
            errors: [],
            message: '',
         }
    }
};

const Home = {
    name: 'Home',
    template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
    `,
    data() {
        return {}
    }
};

const NotFound = {
    name: 'NotFound',
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data() {
        return {}
    }
};

// Define Routes
const routes = [
    { path: "/", component: Home },
    // Put other routes here
    { path: "/api/upload", component: uploadForm },
    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');