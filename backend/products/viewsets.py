from rest_framework import  mixins,viewsets

from .models import Product
from . serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    '''
    get -> List -> Queryset
    get -> retreieve -> Product Instance Detail View
    post -> create -> New Instance
    put -> update
    push -> Partial Update
    delete -> destroy
    '''

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'pk' 

class ProductGenericViewset(
        mixins.ListModelMixin,
        mixins.RetrieveModelMixin,
        viewsets.GenericViewSet):
    '''
    get -> List -> Queryset
    get -> retreieve -> Product Instance Detail View
    '''
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'pk' 