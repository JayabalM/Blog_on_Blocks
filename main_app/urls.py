from django.urls import path,include

from . import views

urlpatterns = [
    path('',views.connect,name='connect'),
    path('payment/get_receipt/<int:pid>', views.get_receipt, name="receipt"),
    path('submit/',views.append,name='submit'),
    path('posts/', views.posts,name='posts'),
    path('get_free_post/<int:pid>', views.get_free_post,name='get_free_post'),
    path('payment/get_post/<int:pid>', views.get_post,name='get_post'),
    path('payment/<int:pid>' ,views.payment, name='payment'),
    path('get_pdf/<int:pid>',views.get_pdf,name='pdf')
]


