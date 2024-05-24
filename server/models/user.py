from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from config import db, bcrypt
from flask_login import UserMixin


class User(db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=True)
    bio = db.Column(db.String, nullable=True)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column('password', db.String, nullable=False)

    # RELATIONSHIPS
    recipes = db.relationship('Recipe', back_populates='user', lazy=True) 

    # SERIALIZATION
    # serialize_rules = ('-id', )  

    # VALIDATION
    @validates('email')
    def validates_username(self, key, value):
        if key == 'email':
            if '@' not in value:
                raise ValueError("Email must contain @.")
        return value
    
    # # bio must be more than 20 characters
    # @validates('bio')
    # def validates_bio(self, value):
    #         if len(value) < 20:
    #             raise ValueError("Must be more than 20 characters.")
    #         return value

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    def __repr__(self):
        return f'<User {self.email}>'



























