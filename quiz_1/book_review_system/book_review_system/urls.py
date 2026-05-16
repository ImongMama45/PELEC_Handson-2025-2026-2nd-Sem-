# book_review_system/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # All book routes get the /api/ prefix
    path("api/", include("books.urls", namespace="books")),

    # Enables login/logout in the DRF browsable API
    path("api-auth/", include("rest_framework.urls")),
]