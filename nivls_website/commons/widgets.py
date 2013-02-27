from django import forms
from django.conf import settings
from django.utils.safestring import mark_safe


class ColorPickerWidget(forms.TextInput):
    class Media:
        css = {
            'all': (settings.STATIC_URL + 'commons/css/plugins/colorpicker.css', )}
        js = (
            settings.STATIC_URL + '/admin/js/disable_jquery_namespace.js',
            settings.STATIC_URL + 'commons/js/plugins/colorpicker.js', )

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
            'all': ("//cdnjs.cloudflare.com/ajax/libs/jquery-jcrop/0.9.10/jquery.Jcrop.min.css", )}

        js = (
            settings.STATIC_URL + '/admin/js/disable_jquery_namespace.js',
            '//cdnjs.cloudflare.com/ajax/libs/jquery-jcrop/0.9.10/jquery.Jcrop.min.js', )

    markup = """
<script>
$(window).load(function(){
    var boundx_%(field_name)s;
    var boundy_%(field_name)s;
    var multiplicator_%(field_name)s;
    var img_width_%(field_name)s;
    var target_id_%(field_name)s = 'image-id-%(picture_name)s';
    var image_src_%(field_name)s = $('#id_%(picture_name)s').prevAll('a');
    var image_%(field_name)s;

    function jCropUpdatePreview_id_%(field_name)s(c) {
	if (parseInt(c.w) > 0) {
	    var rx = 125 / c.w;
	    var ry = 125 / c.h;

	    $('#id_%(field_name)s')
		.val(parseInt(c.x / multiplicator_%(field_name)s)
		     + "x"
		     + parseInt(c.y / multiplicator_%(field_name)s)
		     + " "
		     + parseInt(c.w / multiplicator_%(field_name)s)
		     + "x"
		     + parseInt(c.h / multiplicator_%(field_name)s))

	    $('#preview_id_%(field_name)s').css({
		width: Math.round(rx * boundx_%(field_name)s) + 'px',
		height: Math.round(ry * boundy_%(field_name)s) + 'px',
		marginLeft: '-' + Math.round(rx * c.x) + 'px',
		marginTop: '-' + Math.round(ry * c.y) + 'px'
	    });
	}
    };

    function jcropStart_id_%(field_name)s() {
        $('#' + target_id_%(field_name)s).Jcrop({
	    onChange: jCropUpdatePreview_id_%(field_name)s,
	    onSelect: jCropUpdatePreview_id_%(field_name)s,
	    aspectRatio: %(ratio)s,
		%(min_size)s
		%(max_size)s
		%(select)s
        }, function(){
	    if (img_width_%(field_name)s !== undefined) {
		var bounds = this.getBounds();
		boundx_%(field_name)s = bounds[0];
		boundy_%(field_name)s = bounds[1];
		multiplicator_%(field_name)s = boundx_%(field_name)s / img_width_%(field_name)s;
		this.animateTo([ %(x1)s * multiplicator_%(field_name)s,
				 %(y1)s * multiplicator_%(field_name)s,
				 (%(x2)s + %(x1)s) * multiplicator_%(field_name)s,
				 (%(y2)s + %(y1)s) * multiplicator_%(field_name)s ]);
	    }
	});
    }

    if ($('#id_%(picture_name)s') || $('#' + target_id_%(field_name)s)) {
	if (image_src_%(field_name)s.length) {
	    image_%(field_name)s = $('<img id="' + target_id_%(field_name)s + '">');
	    image_%(field_name)s
		.attr('src', image_src_%(field_name)s.attr('href'))
		.load(function(){
		    img_width_%(field_name)s = this.width;
		    image_%(field_name)s.insertAfter('#id_%(field_name)s');
		    jcropStart_id_%(field_name)s();
		});
	} else if ($('#' + target_id_%(field_name)s).prop('tagName') == 'IMG') {
	    img_width_%(field_name)s = $('#' + target_id_%(field_name)s).data('real-width');
            jcropStart_id_%(field_name)s();
	}
    }
});
</script>
"""

    def __init__(self, instance, attrs=None):
        self.instance = instance
        attrs['style'] = 'display: none;'
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

        select = []
        select_str = 'setSelect: ['
        if value:
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
            if min_size != [0, 0]:
                select = [[0, 0], min_size]
            else:
                select = [[0, 0], [10, 10]]

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
