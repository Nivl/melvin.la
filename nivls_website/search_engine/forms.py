from haystack.forms import ModelSearchForm


class AjaxSearchForm(ModelSearchForm):
    def __init__(self, *arg, **kwargs):
        super(AjaxSearchForm, self).__init__(*arg, **kwargs)
        self.fields['q'].widget.attrs = {'class': 'search-query',
                                         'data-provide': 'typeahead'}
