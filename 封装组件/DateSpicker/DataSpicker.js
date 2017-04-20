  var DatePicker = (function(){
        function _DatePicker($target){
            this.$target =$target;
            this.init();
            this.render();
            this.setDate();
            this.bind()
        }
        _DatePicker.prototype = {
            init:function () {
                this.date = new Date();
                this.watchDate = new Date()
            },
            render:function(){
                var html = '';
                html += '<div class="date-picker">';
                html += '<div class="header"><span class="pre"></span><span class="cur"></span><span class="next"></span></div>';
                html += '<table class="panel">';
                html += '<thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>';
                html += '<tbody></tbody>';
                this.$Datepicker = $(html);
                this.$Datepicker.insertAfter($('.date-ipt'));
                this.$Datepicker.css({
                    position:'absolute',
                     left:this.$target.offset().left,
                     top:this.$target.offset().top+this.$target.height
                })
            },
            setDate: function(){
                this.$Datepicker.find('tbody')
                var firstDay = this.getFirstDay(this.watchDate),
                        lastDay = this.getLastDay(this.watchDate);

                var dateArr = [];
                for(var k =firstDay.getDay();k>0 ;k--){
                    var d =new Date(firstDay.getDay()-k*1000*60*60*24);
                    dateArr.push({type:'pre',date:d})
                }
                for(var i =0;i< lastDay.getDate() - firstDay.getDate()+1;i++){
                    var d =new Date(firstDay.getTime()+i*1000*60*60*24);
                    dateArr.push({type:'cur',date:d})
                }
                for(var j =1;j<7-lastDay.getDay();j++){
                    var d =new Date(lastDay.getDay()+j*1000*60*60*24);
                    dateArr.push({type:'next',date:d})
                }

                this.$Datepicker.find('.cur').text(this.watchDate.getFullYear()+'年'+(this.watchDate.getMonth()+1)+'月');
                var tpl = '';
                for(var i =0;i<dateArr.length;i++){
                    if(i%7 === 0){
                        tpl += '<tr>'
                    }
                    tpl +='<td class="';
                    if(dateArr[i].type === 'pre'){
                        tpl +='pre-month"'
                    }else if(dateArr[i].type === 'cur'){
                        tpl +='cur-month"'
                    }else {
                        tpl += 'next-month"'
                    }
                    if(this.getYYMMDD(this.date) === this.getYYMMDD(dateArr[i].date)){
                        tpl += ' cur-date';
                    }
                    tpl += ' data-date="'+ this.getYYMMDD(dateArr[i].date) + '">';
                    tpl += this.toFixed( dateArr[i].date.getDate()) + '</td>';

                    if(i%7 === 6){
                        tpl += '</tr>'
                    }
                }
                this.$Datepicker.find('tbody').html(tpl);

            },

            getYYMMDD: function(date){
                var yy = date.getFullYear(),
                        mm = date.getMonth()+1;
                return yy + "/" + this.toFixed(mm) + "/" + this.toFixed(date.getDate());
            },
            toFixed: function(n){
                return (n+'').length === 1 ? ('0'+ n+'') : (n+'');
            },
            getFirstDay:function(date){
                var year = date.getFullYear(),
                        month = date.getMonth();
                return newdate = new Date(year,month,1)
            },
            getLastDay:function(date){
                var year = date.getFullYear(),
                        month = date.getMonth();
                month++;
                if(month>11){
                    month = 0;
                    year++
                }
                var newdate = new Date(year,month,1);
                return new Date(newdate.getTime()-1000*60*60*24)
            },
            bind: function() {
                var _this = this;
                this.$Datepicker.find('.pre').on('click', function () {
                    _this .watchDate = _this .getPreMonth( _this .watchDate);
                    _this .setDate();
                });
                this.$Datepicker.find('.next').on('click', function(){
                    _this .watchDate =  _this .getNextMonth( _this .watchDate);
                    _this .setDate();
                });
                this.$Datepicker.on('mouseover','.cur-month',function(){
                    _this.$target.val($(this).attr('data-date'));
                     _this.$Datepicker.on('click','.cur-month',function(){
                    _this.$target.val($(this).attr('data-date'));
                    _this.$Datepicker.fadeOut()       
                })
                });
                
                this.$target.on('click', function(e){
                    e.stopPropagation();
                    _this.$Datepicker.fadeIn();
                });
                this.$Datepicker.on('click', function(e){
                    e.stopPropagation();
                });
                $(window).on('click', function(e){
                    _this.$Datepicker.fadeOut();
                })
            },
            getPreMonth: function(date){
                var year = date.getFullYear(),
                        month = date.getMonth();
                month--;
                if (month < 0) {
                    month = 11;
                    year--;
                }
                return new Date(year, month, 1);
            },
            getNextMonth: function(date){
                var year = date.getFullYear(),
                        month = date.getMonth();

                month++;
                if (month > 11) {
                    month = 0;
                    year++;
                }
                return new Date(year, month, 1);
            }

        };
        return {
            init:function($ct){
                $ct.each(function(idx,node){
                    new _DatePicker($(node))
                })
            }
        }
    })();