"""
Endpoints for the core app.
"""

from django.conf.urls import url
from django.contrib.auth import views as auth_views

# This block are imports for Django REST Framework (from the tutorial)


from . import views

urlpatterns = [
    url(r'^api/state', views.state, name='state'),
    url(r'^status', views.status, name='status'),
    url(r'^$', views.index, name='index'),
]
