import noUiSlider from 'nouislider';

function init(Survey) {
    var widget = {
        name: "nouislider",
        title: "noUiSlider",
        iconName: "icon-nouislider",
        widgetIsLoaded: function() { return typeof noUiSlider != "undefined"; },
        isFit : function(question) { return question.getType() === 'nouislider'; },
        htmlTemplate: "<div></div>",
        activatedByChanged: function(activatedBy) {
            if(!this.widgetIsLoaded()) return;
            Survey.JsonObject.metaData.addClass("nouislider", [], null, "empty");
            Survey.JsonObject.metaData.addProperties("nouislider", [{name: "rangeMin:number", default: 0}, {name: "rangeMax:number", default: 100},
            {name: "defaultRangeMin:number", default: 30}, {name: "defaultRangeMax:number", default: 70}]);
        },
        afterRender: function(question, el) {
            var startValue = question.value;
            if(!startValue || startValue.length != 2) {
                startValue = [question.defaultRangeMin, question.defaultRangeMax];
            }
            if(startValue[0] < question.rangeMin) startValue[0] = question.rangeMin;
            if(startValue[0] > question.rangeMax) startValue[0] = question.rangeMax;
            if(startValue[1] < startValue[0]) startValue[1] = startValue[0];
            if(startValue[1] > question.rangeMax) startValue[1] = question.rangeMax;
            question.value = startValue;

            el.style.marginBottom = "50px";
            var slider = noUiSlider.create(el, {
                start: startValue,
                connect: true,
                pips: {
                    mode: 'steps',
                    stepped: true,
                    density: 4
                },
                range: {
                    'min': question.rangeMin,
                    'max': question.rangeMax
                }
            });
            slider.on('set', function(){
                question.value = slider.get();
            }); 
            var updateValueHandler = function() {
                slider.set(question.value);
            };
            question.noUiSlider = slider;
            question.valueChangedCallback = updateValueHandler;
        },
        willUnmount: function(question, el) {
            question.noUiSlider.destroy(); 
            question.noUiSlider = null;
        } 
    }

    Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
    init(Survey);
}

export default init;