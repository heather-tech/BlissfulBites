from config import app
from models.models import *
from routes.routes import *




if __name__ == '__main__':
    app.run(port=5555, debug=True)