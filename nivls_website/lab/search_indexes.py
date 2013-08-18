from haystack import indexes
from models import Project


class ProjectIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    pub_date = indexes.DateTimeField(model_attr='start_date')
    site_id = indexes.IntegerField(model_attr='site__site__pk')

    def get_model(self):
        return Project

    def index_queryset(self, using=None):
        return self.get_model().objects.all()
