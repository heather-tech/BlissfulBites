# Remote library imports
from flask import Flask;
from flask_cors import CORS;
from flask_migrate import Migrate;
from flask_restful import Api;
from flask_sqlalchemy import SQLAlchemy;
from sqlalchemy import MetaData;
from flask_bcrypt import Bcrypt

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
app.secret_key = (
    'aee798b437b9550f2680988df4542119bed8d2b39bc421c972dea50f4c82f449'
)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate Bcrypt
bcrypt = Bcrypt(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)
