activate_this = '/home/krc/.local/share/virtualenvs/flaskpage-QKy0shMA/bin/activate_this.py'
with open(activate_this) as f:
    exec(f.read(), dict(__file__=activate_this))

import sys
sys.path.insert(0, '/var/www/flaskpage')

from app import app as application
