from rest_framework.routers import DefaultRouter

from products.viewsets import ProductGenericViewset

router = DefaultRouter()
router.register('products', ProductGenericViewset, basename='products')

urlpatterns = router.urls