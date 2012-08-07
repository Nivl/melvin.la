from haystack.indexes import *
from haystack import site
from models import Post


class PostIndex(RealTimeSearchIndex):
    text = CharField(document=True, use_template=True)
    author = CharField(model_attr='author')
    pub_date = DateTimeField(model_attr='pub_date')
    site_id = IntegerField(model_attr='site__site__id')

    def index_queryset(self):
        return Post.objects.filter(is_public=True)

site.register(Post, PostIndex)
