
//  Выставление параметров по умолчанию, если ранее они не были установлены.
function setDefaultParams(){
    chrome.storage.local.get(function(resp){
        console.log(resp);
        if(resp["settings"] == undefined){  //  Если в локальном хранилище еще нет сохраненных настроек.
            var settingsArray = {
                LabelSoldOutItems : 0,
                ShowSoldOutItems : 1,
                MinimalisticDesign : 0,
                AutoChangeBg : 1,
                InterfaceLanguage : "ru"
            };

            chrome.storage.local.set({ 'settings' : settingsArray},function(){
                console.log("Настройки сохранены в локальном хранилище.");
            });
        }else{
            console.log("Параметры уже были сохранены.");
        }
    });
    
}

function removeAllParams(){
    chrome.storage.local.remove( "settings", function() {
        console.log('Settings removed!');
    });
}

//  Устанавливает параметры записанные в локальном хранилище.
function getParams(){
    chrome.storage.local.get('settings',function(resp){
        var paramArray = resp["settings"];
        for(var param in paramArray){
            if(paramArray.hasOwnProperty(param)){
               if(paramArray[param].length == undefined){   //  Если состояним может быть только 0 или 1.
                    if(paramArray[param] == 1){
                        $("#" + param).attr("checked","");   
                    }else{
                        $("#" + param).attr("checked");   
                    }
                }else{  //  Если состояние описывается не 0 или 1.
                    $("#" + param).val(paramArray[param]);
                }  
            }
        }
        
    });
}

//  Изменяет значение параметра в локальном хранилище.
function changeParam(param){
    console.log();
    var state = 0;
    var newParamArray = {};
    if($("#" + param).attr("type") == "checkbox"){  //  Работа с checkbox.
        if($("#" + param).attr("checked") == undefined){    //  Устанавливаем галочку.
            $("#" + param).attr("checked","");
            state = 1;
        }else{  //  Снимаем галочку.
            state = 0;
            $("#" + param).removeAttr("checked");
        }
    }else{  //  Работа с select.
        state = $("#" + param).val();
    }
    chrome.storage.local.get('settings', function(result){
        var storedArray = result["settings"];
        var newValue = 0;
        for(var prop in storedArray){
            if(storedArray.hasOwnProperty(prop)){
                newValue = storedArray[prop];   //  Copy old value;
                if(prop == param){
                    newValue = state;   //  Paste new value;
                }
                newParamArray[prop] = newValue;
            }
        }
        //  Записываем параметр в локальное хранилище.
        chrome.storage.local.set({ 'settings' : newParamArray},function(){
            console.log("Параметр был изменен.");
        });
    });
}

//  Navigation functions.   Сократить и объединить в 1 функцию.
function showCommonSettings(){
    $("#purchase-settings-content").css("display","none");
    $("#support-content").css("display","none");
    $("#donate-content").css("display","none");
    $("#common-settings-content").fadeIn(500);
}
function showPurchaseSettings(){
    $("#common-settings-content").css("display","none");
    $("#support-content").css("display","none");
    $("#donate-content").css("display","none");
    $("#purchase-settings-content").fadeIn(500);
}
function showSupport(){
    $("#common-settings-content").css("display","none");
    $("#purchase-settings-content").css("display","none");
    $("#donate-content").css("display","none");
    $("#support-content").fadeIn(500);
}
function showDonate(){
    $("#common-settings-content").css("display","none");
    $("#purchase-settings-content").css("display","none");
    $("#support-content").css("display","none");
    $("#donate-content").fadeIn(500);
}

$(document).ready(function() {
    $("#common-settings-content").fadeIn(500);
    //  Проверяем присутствие дефолтных настроек.
    setDefaultParams();
    //  Загружаем ранее установленные настройки из локального хранилища.
    getParams();
    //  Nav bar button actions.
    document.getElementById("common-settings").addEventListener("click", showCommonSettings); 
    document.getElementById("purchase-settings").addEventListener("click", showPurchaseSettings);
    document.getElementById("support-settings").addEventListener("click", showSupport);
    document.getElementById("settings-donate").addEventListener("click", showDonate);
    
    //  Лиснеры изменения состояния чекбоксов.
    //document.getElementById("MinimalisticDesign").addEventListener("change", function(){console.log("Change;");});
    document.getElementById("LabelSoldOutItems").addEventListener("change", function(){changeParam("LabelSoldOutItems");});
    document.getElementById("ShowSoldOutItems").addEventListener("change", function(){changeParam("ShowSoldOutItems");});
    
    document.getElementById("MinimalisticDesign").addEventListener("change", function(){changeParam("MinimalisticDesign");});
    document.getElementById("AutoChangeBg").addEventListener("change", function(){changeParam("AutoChangeBg");});
    
    document.getElementById("InterfaceLanguage").addEventListener("change", function(){changeParam("InterfaceLanguage");});
});