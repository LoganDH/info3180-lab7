from flask import Flask
from flask_wtf.csrf import CSRFProtect
from app.config import Config

app = Flask(__name__)
csrf = CSRFProtect(app)
app.config.from_object(Config)

from app import views
