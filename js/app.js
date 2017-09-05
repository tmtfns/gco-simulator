/**  
 * JAVASCRIPT FILE
 *  @author tmtfns@gmail.com 
 *  app
 *  UTF-8
 */

'use strict';
var App = App || {}
var App = (function(App) {
    var settings = {
        "backSize" : 300,
        "offset" : 50   
    };
    var currentOptions = {
        "mode" : 0,             
    };  
    
    var dataModes = ['source-over', 'source-in', 'source-out', 'source-atop', 'destination-over',
    'destination-in', 'destination-out', 'destination-atop', 'lighter', 'copy', 'xor', 'multiply',
    'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light',
    'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'];
    
    var selectMode, btnDraw, canvas, context;    
    
    var colors = {
        'closeTitle' : 'Color',
        'openTitle' : 'First color',
        'activeColorBox' : null,
        'back' : {
           'secondWrap' : null,
           'firstTitle' : null,
           'firstColor' : null,
           'secondColor' : null,
           'mode' : 'solid'
        },
        'over' : {
           'secondWrap' : null,
           'firstTitle' : null,
           'firstColor' : null,
           'secondColor' : null,
           'mode' : 'solid'
        }
    };
    
    // draw function
    
    
    function draw() {
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawSection('back', 0, 0, canvas.width, canvas.height);
        context.save();
        context.globalCompositeOperation = dataModes[currentOptions.mode];
        var size = canvas.width - 2 * settings.offset;
        drawSection('over', settings.offset, settings.offset, size, size);
        context.restore(); 
    }
    
    function drawSection(section, x, y, width, height) {
        var color, w = width, h = height;        
        switch (colors[section].mode) {
            case 'gradient' : {
                color = context.createLinearGradient(x, y, w, y);
                color.addColorStop(0, colors[section].firstColor.style.backgroundColor);
                color.addColorStop(1, colors[section].secondColor.style.backgroundColor);
                break;
            }
             case 'half' : { 
                color = colors[section].firstColor.style.backgroundColor;                
                if (section == 'over') {
                   h = Math.round(h /2);                   
                } else {
                   w = Math.round(w /2); 
                }
                //
                break;
            }
            default: {
                color = colors[section].firstColor.style.backgroundColor;  
            }
        }        
        context.beginPath(); 
        context.rect(x, y, w, h);
        context.fillStyle = color;       
        context.fill();
        
    }
    
    // handlers
    
    function _colorMode(section, mode) {
        if ((mode == 'gradient') && (colors[section].mode != 'gradient')) {
            colors[section].firstTitle.innerHTML = colors.openTitle;
            colors[section].secondWrap.classList.remove('hidden-blc');
            
        } else if ((mode != 'gradient') && (colors[section].mode == 'gradient')) {
            colors[section].firstTitle.innerHTML = colors.closeTitle;
            colors[section].secondWrap.classList.add('hidden-blc');
            if (colors.activeColorBox == colors[section].secondColor) {
                colors.activeColorBox = colors[section].firstColor;
                ColorPickerTool.setActive(colors[section].firstColor);
            }
        }
        colors[section].mode = mode;
        
    };
    
    // init functions
    
    function _initDomElements() {
        selectMode = document.getElementById('select-mode'); 
        btnDraw = document.getElementById('btn-draw'); 
        canvas = document.getElementById('show-canvas'); 
        context = canvas.getContext('2d');
        canvas.width = settings.backSize;
        canvas.height = settings.backSize;
        
        colors.back.firstColor = document.getElementById('back-first-color');
        colors.back.secondColor = document.getElementById('back-second-color');
        colors.over.firstColor = document.getElementById('over-first-color'); 
        colors.over.secondColor = document.getElementById('over-second-color');
        //
        colors.back.secondWrap = document.getElementById('back-second-color-wrap');
        colors.back.firstTitle = document.getElementById('back-first-title');
        colors.over.secondWrap = document.getElementById('over-second-color-wrap');
        colors.over.firstTitle = document.getElementById('over-first-title');
        colors.back.firstTitle.innerHTML = colors.closeTitle;
        colors.over.firstTitle.innerHTML = colors.closeTitle;
        //
         _initOptions(selectMode, dataModes, currentOptions.mode);
        
    }
    
    function _initHandlers() {
        var backMode, overMode;    
        var i;
        backMode = document.getElementsByName( 'background-mode' ); 
        overMode = document.getElementsByName( 'over-mode' );
        for(i= 0; i < backMode.length; i++) {
            if ( backMode[i].value == 'solid' ) {
                backMode[i].checked = true;
            } else {
                backMode[i].checked = false;
            }
            backMode[i].addEventListener('change', function(event){ 
                _colorMode('back', this.value);                
            });
        }
        for(i= 0; i < overMode.length; i++) {
            if (overMode[i].value == 'solid') {
                overMode[i].checked = true;
            } else {
                overMode[i].checked = false;
            }
            overMode[i].addEventListener('change', function(event){
                
                _colorMode('over', this.value); 
                
            });
        }
        selectMode.addEventListener('change', function(event){ 
            
            currentOptions.mode = this.value;  
            
        });
        btnDraw.addEventListener('click', function(event){     
            draw();           
        });
    }
    
    function _initOptions(select, data, current) {
        
        var i, isValue, len = data.length;
        var option;
        for(i = 0; i < len; i++) {
            isValue = (i == current) ? true : false;
            option = new Option(data[i], i, isValue, isValue);
            select.appendChild(option);
        }
    }   
    
    function _initColorPicker() {
        
        ColorPickerTool.init();        
        _initColorPickerItem(colors.back.firstColor);
        _initColorPickerItem(colors.back.secondColor);
        _initColorPickerItem(colors.over.firstColor);
        _initColorPickerItem(colors.over.secondColor);
        
        colors.activeColorBox = colors.back.firstColor
        ColorPickerTool.setActive(colors.back.firstColor);
        
    }
    
    function _initColorPickerItem(item) {
        
        ColorPickerTool.addItem(item);
        item.addEventListener('click', function() {
            colors.activeColorBox = this;
            ColorPickerTool.setActive(this);
        }, false);
        
    }    
    
    App.init = function() { 
        _initDomElements();
        _initHandlers();
        _initColorPicker();
        draw();
        //document.getElementsByName(name)
    };
    return App;
})(App);
