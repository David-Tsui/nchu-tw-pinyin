function CheckEmail()
{
    var email = $("#mes_email").val();
    reg = /^[^\s]+@[^\s]+\.[^\s]{2,3}$/;
    if (email == "")
    {
        $("#email_check_mes").html("<i class='remove circle icon'></i>" + "請輸入E-Mail!");
        $("#email_check_mes").css({"color":"red", "font-size":"15px"});
        $("#email_check_mes").show();
        $("#mes_email").focus(function(){$("#email_check_mes").hide();});
        return false;
    }
    if (reg.test(email))
    {
        $("#email_check_mes").hide();
        return true;
    }
    else
    {
        $("#email_check_mes").html("<i class='remove circle icon'></i>" + "E-Mail 格式錯誤!");
        $("#email_check_mes").css({"color":"red", "font-size":"15px"});
        $("#email_check_mes").show();
        $("#mes_email").focus(function(){$("#email_check_mes").hide();});
        return false;
    }
}

function CheckName()
{
    var name = $("#mes_name").val();
    if (name == "")
    {
        $("#name_check_mes").html("<i class='remove circle icon'></i>" + "請輸入姓名");
        $("#name_check_mes").css({"color":"red", "font-size":"15px"});
        $("#name_check_mes").show();
        $("#mes_name").focus(function(){$("#name_check_mes").hide();});
        return false;
    }
    else
    {
        $("#name_check_mes").hide();
        return true;
    }
}

function CheckTitle()
{
    var title = $("#mes_title").val();
    if (title == "")
    {
        $("#title_check_mes").html("<i class='remove circle icon'></i>" + "請輸入主旨");
        $("#title_check_mes").css({"color":"red", "font-size":"15px"});
        $("#title_check_mes").show();
        $("#mes_title").focus(function(){$("#title_check_mes").hide();});
        return false;
    }
    else
    {
         $("#title_check_mes").hide();
         return true;
    }
}

function CheckComment ()
{
    var comment = $("#mes_comment").val();
    if (comment == "")
    {
        $("#comment_check_mes").html("<i class='remove circle icon'></i>" + "請輸入內容");
        $("#comment_check_mes").css({"color":"red", "font-size":"15px"});
        $("#comment_check_mes").show();
        $("#mes_comment").focus(function(){$("#comment_check_mes").hide();});
        return false;
    }
    else
    {
        $("#comment_check_mes").hide();
        return true;
    }
}

function CheckBeforeSubmit()
{
    var SubmitFlag = true;

    SubmitFlag = CheckEmail();
    SubmitFlag = CheckName();
    SubmitFlag = CheckTitle();
    SubmitFlag = CheckComment();
    if (SubmitFlag)
        return true;
    else
        return false;
}

function truncateMessage()
{
    var arr = ["#mes_name","#mes_email","#mes_title","#mes_comment"];
    for(var i = 0; i < arr.length; i++)
        $(arr[i]).val("");
    $("#name_check_mes, #email_check_mes, #title_check_mes, #comment_check_mes").hide();
    return false;
}