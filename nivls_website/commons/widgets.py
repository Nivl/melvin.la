from django import forms
from django.conf import settings
from django.utils.safestring import mark_safe


class ColorPickerWidget(forms.TextInput):
    class Media:
        css = {
            'all': (settings.STATIC_URL + 'commons/css/10/colorpicker.css', )}
        js = (
            'http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js',
            settings.STATIC_URL + 'commons/js/10/colorpicker.js', )

    def __init__(self, language=None, attrs=None):
        self.language = language or settings.LANGUAGE_CODE[:2]
        super(ColorPickerWidget, self).__init__(attrs=attrs)

    def render(self, name, value, attrs=None):
        rendered = super(ColorPickerWidget, self).render(name, value, attrs)
        return rendered + mark_safe(u'''<script type="text/javascript">
            $('#id_%s').ColorPicker({
                        onSubmit: function(hsb, hex, rgb, el) {
                          $(el).val(hex);
                          $(el).ColorPickerHide();
                        },

                       onChange: function(hsb, hex, rgb, el) {
                          $(el).val(hex);
                        },

                        onShow: function (colpkr) {
                          $(colpkr).fadeIn(500);
                          return false;
                        },

                        onHide: function (colpkr) {
                          $(colpkr).fadeOut(500);
                          return false;
                        },

                        onBeforeShow: function () {
                          $(this).ColorPickerSetColor(this.value);
                        },

                      })
                      .bind('keyup', function(){
                        $(this).ColorPickerSetColor(this.value);
                      });
            </script>''' % name)


class CroppedImageWidget(forms.TextInput):
    class Media:
        css = {
            'all': (settings.STATIC_URL + "commons/css/10/jquery.Jcrop.min.css", )}

        js = (
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
            settings.STATIC_URL + 'commons/js/10/jquery.Jcrop.min.js', )

    markup = """
<script>
$(window).load(function(){

    var jcrop_api, boundx, boundy, multiplicator, img_width;
    var target_id = 'image-id-%(picture_name)s';
    var image_src = $('#id_%(picture_name)s').prevAll('a');
    var image;

    function jCropUpdatePreview_id_%(field_name)s(c) {
	if (parseInt(c.w) > 0) {
	    var rx = 125 / c.w;
	    var ry = 125 / c.h;

	    $('#id_%(field_name)s').val(parseInt(c.x / multiplicator) + "x" + parseInt(c.y / multiplicator) + " " + parseInt(c.w / multiplicator) + "x" + parseInt(c.h / multiplicator))

	    $('#preview_id_%(field_name)s').css({
		width: Math.round(rx * boundx) + 'px',
		height: Math.round(ry * boundy) + 'px',
		marginLeft: '-' + Math.round(rx * c.x) + 'px',
		marginTop: '-' + Math.round(ry * c.y) + 'px'
	    });
	}
    };

    function jcropStart_id_%(field_name)s() {
        $('#' + target_id).Jcrop({
	    onChange: jCropUpdatePreview_id_%(field_name)s,
	    onSelect: jCropUpdatePreview_id_%(field_name)s,
	    aspectRatio: %(ratio)s,
		%(min_size)s
		%(max_size)s
		%(select)s
        }, function(){
	    if (img_width !== undefined) {
		var bounds = this.getBounds();
		boundx = bounds[0];
		boundy = bounds[1];
		multiplicator =  boundx / img_width;
		jcrop_api = this;
		this.animateTo([ %(x1)s * multiplicator, %(y1)s * multiplicator, (%(x2)s + %(x1)s) * multiplicator, (%(y2)s + %(y1)s) * multiplicator ]);
	    }
	});
    }

    if ($('#id_%(picture_name)s') || $('#' + target_id)) {
	if (image_src.length) {
	    image = $('<img id="' + target_id + '">');
	    image.attr('src', image_src.attr('href')).load(function(){
		img_width = this.width;
		image.insertAfter('#id_%(field_name)s');
		jcropStart_id_%(field_name)s();
	    });
	} else if ($('#' + target_id).prop('tagName') == 'IMG') {
	    img_width = $('#' + target_id).data('real-width');
            jcropStart_id_%(field_name)s();
	}
    }
});
</script>
"""

    def __init__(self, instance, attrs=None):
        self.instance = instance
        super(CroppedImageWidget, self).__init__(attrs=attrs)


    def render(self, name, value, attrs=None):
        rendered = super(CroppedImageWidget, self).render(name, value, attrs)

        ratio_list = self.instance.ratio.split('x')
        ratio = float(ratio_list[0]) / float(ratio_list[1])

        min_size = self.instance.min_size
        if min_size != [0, 0]:
            min_size_str = 'minSize: [%d, %d],' % (min_size[0], min_size[1])
        else:
            min_size_str = ''

        max_size = self.instance.max_size
        if max_size != [0, 0]:
            max_size_str = 'maxSize: [%d, %d],' % (max_size[0], max_size[1])
        else:
            max_size_str = ''

        select_str = 'setSelect: ['
        select = []
        for select_list in value.split(" "):
            if select:
                select_str += ', '
            x, y = select_list.split("x")
            select_str += '%s, %s' % (x, y)
            select.append([x, y])
        if select:
            select_str += '], '
        else:
            select_str = ''

        return rendered + mark_safe(self.markup % {
                'field_name': name,
                'ratio': ratio,
                'min_size': min_size_str,
                'max_size': max_size_str,
                'select': select_str,
                'x1': select[0][0],
                'y1': select[0][1],
                'x2': select[1][0],
                'y2': select[1][1],
                'picture_name': self.instance.image_field_name,
                })
