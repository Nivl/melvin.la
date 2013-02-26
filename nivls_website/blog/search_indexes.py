from haystack import indexes
from haystack import site
from models import Post


class PostIndex(indexes.RealTimeSearchIndex):
    text = indexes.CharField(document=True, use_template=True)
    pub_date = indexes.DateTimeField(model_attr='pub_date')
    site_id = indexes.IntegerField(model_attr='site__site__id')

    def index_queryset(self):
        return Post.objects.filter(is_public=True)

site.register(Post, PostIndex)
