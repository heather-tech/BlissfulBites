from sqlalchemy_serializer import SerializerMixin
from config import db


class Tag(db.Model, SerializerMixin):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable= False)

    def __repr__(self):
        return f"<Tag {self.name}>"