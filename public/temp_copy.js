    $("#btn_previous").click(function(){                        // 在小螢幕模式時的"上一頁"按鈕
        var prompt_txtbox = $("#prompt");
        var prompt_flat_txtbox = $("#prompt_flat");
        if (mode == 0){ 
            prompt_txtbox.val("現在還不能換頁!");
            prompt_flat_txtbox.val("現在還不能換頁!");
            caption_effect();
            return;
        }
        if (totalpage > 1){
            if (mode != 0 && reachHead() == true){              // 選字模式下，若翻頁已達首頁，則-號無效
                prompt_txtbox.val("已達首頁!");
                prompt_flat_txtbox.val("已達首頁!");
                caption_effect();
                return;
            }
            else{
                thispage--;                                     // 刷新頁數
                var temp_text = "";
                var temp_text_flat = "";
                var i = 0 + (10 * (thispage - 1));
                var counter = 0;
                var next_flag = false;
                while (i < number_letters && counter < 10){
                    temp_text += (i + 1) + ". " + select_letter[i] + "\n";
                    if (((i % 10) == 3 || (i % 10) == 7) && (thispage < totalpage)){
                        if ((i % 10) == 3) 
                            temp_text_flat += (i + 1) + ". " + select_letter[i] + "\n";
                        if (((i % 10) == 7) && (select_letter[i + 1].length <= 4) && (select_letter[i + 2].length <= 4)){
                            temp_text_flat += (i + 1) + ". " + select_letter[i] + "\n";
                            next_flag = true;
                        }
                        else if ((i % 10) == 7)
                            temp_text_flat += (i + 1) + ". " + select_letter[i] + " +:下頁\n";
                    }
                    else
                        temp_text_flat += (i + 1) + ". " + select_letter[i] + " ";
                    i++;    
                    counter++;
                }
                if (thispage < totalpage && thispage > 1){
                    temp_text += "+:下一頁 -:上一頁";
                    if (next_flag == true)
                        temp_text_flat += " +:下頁";
                    temp_text_flat += " -:上頁";
                }
                else{
                    temp_text += "+:下一頁";
                    temp_text_flat += " +:下頁";
                }

                if (mode == 1)
                    temp_text = "候選字\n" + temp_text;
                if (mode == 2)
                    temp_text = "關聯詞\n" + temp_text;
                $("#show").html(temp_text);
                $("#show_flat").html(temp_text_flat);
            }
        }
        else    
            return;
    });

    $("#btn_next").click(function(){                            // 在小螢幕模式時的"下一頁"按鈕
        var prompt_txtbox = $("#prompt");
        var prompt_flat_txtbox = $("#prompt_flat");
        if (mode == 0){
            prompt_txtbox.val("現在還不能換頁!");
            prompt_flat_txtbox.val("現在還不能換頁!");
            caption_effect();
            return;
        }
        if (totalpage > 1){
            if (mode != 0 && reachTail() == true){              // 選字模式下，若翻頁已達末頁，則+號無效
                prompt_txtbox.val("已達末頁!");
                prompt_flat_txtbox.val("已達末頁!");
                caption_effect();
                return;
            }
            else{
                thispage++;                                     // 刷新頁數
                var temp_text = "";
                var temp_text_flat = "";
                var i = 0 + (10 * (thispage - 1));
                var counter = 0;
                var next_flag = false;
                while (i < number_letters && counter < 10){
                    temp_text += (i + 1) + ". " + select_letter[i] + "\n";
                    if (((i % 10) == 3 || (i % 10) == 7) && (thispage < totalpage)){
                        if ((i % 10) == 3) 
                            temp_text_flat += (i + 1) + ". " + select_letter[i] + "\n";
                        if (((i % 10) == 7) && (select_letter[i + 1].length <= 4) && (select_letter[i + 2].length <= 4)){
                            temp_text_flat += (i + 1) + ". " + select_letter[i] + "\n";
                            next_flag = true;
                        }
                        else if (((i % 10) == 7))
                            temp_text_flat += (i + 1) + ". " + select_letter[i] + " +:下頁\n";
                    }
                    else if (((i % 10) == 3 || (i % 10) == 7) && (thispage == totalpage)){
                        if ((i % 10) == 3) 
                            temp_text_flat += (i + 1) + ". " + select_letter[i] + "\n";
                        if ((i % 10) == 7)
                            temp_text_flat += (i + 1) + ". " + select_letter[i] + "\n";
                    }
                    else
                        temp_text_flat += (i + 1) + ". " + select_letter[i] + " ";
                    i++;    
                    counter++;
                }
                if (thispage < totalpage){
                    temp_text += "+:下一頁 -:上一頁";
                    if (next_flag == true)
                        temp_text_flat += " +:下頁";
                    temp_text_flat += " -:上頁";
                }
                else{
                    temp_text += "-:上一頁";
                    temp_text_flat += "-:上頁";
                }
                if (mode == 1)
                    temp_text = "候選字\n" + temp_text; 
                if (mode == 2)
                    temp_text = "關聯詞\n" + temp_text;
                $("#show").html(temp_text);
                $("#show)flat").html(temp_text_flat);
            }
        }
        else
            return;
    });

    $("#undo").click(function(){
        get_record();           
    });

    $("#undo_flat").click(function(){
        get_record();
    });

    $("#copy, #copy_flat").zclip({
        path: '{{ asset("/js/ZeroClipboard.swf") }}',
        copy: function(){
            
            var text = $("#input").html();
            text = remove_tags(text);
            return text;
        }
    });
    $("#zclip-ZeroClipboardMovie_1").click(function(){
        console.log("COPY~");
        var text = $("#input").html();
        text = remove_tags(text);
        if (text != ""){
            $("#prompt").val('已複製到剪貼簿!');
            $("#prompt_flat").val('已複製到剪貼簿!');
            caption_effect();
        }
        else{
            $("#prompt").val('沒有內容可複製!');
            $("#prompt_flat").val('沒有內容可複製!');
            caption_effect();
        }
    });

    $("#cut, #cut_flat").zclip({
        path: '{{ asset("/js/ZeroClipboard.swf") }}',
        copy: function(){
            
            var text = $("#input").html();
            text = remove_tags(text);
            return text;
        }
    });
    $("#zclip-ZeroClipboardMovie_2").click(function(){
        console.log("CUT~");
        var text = $("#input").html();
        text = remove_tags(text);
        if (text != ""){
            $("#input").html("");
            $("#prompt").val('已剪下到剪貼簿!');
            $("#prompt_flat").val('已剪下到剪貼簿!');
            mode = 0;
            $("#show").html("");
            $("#show_flat").html("");
            caption_effect();   
        }
        else{
            $("#prompt").val('沒有內容可剪下!');
            $("#prompt_flat").val('沒有內容可剪下!');
            caption_effect();       
        }
    });

    $("#btn_initial").click(function(){
        if (mode != 0 && reachHead() == true){                  // 選字模式下，若翻頁已達首頁，則-號無效
            prompt_txtbox.val("已達首頁!");
            prompt_flat_txtbox.val("已達首頁!");
            caption_effect();
            return;
        }
        thispage = 1;                                           // 回到首頁
        var temp_text = "";
        var temp_text_flat = "";
        var i = 0;
        var counter = 0;
        var next_flag = false;
        while  (i < number_letters && counter < 10){
            temp_text += (i + 1) + ". " + select_letter[i] + "\n";
            if (((i % 10) == 3 || (i % 10) == 7) && (thispage < totalpage)){
                if ((i % 10) == 3) 
                    temp_text_flat += (i + 1) + ". " + select_letter[i] + "\n";
                if (((i % 10) == 7) && (select_letter[i + 1].length <= 4) && (select_letter[i + 2].length <= 4)){
                    temp_text_flat += (i + 1) + ". " + select_letter[i] + "\n";
                    next_flag = true;
                }
                else if (((i % 10) == 7))
                temp_text_flat += (i + 1) + ". " + select_letter[i] + " +:下頁\n";
            }
            else
                temp_text_flat += (i + 1) + ". " + select_letter[i] + " ";
            i++;    
            counter++;
        }
        if (totalpage > 1){
            if (thispage < totalpage && thispage > 1){
                temp_text += "+:下一頁 -:上一頁";
                if (next_flag == true)
                    temp_text_flat += " +:下頁";
                temp_text_flat += " -:上頁";
            }
            else{
                temp_text += "+:下一頁";
                temp_text_flat += " +:下頁";
            }

            if (mode == 1)
                temp_text = "候選字\n" + temp_text;
            if (mode == 2)
                temp_text = "關聯詞\n" + temp_text;
            $("#show").html(temp_text);
            $("#show_flat").html(temp_text_flat);
        }
    });

                    
    $("#GO").click(function(){                                  // 教學啟用按鈕"馬上出發"的按下事件
        $("#tutor_panel").slideUp(700);
        $("#hide_push").height(50);
        $("#hide_br").html("<br><br>");                 
        if ($("#prompt_flat").is(":hidden")){
            var pause_timer = setInterval(function(){
                $('html,body').animate({scrollTop: $("#Input_place").offset().top - 75},1200);
                clearInterval(pause_timer);
            },800);
            var pause1 = setInterval(function(){
                $(".lab_qrcode").animate({
                    margin: '0 0'  
                },"slow");
                $("#input").popup({
                    content: '這是輸入欄，請在此輸入台語的羅馬拼音並選字，例如:a, bbe, diong, ggu, uan...等等',
                    position: 'left center'
                }).popup('show');
                var textbox = $("#input");
                var prompt_txtbox = $("#prompt");
                qrcode_toleft();
                clearInterval(pause1);
                var pause2 = setInterval(function(){
                    $("#input").popup('hide');
                    $(".lab_qrcode").animate({
                        margin: '0 28%'  
                    },"slow");
                    $("#select_mode").popup({
                        content: '這是選擇不同輸入模式的下拉式選單',
                        position: 'left center'
                    }).popup('show');
                    clearInterval(pause2);
                    var pause3 = setInterval(function(){
                        $("#select_mode").popup('hide');
                        $(".lab_qrcode").animate({
                            margin: '0 17%'  
                        },"slow");
                        $("#prompt").popup({
                            content: '這是簡易提示欄，成功或失敗操作時會有提示',
                            position: 'left center'
                        }).popup('show');
                        clearInterval(pause3);                                      
                        var pause4 = setInterval(function(){
                            $("#prompt").popup('hide');
                            $(".lab_qrcode").animate({
                                margin: '0 28%'  
                            },"slow");
                            $("#copy").popup({
                                content: '這是複製按鈕，將輸入的文字複製到剪貼簿',
                                position: 'left center'
                            }).popup('show');
                            clearInterval(pause4);
                            var pause5 = setInterval(function(){
                                $("#copy").popup('hide');
                                $("#undo").popup({
                                    content: '這是復原按鈕，按下後將還原至上一步',
                                    position: 'bottom center'
                                }).popup('show');
                                clearInterval(pause5);
                                var pause6 = setInterval(function(){
                                    $("#undo").popup('hide');
                                    $("#cut").popup({
                                        content: '這是剪下按鈕，將輸入的文字剪下到剪貼簿',
                                        position: 'right center'
                                    }).popup('show');
                                    clearInterval(pause6);
                                    var pause7 = setInterval(function(){
                                        $("#cut").popup('hide');
                                        $("#show").popup({
                                            content: '這是文字顯示區，符合拼音的字詞將顯示在裡面',
                                            position: 'right center'
                                        }).popup('show');
                                        clearInterval(pause7);
                                        var pause8 = setInterval(function(){
                                            $("#show").popup('hide');
                                            customJqte.attr('data-variation','large');
                                            customJqte.attr('data-offset',35);
                                            customJqte.popup({
                                                content: '這是文字編輯器，可以將輸入完的字詞在此進行編輯',
                                                position: 'left center'
                                            }).popup('show');
                                            clearInterval(pause8);
                                            var pause9 = setInterval(function(){
                                                customJqte.popup('hide');
                                                generate_prompt_btn();
                                                $("#input").focus();
                                                clearInterval(pause9);
                                            },2500);
                                        },2500);
                                    },2500);
                                },2500);
                            },2500);
                        },2500);
                    },2500);
                },2500);
            },2000);
        }
        else{
            var pause_timer = setInterval(function(){
                $('html,body').animate({scrollTop: ($("#Input_place").offset().top - 150)},1200);
                clearInterval(pause_timer);
            },800);
            var pause1 = setInterval(function(){
                $("#input").popup({
                    content: '這是輸入欄，請在此輸入台語的羅馬拼音並選字，例如:a, bbe, diong, ggu, uan...等等',
                    position: 'top center'
                }).popup('show');
                clearInterval(pause1);
                var pause2 = setInterval(function(){
                    $("#input").popup('hide');
                    $("#select_mode_flat").popup({
                        content: '這是選擇不同輸入模式的下拉式選單',
                        position: 'left center'
                    }).popup('show');
                    clearInterval(pause2);
                    var pause3 = setInterval(function(){
                        $("#select_mode_flat").popup('hide');
                        $("#prompt_flat").popup({
                            content: '這是簡易提示欄，成功或失敗操作時會有提示',
                            position: 'right center'
                        }).popup('show');
                        clearInterval(pause3);
                        var pause4 = setInterval(function(){
                            $("#prompt_flat").popup('hide');
                            $("#copy_flat").popup({
                                content: '這是複製按鈕，將輸入的文字複製到剪貼簿',
                                position: 'top center'
                            }).popup('show');
                            clearInterval(pause4);
                            var pause5 = setInterval(function(){
                                $("#copy_flat").popup('hide');
                                $("#undo_flat").popup({
                                    content: '這是復原按鈕，按下後將還原至上一步',
                                    position: 'bottom center'
                                }).popup('show');
                                clearInterval(pause5);
                                var pause6 = setInterval(function(){
                                    $("#undo_flat").popup('hide');
                                    $("#cut_flat").popup({
                                        content: '這是剪下按鈕，將輸入的文字剪下到剪貼簿',
                                        position: 'top center'
                                    }).popup('show');
                                    clearInterval(pause6);
                                    var pause7 = setInterval(function(){
                                        $("#cut_flat").popup('hide');
                                        $("#show_flat").popup({
                                            content: '這是文字顯示區，符合拼音的字詞將顯示在裡面',
                                            position: 'top center'
                                        }).popup('show');
                                        clearInterval(pause7);
                                        var pause8 = setInterval(function(){
                                            $("#show_flat").popup('hide');
                                            $(".jqte").popup({
                                                content: '這是文字編輯器，可以將輸入完的字詞在此進行編輯',
                                                position: 'top center',
                                            }).popup('show');                                                           
                                            clearInterval(pause8);
                                            var pause9 = setInterval(function(){
                                                $(".jqte").popup('hide');
                                                generate_prompt_btn();
                                                $("#input").focus();
                                                clearInterval(pause9);
                                            },2500);
                                        },2500);
                                    },2500);
                                },2500);
                            },2500);
                        },2500);
                    },2500);
                },2500);
            },1500);
        }
    });

    $("#NO").click(function(){
        $("#tutor_panel").slideUp(700);
        $("#hide_push").height(50);
        $("#hide_br").html("<br><br>");
        generate_prompt_btn();

        if ($("#prompt_flat").is(":hidden")){
            var pause_timer = setInterval(function(){
                $('html,body').animate({scrollTop: $("#Input_place").offset().top - 75},1500);
                clearInterval(pause_timer);
            },800);
            $("#input").focus();
        }
        else{
            var pause_timer = setInterval(function(){
                $('html,body').animate({scrollTop: ($("#Input_place").offset().top - 150)},1500);
                clearInterval(pause_timer);
            },800);
            $("#input").focus();
        }
    });

    var form_elements = ["#email","#uid","#password","#password_confirm","#nickname"];
    var error_arr = ["#error_email","#error_prompt1","#error_prompt2","#error_prompt3","#error_prompt4"];

    $("#close_modal").click(function(){
        var all_blank = true;
        for(var i = 0; i < form_elements.length; i++){
            if ($(form_elements[i]).val() != ""){
                all_blank = false;
                break;
            }
        }
        if (all_blank){
            $("#myModal").modal('hide');
        }
        else{
            $("#close_myModal").modal('show');
            $("#delete_modal").click(function(){
                for(var i = 0; i < form_elements.length; i++){
                    $(form_elements[i]).val("");
                    $(error_arr[i]).hide();
                }
                $("#close_myModal").modal('hide');
            });
            $("#cancel_modal").click(function(){
                $("#close_myModal").modal('hide');
                $("#myModal").modal('show');
            });
            $("#close_modal3").click(function(){
                $("#close_myModal").modal('hide');
                $("#myModal").modal('show');
            });
        }
    });

    $(form_elements[0]).focusin(function(){
        $(error_arr[0]).hide();
    });
    $(form_elements[1]).focusin(function(){
        $(error_arr[1]).hide();
    });
    $(form_elements[2]).focusin(function(){
        $(error_arr[2]).hide();
    });
    $(form_elements[3]).focusin(function(){
        $(error_arr[3]).hide();
    });
    $(form_elements[4]).focusin(function(){
        $(error_arr[4]).hide();
    });

    var error_login1 = $("#error_login_prompt1");
    var error_login2 = $("#error_login_prompt2");
    $("#login_uid").focusin(function(){
        error_login1.hide();
    });
    $("#login_password").focusin(function(){
        error_login2.hide();
    });
                                        
    for (i = 0; i < nav_arr.length; i++){
        $(nav_arr[i]).mouseenter(function(){$(this).css('color',"white");});
    }
                
    $("body").on('mouseleave',nav_arr[0],function(){
        $(nav_arr[0]).css('color',nav_color[0]);
    });
    $("body").on('mouseleave',nav_arr[1],function(){
        $(nav_arr[1]).css('color',nav_color[1]);
    });
    $("body").on('mouseleave',nav_arr[2],function(){
        $(nav_arr[2]).css('color',nav_color[2]);
    });
    $("body").on('mouseleave',nav_arr[3],function(){
        $(nav_arr[3]).css('color',nav_color[3]);
    });
    $("body").on('mouseleave',nav_arr[4],function(){
        $(nav_arr[4]).css('color',nav_color[4]);
    });