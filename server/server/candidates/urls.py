from django.urls import path

from . import views

urlpatterns = [
    path('', views.candidate_list_create_view),
    path('<int:pk>/', views.candidate_detail_view),
    path('<int:pk>/update/', views.candidate_update_view),
    path('<int:pk>/delete/', views.candidate_destroy_view),
    path('dept', views.department_list_create_view),
    path('dept/<int:pk>/', views.department_detail_view),
    path('note', views.note_list_create_view),
    path('note/<int:candidate>/', views.note_detail_view),
    path('note/<int:pk>/update/', views.note_update_view),
    path('note/<int:pk>/delete/', views.note_destroy_view)
]