/**
Usage :
Arguments = {
    //Necessary 
    list: [],
    //Optional 
    initItem: 0,
    isPointer: true,
    isCycle: true,
    height: 12,
    width: 100
}*/
define([
        'app',
        'element'
        ], function(App, ElementView) {
            var Carousel = ElementView.extend({
                attributes: {'class': 'carousel'},
                isMoving: false,
                events: {
                    'swipeRight': 'swipeHandler',
                    'swipeLeft' : 'swipeHandler',
                    'beforeflip': '_beforeFlip',
                    'afterflip' : '_afterFlip'
                },
                initialize: function() {
                    ElementView.prototype.initialize.call(this);
                    var carousel = this;

                    this.dataCtrl = {
                        currentId : '',
                        prevId : '',
                        nextId : '',
                        endId : this.getItemList().length - 1,
                        _shiftCurrentId : function(shiftValue) { 
                            var targetId = this.currentId + shiftValue;
                            // Overflow situation only happen in shifting
                            if (targetId > this.endId)
                                return this.setCurrentId(0);

                            if (targetId < 0)
                                return this.setCurrentId(this.endId);

                            this.setCurrentId(targetId);
                        },
                        nextItem : function() {
                            this._shiftCurrentId(1);
                        },
                        prevItem : function() {
                            this._shiftCurrentId(-1);
                        },
                        setCurrentId : function(targetId) {
                            this.currentId = targetId;
                            this.prevId = this.currentId - 1;
                            this.nextId = this.currentId + 1;
                            // set prevId & nextId
                            if (this.prevId < 0)
                                this.prevId = this.endId;
                            
                            if (this.nextId > this.endId)
                                this.nextId = 0;

                            console.log('[carousel] : setId -> the currentId = ' + this.currentId + ', nextId = ' + this.nextId + ', prevId = ' + this.prevId);
                        },
                        // get item data
                        getItemDataByType : function(type) {
                            var targetId;
                            switch(type) {
                                case 'next':
                                    targetId = this.nextId;
                                    break;
                                case 'prev':
                                    targetId = this.prevId;
                                    break;
                                 case 'current':
                                    targetId = this.currentId;
                                    break;
                                default:
                                    throw new Error('[carousel] : wrong data type parameter ' + type);
                            }
                            return this.getItemDataById(targetId);
                        },
                        getItemDataById : function(targetId) {
                            return carousel.getItemList()[targetId];
                        },
                        getCurrentItemId : function() {
                            return this.currentId;
                        }
                    };
                    this.viewCtrl = {
                        wrapper: "",
                        types : ['prev', 'current', 'next'],
                        views : [],
                        _initWrapper : function() {
                            this.wrapper = $('<div>').addClass('carousel-wrapper');
                            // set wrapper's init translateX
                            this.wrapper[0].style.webkitTransform = 'translate3d(0, 0, 0)';
                            // set wrapper's transition rate
                            this.wrapper[0].style.webkitTransitionDuration = '700ms'; 
                        },
                        _initViewChild : function() {
                            for (var i = 0; i < this.types.length; i++) {
                                // create 3 blank container 
                                var view = new CarouselPage({
                                    carouselParent: carousel,
                                    viewType: this.types[i]});
                                this.views.push(view);
                                this.wrapper.append(view.el)
                            };
                        },
                        _renderViewChild : function(preloadType) {
                            for (var i = 0; i < this.views.length; i++) {
                                var view = this.views[i],
                                    type = this.types[i];
                                view.positionManager.setPositionClass(type);
                                if(type === preloadType) {
                                    view.positionManager.updatePosition();
                                    view.render();
                                }
                            }; 
                        },
                        render: function() {
                            carousel.$el.append(this.wrapper);
                            carousel.$el.css({
                                height: carousel.getWidgetHeight('height') + 'em',
                            });
                        },
                        initialize : function() {
                            this._initWrapper();
                            this._initViewChild();
                        },
                        doTransition: function(options) {
                            if (carousel.isMoving)
                                return;

                            carousel.isMoving = true;

                            // wrapper is previous gemed wrapper during initialize
                            // deltaX is actually width
                            var wrapper = this.wrapper;
                            var currentX = carousel.Utils.getTransformSize(wrapper[0].style.webkitTransform);
                            var deltaX = parseInt(carousel.getWidgetWidth('width'), 10);
                            var newX = currentX + (options.isForward ? -1 : 1) * deltaX;
                            
                            carousel.$el.trigger('beforeflip', options);
                            
                            wrapper[0].style.webkitTransform = 'translate3d(' + newX + '%, 0, 0)';
                            wrapper.on('webkitTransitionEnd', function() {
                                carousel.$el.trigger('afterflip', options);
                                wrapper.off('webkitTransitionEnd');
                            });
                        },
                        //[A, B, C] => [B, C, A]
                        moveLeft: function() {
                            this.views.push(this.views.shift());
                            this._renderViewChild("next");
                        },
                        //[A, B, C] => [C, A, B]
                        moveRight: function() {
                            this.views.unshift(this.views.pop());
                            this._renderViewChild("prev");
                        },
                        getViewByType: function(viewType) {
                            for (var i = 0; i < this.views.length; i++) {
                                if (this.types[i] === viewType)
                                    return this.views[i];
                            };
                        }
                    };
                    this.identifier = {
                        pointers : [],
                        selectedIndex : -1,
                        update : function(newIndex) {
                            if (this.selectedIndex > -1)
                                this.pointers[this.selectedIndex].removeClass('selected');
                            this.pointers[newIndex].addClass('selected');
                            this.selectedIndex = newIndex;
                        },
                        initialize : function(listLength, currentIndex) {
                            var wrapper = $('<div>').addClass("pointer-wrapper");
                            for (var i = 0; i < listLength; i++) {                                    
                                var pointer = $('<div>').addClass("pointer").appendTo(wrapper);
                                var identifier = $('<div>').addClass('pointer-inner').appendTo(pointer);
                                this.pointers.push(pointer);
                            }
                            this.update(currentIndex);
                            return wrapper;
                        }
                    };
                    /**
                      * Init Data -> Init View -> Enable optional controls
                      */
                    this.dataCtrl.setCurrentId(this.getBeginIndex());
                    this.viewCtrl.initialize();
                    this.render();
                    return this;
                },
                render: function() {
                    this.viewCtrl.render();
                    //Enable pointer if needed
                    if (this.hasPointer()) {
                        this.$el.append(this.identifier.initialize(
                            this.getItemList().length, this.getBeginIndex()));
                    }
                },
                swipeHandler: function(e) {
                    var obj = {
                        isForward: e.type === "swipeLeft"
                    }
                    var isOver = function(isForward) {
                        var targetId = this.dataCtrl.getCurrentItemId() + (isForward ? 1 : -1) ;
                        return (targetId > (this.getItemList().length - 1) || targetId < 0);
                    }
                    if (!this.isCycle() && isOver.apply(this, obj.isForward))
                      return false;
                    this.viewCtrl.doTransition(obj);
                },             
                hasPointer: function() {
                    return this.model.get('isPointer') || true;
                },
                isCycle: function() {
                    return this.model.get('isCycle') || true;
                },
                getBeginIndex: function() {
                    return this.model.get('initItem') || 0;
                },
                getWidgetWidth: function() {
                    return this.model.get('width') || 100; //100 means 100% 
                },
                getWidgetHeight: function() {
                    return this.model.get('height') || 12; //12em is default height
                },
                getItemList: function() {
                    return this.model.get('list'); 
                },
				getTitle: function() {

					return this.model.get('title') || false;
					
				},
                _beforeFlip: function(e, o) {
                    this.dataCtrl[o.isForward ? "nextItem" : "prevItem"]();
                    if (this.hasPointer())
                        this.identifier.update(this.dataCtrl.getCurrentItemId());    
                },
                _afterFlip: function(e, o) {
                    this.viewCtrl[o.isForward ? "moveLeft" : "moveRight"]();
                    
                    this.isMoving = false;
                },
                Utils: {
                    getTransformSize: function(transformXStr) {
                        return parseInt(transformXStr.split('(')[1].split('px')[0], 10);
                    }
                }
            });
            var CarouselPage = Backbone.View.extend({
                attributes: {'class': 'item link'},
                events: {},
                initialize: function() {//Prepare Data / View / Helper Class
                    var carouselPage = this,
                        carousel = carouselPage.options.carouselParent,
                        viewtype = carouselPage.options.viewType;

                    this.positionManager = (function() {                         
                        var _position;
                        var getInitPosition = function() {
                            switch(_position) {
                                case 'prev':
                                    return -100;
                                case 'next':
                                    return 100;
                                case 'current':
                                    return 0;
                            }
                        }
                        var getNewPosition = function() {
                            var currentView = carousel.viewCtrl.getViewByType('current');// @TODO : should replace with getCurrentView()
                            var currentViewLeft = parseInt(currentView.$el.css('left').replace('%',""),10);

                            if (_position === 'prev')
                                return currentViewLeft - 100; 

                            if (_position === 'next')
                                return currentViewLeft + 100; 
                        };
                        return {
                            setPositionClass: function(position) {
                                if (_position) //remove old css class if exists
                                    carouselPage.$el.removeClass(_position);
                                carouselPage.$el.addClass(position);
                                _position = position;
                            },
                            getPositionClass: function() {
                                return _position;
                            },
                            initPosition: function() {
                                carouselPage.$el.css('left', getInitPosition() + '%');
                            },
                            updatePosition: function() {
                                carouselPage.$el.css('left', getNewPosition() + '%');
                            }
                        }; 
                    })();

                    this.viewCtrl = (function(carouselPage) {
                        var _img = $('<img>').addClass("img");
						var _p = $('<p></p>').addClass("carouselTitle");
						var carousel = carouselPage.options.carouselParent;

                        carouselPage.$el.append(_img);
						if (carousel.getTitle()){
							carouselPage.$el.append(_p);
						}
                        return {
                            setSrc: function(src) {
                                _img.attr('src', src);
                            },
                            setTitle: function(title) {
                                _title = title;
                            },
							makeTitle: function(title) {
								_p.text(title);
								
							}
                        } 
                    })(this);
                    this.positionManager.setPositionClass(viewtype);
                    this.positionManager.initPosition();
                    this.render();
                    return this;
                },
                render: function() {//Data + View Combine
                    var carousel = this.options.carouselParent;
				
                    var item = carousel.dataCtrl.getItemDataByType(this.positionManager.getPositionClass());
					
                    this.$el.data('href', item.href);
					if (item.title){
                   		this.viewCtrl.makeTitle(item.title);
					}
                    this.viewCtrl.setSrc(item.src);
                }
            });
            return Carousel;
        });