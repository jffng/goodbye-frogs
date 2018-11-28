#!/usr/bin/env python

import os
import json
from fabric.api import env
from fabric.api import run
from fabric.operations import local
from fabric.operations import put
from fabric.operations import get
from fabric.operations import sudo
from fabric.contrib.project import rsync_project
from fabric.context_managers import cd
from fabric.context_managers import settings

env.hosts = ['1.1.1.1']
env.user = 'ubuntu'

def deploy():
    run("rm -rf /frog/www/app")
    run("mkdir /frog/www/app")
    put("build/*", "/frog/www/app")
    # rsync_project("/frog/www/", "site/")
