"""
Endpoints for the core app.
"""

from django.conf.urls import url
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    url(r'^state', views.state, name='state'),
    url(r'^$', views.status, name='status'),
]
