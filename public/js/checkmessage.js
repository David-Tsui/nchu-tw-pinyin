function CheckEmail()
{
    var email = document.getElementById("mes_email").value;
    reg = /^[^\s]+@[^\s]+\.[^\s]{2,3}$/;
    if (email == "")
    {
        $("#email_check_mes").html("<i class='remove circle icon'></i>" + "請輸入E-Mail!");
        $("#email_check_mes").css({"color":"red", "font-size":"15px"});
        return false;
    }
    if (reg.test(email))
    {
        $("#email_check_mes").html("<i class='ok circle icon'></i>" + "E-Mail 格式正確!");
        $("#email_check_mes").css({"color":"blue", "font-size":"15px"});
        return true;
    }
    else
    {
        $("#email_check_mes").html("<i class='remove circle icon'></i>" + "E-Mail 格式錯誤!");
        $("#email_check_mes").css({"color":"red", "font-size":"15px"});
        return false;
    }
}

function CheckName()
{
    var name = document.getElementById("mes_name").value;
    if (name == "")
    {
        $("#name_check_mes").html("<i class='remove circle icon'></i>" + "請輸入姓名");
        $("#name_check_mes").css({"color":"red", "font-size":"15px"});
        $("#name_check_mes").show();
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
    var title = document.getElementById("mes_title").value;
    if (title == "")
    {
        $("#title_check_mes").html("<i class='remove circle icon'></i>" + "請輸入主旨");
        $("#title_check_mes").css({"color":"red", "font-size":"15px"});
        $("#title_check_mes").show();
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
    var comment = document.getElementById("mes_comment").value;
    if (comment == "")
    {
        $("#comment_check_mes").html("<i class='remove circle icon'></i>" + "請輸入內容");
        $("#comment_check_mes").css({"color":"red", "font-size":"15px"});
        $("#comment_check_mes").show();
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