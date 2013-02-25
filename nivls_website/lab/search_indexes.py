from haystack import indexes
from haystack import site
from models import Project


class ProjectIndex(indexes.RealTimeSearchIndex):
    text = indexes.CharField(document=True, use_template=True)
    pub_date = indexes.DateTimeField(model_attr='start_date')
    site_id = indexes.IntegerField(model_attr='site__site__pk')

    def index_queryset(self):
        return Project.objects.all()

site.register(Project, ProjectIndex)
