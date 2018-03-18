#!/usr/bin/python
import os
import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/var/www/happyfoodhole/")
os.environ['FLASK_APP'] = 'run.py'

from happyfoodhole import app as application
application.secret_key = 'Add your secret key'

