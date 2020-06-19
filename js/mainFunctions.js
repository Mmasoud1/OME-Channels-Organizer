//-- Coded by Mohamed Masoud, Dr. Gutman Lab, Emory University --//
//-- OME Channel Organizer -- //
//-- mainFunctions : 

    //-- Utilites --//
    function findObjectByKey(array, key, value,returnType='DATA') {   // to search any dict or array e.g. Settings.dsaServers. 
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                switch (returnType){
                  case 'DATA':
                   return array[i];
                  case 'INDEX':
                   return i; 
              }
            }
        }
        return null;
    }

    function remove(array, element) { // remove element or record from array
      const index = array.indexOf(element);
      array.splice(index, 1);
    }

    function insert(array, element, index) { // insert element or record into array at specific index
      array.splice(index, 0, element);
    }
  
    function callFunctionByName(funName, param){ // send function name to be called
           return  window[funName](param); 
    }    

    //-- hint message -- //
    function openHint(){
        document.getElementById("hint").style.marginRight = "0";
        document.getElementById("hint").style.width= "350px";
    }   

    function closeHint(){
        document.getElementById("hint").style.marginRight= "-370px";
    }

    function triggerHint( hintMessage = "", messageType = 'info', expire = 2000){
       switch(messageType){
          case 'info':
          {
             document.getElementById("hintParagraph").innerHTML = '<i style="font-size:30px"  class="fa fa-info-circle" ></i> <font size="3" >&nbsp&nbsp'+ hintMessage +' </font> '
             break;             
          }
          case 'error':
          {
             document.getElementById("hintParagraph").innerHTML = '<i style="font-size:30px"  class="fa fa-exclamation-triangle" ></i> <font size="3" >&nbsp&nbsp'+ hintMessage +' </font> '
             break;             
          }          
       }
        openHint()
        setTimeout( function() {
            closeHint();  
        }, expire );
    }

    function getScreenWidth(){
        return screen.width; 

    }

    function getScreenHeight(){
        return screen.height; 

    }

    function getScreenWidthRatio(){
        return screen.width/2144; 

    }    

   function getScreenHeightRatio(){
        return screen.height/1206; 

    }  

   function getScreenCenter(){
        return [screen.width/2, screen.height/2]; 

    }  

   function getElementCenterOnScreen(el){
        elemCoord = el.getBoundingClientRect()
        el.style.marginLeft = (getScreenWidth() - elemCoord.width)/2 +"px"
        el.style.marginTop  = (getScreenHeight() - elemCoord.height)/3 +"px"
    }          
    //------ Left Channel Bar options ----------//

    function viewerZoomTo(zoomValue){
         viewer.viewport.zoomTo( zoomValue);
    }    

    function viewerZoomIn(){
         var zoomValue= viewer.viewport.getZoom();
         if((zoomValue*2)<viewer.viewport.getMaxZoom())
            viewerZoomTo( zoomValue*2 )
         else 
            viewerZoomTo( viewer.viewport.getMaxZoom() )             
    }

    function viewerZoomOut(){
         var zoomValue= viewer.viewport.getZoom();
         if((zoomValue/2)>viewer.viewport.getMinZoom())
            viewerZoomTo( zoomValue/2 )
         else
            viewerZoomTo( viewer.viewport.getMinZoom() )
    }

    function viewerZoomHome(){
         viewerZoomTo( viewer.viewport.getHomeZoom() )
         viewer.viewport.panTo(viewer.viewport.getCenter())
    }  

    function initialZoom(){
         var zoomValue= viewer.viewport.getHomeZoom();
         if((zoomValue*2)<viewer.viewport.getMaxZoom())
            viewerZoomTo( zoomValue*2 )
         else 
            viewerZoomTo( viewer.viewport.getMaxZoom() ) 
    }  

     // -- Info panel -- //
    //-- Post TileSource Info to right Info Panel --//
    function parseMetadataInfo(tileInfo, itemBasicName, type = "ome" ){
      var nodes = "";
      var itemNameExt = type==="ome" ? "-OME Meta" : "-Meta"
      document.getElementById("infoTitle").innerHTML = '&nbsp&nbsp' + itemBasicName + itemNameExt
      document.getElementById("imageInfoTitle").innerHTML = "Image Info:"
      document.getElementById("infoList").innerHTML = "";

      nodes +=    '<li >'+'Width :           '+ tileInfo.width                                             +'</li>'
                 +'<li >'+'Height :          '+ tileInfo.height                                            +'</li>'
                 +'<li >'+'MaxLevel :        '+ tileInfo.maxLevel                                          +'</li>'
                 +'<li >'+'TileSize :        '+ tileInfo.tileWidth                                         +'</li>'

      if(type === "ome"){                 

      nodes +=    '<li >'+'Num Channels :    '+ tileInfo.numChannels                                       +'</li>'                    
                 +'<li >'+'Num Groups :      '+ tileInfo.numGroups                                         +'</li>'  
                 +'<li >'+'Num Stories :     '+ tileInfo.numStories                                        +'</li>'
      }                                                                         

      document.getElementById("infoList").innerHTML += nodes;
      if(!screenStatus.infoPanelFirstEnter){
           showPanel("infoPanel", true) 
           screenStatus.infoPanelFirstEnter =true;
      }     
    } 



    function goToOnlineItem() { 
        var hostUrl = currentHostCollectSelectionStates.hostObject.hostAPI.split("/api")[0]
        var itemId = currentHostCollectSelectionStates.item._id;
        window.open(hostUrl + "/#item/" + itemId); 
    }

   function createNewGroup() { 
        if(!getActiveForm()){
            if(tempSceneSelections.length){
              document.getElementById("grpName").value  = suggestNewGrplabel(tempSceneSelections) 
              var grpForm = document.getElementById("grpLabelForm");
              grpForm.classList.remove("formflashanimation");
              grpForm.style.display = "block";
              getElementCenterOnScreen(grpForm)
              setActiveForm(grpForm)
            }else{
                  triggerHint("Please select channels")
            }
       }else{
            getActiveForm().classList.toggle("formflashanimation"); 
       } 
    }


    function resetChannelCheckboxes() { 
        tempSceneSelections = [];
        var allCheckbox = document.getElementsByClassName("channelCheckboxClass");
        var i;
        for (i = 0; i < allCheckbox.length; i++) {
               allCheckbox[i].innerHTML = '<i class="fa fa-square" >&nbsp&nbsp</i>'
        }

    }

   // ----------- right channel bar labeling ------- //
   function refineChannelName(channelName){
          var refinedLabel = channelName;
          if(channelName.includes(" ")){
              if(channelName.split(" ")[1].length > 2){
                if ( ! channelName.split(" ")[1].slice(0,1).match(/\d+/g) ) { //Is first char after white space not integer
                       refinedLabel = channelName.split(" ")[0] 
                }
              }
           }
           return refinedLabel;
   }     

    // ----------- right panel for group list------- //
   function refineGrpChName(channelName){
          var refinedLabel = channelName;
          if(channelName.includes(" ")){
              if(channelName.split(" ")[1].length > 2){
                if ( ! channelName.split(" ")[1].slice(0,1).match(/\d+/g) ) { //Is first char after white space not integer
                       var secondLabel = channelName.split(" ")[1].slice(0,2)  // secondLabel is the label after the space
                       refinedLabel = channelName.split(" ")[0] + " " + secondLabel
                }
              }
              refinedLabel= refinedLabel.replace(" ", ".")
           }
           return refinedLabel;
   } 


   // ----- Used by add new group from to suggest automatically group name ---- // 
   function suggestNewGrplabel(selectedChannels) {
        var grplabel = "";
        for (var index=0; index < selectedChannels.length; index++)
          {
             if( (grplabel.length + refineGrpChName(selectedChannels[index].channel_name).length )< currentItemInfo.maxGroupLabelLen){
                 grplabel = grplabel + refineGrpChName(selectedChannels[index].channel_name)
                 if(index < (selectedChannels.length-1)){
                   if ( (grplabel.length + refineGrpChName(selectedChannels[index+1].channel_name).length + "+/".length)< currentItemInfo.maxGroupLabelLen) {
                     grplabel = grplabel + "+/"
                   }else{
                     grplabel = grplabel + "..."
                   }
                 }  
              }    
          }
        return grplabel;
    }  



    // ---- New Channels Group functions ------//
    function getKeyValues(obj, key) {
        var result = [];
        for (var index=0; index < obj.length; index++){
            result.push(obj[index][key]);
          }
        return result;
    }

    function getNewGrpPath(grpChannels) {
        var path = "";
        for (var index=0; index < grpChannels.length; index++){
             path = path + grpChannels[index].channel_number + "___" + grpChannels[index].channel_name
             if(index < (grpChannels.length-1)) path = path + "---"
          }
        return path;
    }    


    function addNewGrpBtn() {
      if( document.getElementById("grpName").value != ""){
          document.getElementById("grpLabelForm").style.display = "none"
          var grpEntryColorArray = tempSceneSelections.length<=colorContrastMap.length? getKeyValues(colorContrastMap, "color").splice(0, tempSceneSelections.length ) : createGrpColorsArray(tempSceneSelections.length);

          var grpEntryContrastMax = tempSceneSelections.length<=colorContrastMap.length? getKeyValues(colorContrastMap, "contrast_Max").splice(0, tempSceneSelections.length ) : createContrastMaxArray(grpEntryColorArray);

          var grpEntryContrastMin = tempSceneSelections.length<=colorContrastMap.length? getKeyValues(colorContrastMap, "contrast_Min").splice(0, tempSceneSelections.length ) : createContrastMinArray(grpEntryColorArray) ;

          var grpEntry = ({ 
            Format: "jpg", 
            Name:  document.getElementById("grpName").value,
            Path: getNewGrpPath(tempSceneSelections),
            Channels: getKeyValues(tempSceneSelections, "channel_name"),
            Colors: grpEntryColorArray,
            Contrast_Max: grpEntryContrastMax ,
            Contrast_Min: grpEntryContrastMin ,
            Numbers: getKeyValues(tempSceneSelections, "channel_number")
          })

          currentItemInfo.omeDataset .Groups.push( grpEntry )
          initItemGroupsList();
          resetChannelCheckboxes();
          resetActiveFormState();
      }
    }



   //------------ Channel bar left---------------//
   function onCurGrpChOsdShowHide(groupIndex, grpChannelIndex){

    if ((curChColorContrastStates.chIndex === undefined)|| curChColorContrastStates.changesCanceled || curChColorContrastStates.changesComfirmed){

        if (document.getElementById("eyeIcon." + grpChannelIndex).className === "fa fa-eye"){
              document.getElementById("eyeIcon." + grpChannelIndex).className = "fa fa-eye-slash"
              viewer.world.getItemAt(grpChannelIndex).setOpacity(0);
        }else{
               document.getElementById("eyeIcon." + grpChannelIndex).className = "fa fa-eye"
               viewer.world.getItemAt(grpChannelIndex).setOpacity(1);
        }
        showPanel("chColorContrastPanel", false) 
    }else{

         triggerHint("Confirm or Cancel CHNL Settings")
    }
   }

   //------------ Channel Settings Panel ---------------//
    function resetChColorContrastStates(){
    }

    function hideAllChExcept(groupIndex, grpChannelIndex){
        var curGroup = currentItemInfo.omeDataset.Groups[groupIndex-1];
        curGroup.Colors.forEach(function (clr, idx) {
           if(idx == grpChannelIndex){
                  if (document.getElementById("eyeIcon." + grpChannelIndex).className === "fa fa-eye-slash"){
                       document.getElementById("eyeIcon." + grpChannelIndex).className = "fa fa-eye"
                  }
                  viewer.world.getItemAt(grpChannelIndex).setOpacity(1);   
          }else{
                  document.getElementById("eyeIcon." + idx).className = "fa fa-eye-slash"
                  viewer.world.getItemAt(idx).setOpacity(0);
          } 
       })
     }


    function onChSettingsAdjust(groupIndex, grpChannelIndex, min, max, color = null){
        var curGroup = currentItemInfo.omeDataset.Groups[groupIndex-1];
        var curChannelName = curGroup.Channels[grpChannelIndex];
        var channelColor = null;
        if (color == null)
            channelColor = curGroup.Colors[grpChannelIndex];
        else
            channelColor = color;

        var omeChannelIndex = curGroup.Numbers[grpChannelIndex];
        var hostAPI = currentHostCollectSelectionStates.hostObject.hostAPI
        var item = currentHostCollectSelectionStates.item;
          
        var palette1 = "rgb(0,0,0)"
        var palette2 = rgbObj2Str(hexToRgb(channelColor))
        var tileToReplace = viewer.world.getItemAt(grpChannelIndex);

        viewer.addTiledImage({
          tileSource: getOMETileSourceColored(hostAPI, item._id, omeChannelIndex, palette1, palette2, min, max),
          opacity: 1,
          index: grpChannelIndex,
          success: function (obj) {
            viewer.world.removeItem(tileToReplace)
          }
        });
   }

   function getColorValue(){
       var colorValue = document.getElementById("chColorInputId").value
       if(colorValue.includes("#")){
          colorValue = colorValue.split("#")[1] // exclude # sign 
       }
       return colorValue
   }

   function getSlideContrastMax(){
       var maxValue = document.getElementById("maxContrastRange").value
       return maxValue
   }

   function getSlideContrastMin(){
       var minValue = document.getElementById("minContrastRange").value
       return minValue
   }

   
   function comfirmChColorContrastChanges(){
       var groupIndex = curChColorContrastStates.grpIndex
       var grpChannelIndex = curChColorContrastStates.chIndex 

       currentItemInfo.omeDataset.Groups[groupIndex-1].Contrast_Max[grpChannelIndex] = curChColorContrastStates.newContrastMax
       currentItemInfo.omeDataset.Groups[groupIndex-1].Contrast_Min[grpChannelIndex] = curChColorContrastStates.newContrastMin
       currentItemInfo.omeDataset.Groups[groupIndex-1].Colors[grpChannelIndex] = curChColorContrastStates.newColor;

       curChColorContrastStates.changesComfirmed = true;
       curChColorContrastStates.lastCommand = "Comfirm"
       showPanel("chColorContrastPanel", false) 
       onItemSelectedGroup(groupIndex, true) // Group refresh = true 
   }
   
   function cancelChColorContrastChanges(){

       resetChColorContrastChanges();
       curChColorContrastStates.changesCanceled = true;  
       curChColorContrastStates.lastCommand = "Cancel" 
       showPanel("chColorContrastPanel", false) 
   
   }

   
   function resetChColorContrastChanges(){
       var grpChannelIndex = curChColorContrastStates.chIndex  
       document.getElementById("maxContrastRange").value =  curChColorContrastStates.originalContrastMax
       document.getElementById("minContrastRange").value =  curChColorContrastStates.originalContrastMin
       document.getElementById("chColorInputId").value  = curChColorContrastStates.originalColor
       $("#chColorInputId").spectrum({
                                        color: curChColorContrastStates.originalColor
                                    });       
       curChColorContrastStates.newContrastMax = curChColorContrastStates.originalContrastMax
       curChColorContrastStates.newContrastMin = curChColorContrastStates.originalContrastMin
       curChColorContrastStates.newColor = curChColorContrastStates.originalColor
       document.getElementById("contrastMaxValueTooltip").innerHTML = curChColorContrastStates.originalContrastMax;
       document.getElementById("contrastMinValueTooltip").innerHTML = curChColorContrastStates.originalContrastMin;  
       document.getElementById("chColorInputTooltip").innerHTML = curChColorContrastStates.originalColor;  
       
       contrastChanged();
       changeChSpanColor(grpChannelIndex, curChColorContrastStates.originalColor)
       changeContrastSliderThumbColor(curChColorContrastStates.originalColor)
       curChColorContrastStates.lastCommand = "Reset"
   } 

   function onColorPickerMouseover(){
       document.getElementById("chColorInputTooltip").innerHTML = getColorValue();  

   }

   function onContrastMaxSliderMouseover(){
       document.getElementById("contrastMaxValueTooltip").innerHTML = getSlideContrastMax();
   } 

   function onContrastMinSliderMouseover(){
       document.getElementById("contrastMinValueTooltip").innerHTML = getSlideContrastMin();
   } 

  function chColorChanged(){
        var groupIndex = curChColorContrastStates.grpIndex
        var grpChannelIndex = curChColorContrastStates.chIndex  
        curChColorContrastStates.newColor = getColorValue();
        document.getElementById("chColorInputTooltip").innerHTML = getColorValue();  
        onChSettingsAdjust(groupIndex, grpChannelIndex, getSlideContrastMin(), getSlideContrastMax(), getColorValue())
        changeChSpanColor(grpChannelIndex, getColorValue())
        changeContrastSliderThumbColor(getColorValue())

  }

   function contrastChanged(){    
       var groupIndex = curChColorContrastStates.grpIndex
       var grpChannelIndex = curChColorContrastStates.chIndex    
       curChColorContrastStates.newContrastMax = getSlideContrastMax();
       curChColorContrastStates.newContrastMin = getSlideContrastMin(); 
       onChSettingsAdjust(groupIndex, grpChannelIndex, getSlideContrastMin(), getSlideContrastMax(), getColorValue())
   }  

   function changeChSpanColor(grpChannelIndex, spanColor){
            if(spanColor.length == 6){
               spanColor = '#'+spanColor 
            }
            document.getElementById("chColorSpanId."+grpChannelIndex).style.backgroundColor = spanColor;
   }

   function changeContrastSliderThumbColor(thumbColor){
        if(thumbColor.length == 6){
           thumbColor = '#'+thumbColor 
        }
        var styleScript = document.createElement('style');
        styleScript.type = 'text/css';
        if(!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)){
          styleScript.innerHTML = '.slider::-webkit-slider-thumb{width: 10px;  height: 25px; background:' +thumbColor + '; cursor: pointer;}';
        }
        if((navigator.userAgent.toLowerCase().indexOf('firefox') > -1)|| (typeof InstallTrigge !== 'undefined')){
          styleScript.innerHTML = '.slider::-moz-range-thumb {width: 10px;  height: 25px; background:' +thumbColor + '; cursor: pointer;}';        
        }
        document.getElementsByTagName('head')[0].appendChild(styleScript);
        document.getElementById('maxContrastRange').className = 'slider';
   }
   
   function customizeChColor(groupIndex, grpChannelIndex){
        if ((curChColorContrastStates.chIndex === undefined)|| curChColorContrastStates.changesCanceled || curChColorContrastStates.changesComfirmed){
              var curGroup = currentItemInfo.omeDataset.Groups[groupIndex-1];
              curChColorContrastStates = new chColorContrastStates();

              curGroup.Colors.forEach(function (clr, idx) {
                 if(idx == grpChannelIndex){
                    if (document.getElementById("eyeIcon." + grpChannelIndex).className === "fa fa-eye-slash"){
                          document.getElementById("eyeIcon." + grpChannelIndex).className = "fa fa-eye"
                    }
                    viewer.world.getItemAt(grpChannelIndex).setOpacity(1);
                    changeContrastSliderThumbColor(clr)
                    document.getElementById("maxContrastRange").value = currentItemInfo.omeDataset.Groups[groupIndex-1].Contrast_Max[idx]
                    document.getElementById("minContrastRange").value = currentItemInfo.omeDataset.Groups[groupIndex-1].Contrast_Min[idx]
                    document.getElementById("chColorInputId").value  = clr;
                    $("#chColorInputId").spectrum({
                                                    color: "#"+clr
                                                });

                    curChColorContrastStates.originalColor = curChColorContrastStates.newColor = clr // color in Hex
                    curChColorContrastStates.originalContrastMax = curChColorContrastStates.newContrastMax = currentItemInfo.omeDataset.Groups[groupIndex-1].Contrast_Max[idx]
                    curChColorContrastStates.originalContrastMin = curChColorContrastStates.newContrastMin = currentItemInfo.omeDataset.Groups[groupIndex-1].Contrast_Min[idx]
                    curChColorContrastStates.chIndex = grpChannelIndex
                    curChColorContrastStates.grpIndex = groupIndex
                    showPanel("chColorContrastPanel", true)   

                  }else{
                          document.getElementById("eyeIcon." + idx).className = "fa fa-eye-slash"
                          viewer.world.getItemAt(idx).setOpacity(0);
                  } 
              })
        } else{

               document.getElementById("chColorContrastPanel").classList.toggle("formflashanimation")
               triggerHint("Confirm or Cancel CHNL Settings")
        } 
   }


    function resetGrpSelection(){
        if(lastItemSelectionStates.grpIndex!=0){
            document.getElementById("itemGrpLi"+lastItemSelectionStates.grpIndex).style.backgroundColor = Opts.defaultElemBgColor;
            document.getElementById("itemGrpFont"+ lastItemSelectionStates.grpIndex).style.color = Opts.defaultElemFontColor;
            lastItemSelectionStates.grpIndex = 0
        }
    }


    function onItemSelectedGroup(groupIndex, grpRefresh = false){
        if((lastItemSelectionStates.grpIndex==groupIndex)&&(grpRefresh == false)){
            return 0;
        }
        if(lastItemSelectionStates.grpIndex!=0){
            document.getElementById("itemGrpLi"+lastItemSelectionStates.grpIndex).style.backgroundColor = Opts.defaultElemBgColor;
            document.getElementById("itemGrpFont"+ lastItemSelectionStates.grpIndex).style.color = Opts.defaultElemFontColor;
        }
        document.getElementById("itemGrpLi"+groupIndex).style.backgroundColor = Opts.selectedElemBgColor;
        document.getElementById("itemGrpFont"+groupIndex).style.color= Opts.selectedElemFontColor;
        lastItemSelectionStates.grpIndex= groupIndex;

        var curGroup = currentItemInfo.omeDataset.Groups[groupIndex-1];
        reloadOSD(curGroup);
        // //--Initialize annotation labels on right panel--//
        clearGrpBarRight();
        curGroup.Colors.forEach(function (clr, idx) {
             document.getElementById("grpListViewBar").innerHTML+= '<a href="javascript:void(0)" ><span id="chColorSpanId.'+idx+'" style="background-color:'+'\#'+clr+';   padding-left:10px;" onclick = "customizeChColor('+groupIndex+','+idx+')">&nbsp</span>&nbsp<i id="eyeIcon.'+idx+'" class="fa fa-eye" aria-hidden="true" onclick="onCurGrpChOsdShowHide('+groupIndex+','+idx+')" style="font-size:12px">'+'<font style = "font-family: Impact, Charcoal, sans-serif;" >&nbsp&nbsp'+ refineChannelName(curGroup.Channels[idx]) + '</font></i></a>'
        })
    }

    function getMaxGroupLabelLen(){
        var maxLabelLen = 0;
        if(currentItemInfo.omeDataset .Groups.length){ // if there is a preexistent groups 
          for(var i=0; i< currentItemInfo.omeDataset .Groups.length; i++){
               if (maxLabelLen < currentItemInfo.omeDataset.Groups[i].Name.length)
                   maxLabelLen = currentItemInfo.omeDataset.Groups[i].Name.length
            }
        }else{
            maxLabelLen = Opts.maxGroupLabelLen; 
        }
        return maxLabelLen;
    }



    function uploadGrpChanges(){
      if(isLoggedIn()){
          var item = currentHostCollectSelectionStates.item;
          var hostAPI = currentHostCollectSelectionStates.hostObject.hostAPI
          var itemMetadataObject = {};
          itemMetadataObject["omeDatasetUpdate"] = currentItemInfo.omeDataset
          updateItemMetadata(hostAPI, item._id, itemMetadataObject, "Object")
       }else{
            triggerHint("Login before upload")
       }   
    }


    function addGrpPanelShow(){
      // Button Add group:  To show channel panel on the left
    } 
                                                                                                                                    

    function updateItemMetadata(hostApi, itemId, metadataObject, uploadType = "Array") {
      switch (uploadType){
             case 'Object':
                            {
                              var metadata = metadataObject ? { metadata: metadataObject } : {};
                               break;             
                            }
              case 'Array':
                            {
                              var metadata =[]
                              var metadataObjToUpload =  metadataObject ? { metadata: metadataObject } : {};
                              metadata.push( metadataObjToUpload)
                              console.log("metadata", metadata)
                              break;             
                            }   
              }    


      return webix.ajax()
        .put(hostApi + "item/" + itemId + "/metadata", metadata)
        .fail(parseError)
        .then((result) =>{ 
                          _parseData(result);
                           triggerHint("Uploaded Successfully")
                        });
    }

     
    function dsaUpdateItemMetadata(hostApi, itemId, metadataObject){
       const metadata = metadataObject ? {metadata: metadataObject} : {};
       webix.ajax().put(hostApi + "/item/" + itemId + "/metadata", metadata)
    }


   function undoGrpListItemRemove(){
    if(tempGrpRemoved.length){
      var grpToUndo = tempGrpRemoved.pop();
      insert(currentItemInfo.omeDataset.Groups, grpToUndo.group, grpToUndo.grpIndex)
      initItemGroupsList();
      if(tempGrpRemoved.length){
         document.getElementById("undoGrpRemove").className = "fa  fa-undo"  
      }
    }
   }
  

   function deleteGrpFromList(groupIndex){

          onCurTileSourceClick()
          var groupToRemove = currentItemInfo.omeDataset.Groups[groupIndex-1];
          tempGrpRemoved.push({ grpIndex: groupIndex-1, group: groupToRemove})
          remove(currentItemInfo.omeDataset.Groups, groupToRemove)
          initItemGroupsList();
          document.getElementById("undoGrpRemove").className = "fa  fa-undo"  

    }
 


    function initItemGroupsList(){ 
        var nodes = "";
        var grpHeaderNode = "";
 
        grpHeaderNode += '<table>'
        grpHeaderNode += '<colgroup> <col style="width:55%"> <col style="width:15%"><col style="width:15%"><col style="width:15%"></colgroup>' 
        grpHeaderNode +=  '<tr>'
        grpHeaderNode +=    '<th style="text-align: left;">' + "Groups:" + '</th>'        

        grpHeaderNode +=    '<th style="text-align: left;"><a href="javascript:void(0)" onclick="undoGrpListItemRemove()"><i id="undoGrpRemove"  style="font-size:15px"  ></i></a></th>'  
        grpHeaderNode +=    '<th style="text-align: left;"><a id="addGrp" href="javascript:void(0)" onclick="addGrpPanelShow()"><i style="font-size:15px" class="fa  fa-plus-square" ></i></a></th>'  
        grpHeaderNode +=    '<th style="text-align: left;"><a id="uploadGrpToDSA" href="javascript:void(0)" onclick="uploadGrpChanges()"><i style="font-size:15px" class="fa  fa-upload" ></i></a></th>' 
        grpHeaderNode +=  '</tr>' 
        grpHeaderNode += '</table>' 

        document.getElementById("itemGroupTitle").innerHTML = grpHeaderNode;

        nodes += '<table>'
        nodes += '<colgroup> <col style="width:85%"> <col style="width:15%"></colgroup>'
        document.getElementById("itemGroupsList").innerHTML=""; 
        for(var i=1; i<= currentItemInfo.omeDataset .Groups.length; i++){
          var groupName = currentItemInfo.omeDataset .Groups[i-1].Name; 

          nodes +=  '<tr >'
          nodes +=    '<th style="text-align: left;">'
          nodes +=      '<li style="background-color: none" id="itemGrpLi'+i+'">'
          nodes +=        ' <a href="javascript:void(0)" onclick="onItemSelectedGroup('+i+')"><font size="2" id="itemGrpFont'+i+'">'+ groupName+'</font></a>'
          nodes +=      '</li>'
          nodes +=    '</th>'
          nodes +=    '<th style="text-align: left;">'
          nodes +=      '<a id="deleteGrp'+i+'" href="javascript:void(0)" onclick="deleteGrpFromList('+i+')"><i style="font-size:15px" class="fa fa-minus-circle" ></i></a>'
          nodes +=    '</th>'
          nodes +=  '</tr>'          
        }
        nodes += '</table>'
        document.getElementById("itemGroupsList").innerHTML +=nodes;
    }     



    function closeGrpForm() {
      var grpForm = document.getElementById("grpLabelForm");
      if (grpForm.style.display === "block") 
      {
         document.getElementById("grpName").value = ""
         grpForm.style.display = "none";
         resetActiveFormState();
      }
    }


    function clearGrpBarRight(){
        if(!(document.getElementById("grpListViewBar").innerHTML === "")){
             var node= document.getElementById("grpListViewBarBtn");
             document.getElementById("grpListViewBar").innerHTML = ""
             document.getElementById("grpListViewBar").append(node)
             showPanel("chColorContrastPanel", false) 
        }

    }

    

     function onCurTileSourceClick(){
          var item = currentHostCollectSelectionStates.item;
          var hostAPI = currentHostCollectSelectionStates.hostObject.hostAPI
          clearOSDViewer()
          clearGrpBarRight()
          resetGrpSelection()
          viewer.addTiledImage({
            tileSource: getTileSource(hostAPI, item._id),
            opacity: 1,
            success: function (obj) {
            }
          });

      }

     function loadEmptyOmeDataset(){
     
     } 

     function initCurrentTileSource(){ 
          var item = currentHostCollectSelectionStates.item;
          var tileSourceName = item.name.split(".")[0]
          var node =  '<li style="background-color: none" id="currentTS"><a href="javascript:void(0)" onclick="onCurTileSourceClick()"><font  size="2" id="curTSFont">'+tileSourceName+'</font></li>'
          document.getElementById("currentTileSource").innerHTML = node;
          if ( currentHostCollectSelectionStates.item.meta.hasOwnProperty('omeDatasetUpdate') ){
                    currentItemInfo.omeDataset = currentHostCollectSelectionStates.item.meta.omeDatasetUpdate;
                    currentItemInfo.dsaSourceExists = true;
                    currentItemInfo.dsaSourceNeedUpdate = false;

          } else  if ( currentHostCollectSelectionStates.item.meta.hasOwnProperty('omeDatasetOriginal') ){  
                    currentItemInfo.omeDataset = currentHostCollectSelectionStates.item.meta.omeDatasetOriginal;
                    currentItemInfo.dsaSourceExists = true;
                    currentItemInfo.dsaSourceNeedUpdate = false;

          }else{
             currentItemInfo.dsaSourceExists = false;
             currentItemInfo.dsaSourceNeedUpdate = true; // If no omeDataset then new groups need to be created and uploaded 
             currentItemInfo.omeDataset = loadEmptyOmeDataset();
          }

          currentItemInfo.maxGroupLabelLen = getMaxGroupLabelLen()
          initItemGroupsList()

      } 

//--------DSA functions ---------------//  

function getCollectionsList(hostApi) {
  var collectionsList = [];
  webix.ajax().sync().get(hostApi + "/collection", function (result) {
    collectionsList = JSON.parse(result)
  })
   return collectionsList;
}


function getFoldersList(hostApi, parentId, parentType="collection") {
  var foldersList = [];
  webix.ajax().sync().get(hostApi + "/folder?parentType=" + parentType + "&parentId=" + parentId + "&sort=lowerName&sortdir=1", function (result) {
    foldersList = JSON.parse(result)
  })

   return foldersList;
}


function getFolderDetails(hostApi, folderId) {
  var folderDetails = [];
  webix.ajax().sync().get(hostApi + "/folder/" + folderId+"/details", function (result) {
    folderDetails = JSON.parse(result)
  })

   return folderDetails;
}


function getFolderItemsList(hostApi, folderId) {
  var itemsList = [];
  webix.ajax().sync().get(hostApi + "/item?folderId=" + folderId + "&sort=lowerName&sortdir=1", function (result) {
    itemsList = JSON.parse(result)
  })
   return itemsList;
}


function getItemObject(hostApi, itemId) {
  var item = [];
  webix.ajax().sync().get(hostApi + "/item/" + itemId, function (result) {
    item = JSON.parse(result)
  })
   return item;
}

function getTileSourceInfo(hostApi, itemId, type = "ome") {
    var tileInfo=[];
    webix.ajax().sync().get(hostApi + "/item/" + itemId + "/tiles", function(data) {
      tileInfo = JSON.parse(data)
      tileInfo['maxLevel'] = tileInfo['levels'] - 1
      tileInfo['minLevel'] = 0
      tileInfo['width'] = tileInfo['sizeX']
      tileInfo['height'] = tileInfo['sizeY']
      if(type === "ome")
         tileInfo['numChannels'] = tileInfo['channels'].length 
    })
    return tileInfo
  }

function getTileSource(hostApi, itemId) {
    var tile=[];
    webix.ajax().sync().get(hostApi + "/item/" + itemId + "/tiles", function(data) {
      tile = JSON.parse(data)
      tile['maxLevel'] = tile['levels'] - 1
      tile['minLevel'] = 0
      tile['width'] = tile['sizeX']
      tile['height'] = tile['sizeY']
      tile['getTileUrl'] = function(level, x, y) {
        return hostApi + "/item/" + itemId + "/tiles/zxy/" + level + "/" + x + "/" + y + "?edge=crop";
      }
    })
    return tile
  }


//------- Tree Selection Events ------------//
function clearOSDViewer(){
  var allLayers = viewer.world.getItemCount();      
  if (allLayers > 0) viewer.world.removeAll();
}

function setMetaToInfoPanel(item){
      var hostAPI = currentHostCollectSelectionStates.hostObject.hostAPI
      var itemBasicName = getItemRootName(itemObj.name.split(".")[0])
      var wsiInfo = getTileSourceInfo(hostAPI, item._id, "not-ome")
      parseMetadataInfo(wsiInfo, itemBasicName, "not-ome")  
}

function setOmeMetaToInfoPanel(item){
      var hostAPI = currentHostCollectSelectionStates.hostObject.hostAPI
      var itemBasicName = getItemRootName(itemObj.name.split(".")[0])
      var omeDataset = itemObj.meta.omeDatasetUpdate || itemObj.meta.omeDatasetOriginal?itemObj.meta.omeDatasetUpdate || itemObj.meta.omeDatasetOriginal :null;
      var numStories = omeDataset&&omeDataset.Stories[0].Waypoints? omeDataset.Stories[0].Waypoints.length : 0;
      var numGroups  = omeDataset&&omeDataset.Groups? omeDataset.Groups.length : 0;      
      var omeInfo = getTileSourceInfo(hostAPI, item._id)
      omeInfo["numGroups"] = numGroups;
      omeInfo["numStories"] = numStories;
      omeInfo["Path"] = hostAPI;

      parseMetadataInfo(omeInfo, itemBasicName)  
}  

function onSelectedTreeItem(item){
  var hostAPI = currentHostCollectSelectionStates.hostObject.hostAPI
  // Next step is needed to avoid "SyntaxError: identifier starts immediately after numeric literal"
  var itemId = item.id.split('_')[1]
  
  itemObj=getItemObject(hostAPI, itemId )
  if (itemObj.largeImage) {
      currentHostCollectSelectionStates.item = itemObj;

       if(lastHostCollectSelectionStates.itemId !== itemId){
          if(lastHostCollectSelectionStates.itemId != null){
              document.getElementById("file_"+lastHostCollectSelectionStates.itemId).style.backgroundColor = Opts.defaultElemBgColor
              document.getElementById("itemFont"+lastHostCollectSelectionStates.itemId).style.color = Opts.defaultElemFontColor 
              document.getElementById("itemFont"+lastHostCollectSelectionStates.itemId).style.fontWeight = Opts.defaultElemFontWeight             
          }
          else{
           //  
          }
      document.getElementById("file_"+itemId).style.backgroundColor= Opts.selectedElemBgColor;
      document.getElementById("itemFont"+itemId).style.color = Opts.selectedElemFontColor;
      document.getElementById("itemFont"+itemId).style.fontWeight = Opts.selectedElemFontWeight
      lastHostCollectSelectionStates.itemId = itemId;
      }

      // --- Show metadata panel for only OME files -- //
      if((itemObj.name.includes(".ome.tif"))&&(itemObj.meta.omeSceneDescription!=null)) {
          setOmeMetaToInfoPanel(itemObj)
      }else if(!itemObj.name.includes(".ome.tif")){
          setMetaToInfoPanel(itemObj)
      } 

      clearOSDViewer()
      viewer.addTiledImage({
        tileSource: getTileSource(hostAPI, itemObj._id),
        opacity: 1,
        success: function (obj) {
                showBarExtention("itemTreeViewBar")
        },
        error: function(obj){
               triggerHint(" Image can not be added, check server", "error")
               showBarBasic("itemTreeViewBar")
        }
      });
  }else{
       triggerHint(" No large Image attribute ")
       } 
}

function appendEmptyNode(elem){
    var nodeUl = document.createElement("UL");
    nodeUl.classList.add("nested")
    var nodeLi = document.createElement("LI");
    var textnode = document.createTextNode("Empty");
    nodeLi.appendChild(textnode);
    nodeUl.appendChild(nodeLi);
    elem.appendChild(nodeUl); 
}

function onTreeClickEvent(){
      var toggler = document.getElementsByClassName("caret");

      var i;
      for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
          if(this.parentElement.querySelector(".nested") == null){
                appendEmptyNode(this)
           }
          this.parentElement.querySelector(".nested").classList.toggle("active");
          this.classList.toggle("caret-down");             
        });
      }
}

function createTree(foldersList) { // recursive call to build the tree 
      var hostAPI = currentHostCollectSelectionStates.hostObject.hostAPI
      var nodes="";
      for(var i=1; i<= foldersList.length; i++){
         var documentName = foldersList[i-1].name;   // documentName can be folder or item(file)
         var documentId = foldersList[i-1]._id;
         var documentType = foldersList[i-1]._modelType;
         if( ! documentType.localeCompare("folder")  ){
             nodes += '<li style="background-color: none" id="folder'+documentId+'"><span class="caret"><font  size="3" id="folderFont'+documentId+'">'+documentName+'</font></span>'

             var folderDetails = getFolderDetails(hostAPI, documentId);   // e.g  "nFolders": 0,  "nItems": 1

             if(folderDetails.nFolders){
                var subFoldersList = getFoldersList(hostAPI, documentId, parentType="folder")
                nodes += '<ul class="nested">'
                nodes += createTree(subFoldersList)  // Recursive call till finish all subfolders with then the collection. 
                nodes += '</ul>' 
              }
              else{
               if(folderDetails.nItems){
                 var itemsList = getFolderItemsList(hostAPI, documentId)
                 nodes += '<ul class="nested">'
                 for(var j=1; j<= itemsList.length; j++)
                 {
                   var itemName = itemsList[j-1].name; 
                   var itemId = itemsList[j-1]._id;
                   
                   nodes += '<li style="background-color: none" id="file_'+itemId+'"><i class="fa fa-file-text-o" ></i><a href="javascript:void(0)" onclick="onSelectedTreeItem(file_'+itemId+')"><font  size="2" id="itemFont'+itemId+'">'+'&nbsp&nbsp'+itemName+'</a></li>'  
                 }
                 nodes += '</ul>' 
               }
             }//end of else
            nodes += '</li>'
         }
         else
          {
            if( ! documentType.localeCompare("item")  )
            {
               nodes +=  '<li style="background-color: none" id="file_'+documentId+'"><a href="javascript:void(0)"  onclick="onSelectedTreeItem(file_'+documentId+')"><font  size="2" id="itemFont'+documentId+'">'+'&nbsp&nbsp' + documentName+'</font></a>'

               nodes += '</li>'   
            }
         }

      }

    return nodes;
}

function clearTreeView(){
      document.getElementById("treeList").innerHTML = "";
      document.getElementById("collectionTreeName").innerHTML = '<i style="font-size:30px"  class="fa fa-tree" ></i> '+ '&nbsp' + "Collection Tree"
}

function renderTreeView(collectionIndex){
      //-- change tree top label --//
      var collectList = currentHostCollectSelectionStates.collectionList;
      var collectionName = collectList[collectionIndex-1].name;
      document.getElementById("collectionTreeName").innerHTML = '<i style="font-size:30px"  class="w3-xxlarge w3-spin fa fa-refresh" ></i> '+ '&nbsp&nbsp' + collectionName

      //-- Render the tree -- //
      var collectionFolders = currentHostCollectSelectionStates.foldersList;
      var nodes = createTree(collectionFolders)
      document.getElementById("treeList").innerHTML = nodes;
      document.getElementById("collectionTreeName").innerHTML = '<i style="font-size:30px"  class="fa fa-tree" ></i> '+ '&nbsp' + collectionName


      //-- Add click event to tree view --//
      onTreeClickEvent(); 
}

function resetLastTreeItemSelection(){
     lastHostCollectSelectionStates.itemId = null;
}

//------- Host and Collection selections ----//

function onSelectedCollection(hostIndex, collectionIndex){

  //-- lastHostCollectSelectionStates.hostChanged=0 means no change in the host --//
  if((lastHostCollectSelectionStates.hostChanged==0)&&(lastHostCollectSelectionStates.collectionIndex==collectionIndex)){
      return 0;
  }
  if((lastHostCollectSelectionStates.collectionIndex!=0)&&(lastHostCollectSelectionStates.hostIndex!=0)){
      document.getElementById("colLi"+lastHostCollectSelectionStates.hostIndex +'-'+ lastHostCollectSelectionStates.collectionIndex).style.backgroundColor = Opts.defaultElemBgColor;
      document.getElementById("colFont"+lastHostCollectSelectionStates.hostIndex +'-'+ lastHostCollectSelectionStates.collectionIndex).style.color = Opts.defaultElemFontColor;
  }
  document.getElementById("colLi"+hostIndex+'-'+collectionIndex).style.backgroundColor = Opts.selectedElemBgColor;
  document.getElementById("colFont"+hostIndex+'-'+collectionIndex).style.color = Opts.selectedElemFontColor;
  lastHostCollectSelectionStates.collectionIndex= collectionIndex;
  lastHostCollectSelectionStates.hostChanged=0;


  var collectList = currentHostCollectSelectionStates.collectionList;
  var hostAPI = currentHostCollectSelectionStates.hostObject.hostAPI;
  var collectionId = collectList[collectionIndex-1]._id;
  var collectionFolders = getFoldersList(hostAPI, collectionId)
  currentHostCollectSelectionStates.foldersList = collectionFolders
  resetLastTreeItemSelection()
  renderTreeView(collectionIndex)
}  


function onSelectedHost(hostIndex){
        currentHostCollectSelectionStates.hostObject = findObjectByKey(Settings.dsaServers, 'id', hostIndex.toString());
        var hostAPI = findObjectByKey(Settings.dsaServers, 'id', hostIndex.toString()).hostAPI
        currentHostCollectSelectionStates.hostIndex = hostIndex  
        // initCollectionsList(hostAPI, hostIndex)

       if(lastHostCollectSelectionStates.hostIndex!=hostIndex){
          if(lastHostCollectSelectionStates.hostIndex!=0){
              lastHostCollectSelectionStates.hostChanged=1;
              document.getElementById("Host"+lastHostCollectSelectionStates.hostIndex).style.backgroundColor = Opts.defaultElemBgColor
              document.getElementById("HostFont"+lastHostCollectSelectionStates.hostIndex).style.color = Opts.defaultElemFontColor  
          }
          else{
           //   if(toggleLeft)toggleNavLeft();
          }

          document.getElementById("Host"+hostIndex).style.backgroundColor= Opts.selectedElemBgColor;
          document.getElementById("HostFont"+hostIndex).style.color = Opts.selectedElemFontColor;
          lastHostCollectSelectionStates.hostIndex = hostIndex;
          lastHostCollectSelectionStates.collectionIndex=0;

          autoLogin(function(){
                               initCollectionsList(hostAPI, hostIndex)
                              })
      }

} 

  /////////////////////////////////////////////
 // ---------- Channel Coloring ------------//
/////////////////////////////////////////////

function RgbToHsl(r,g,b) {  // adopted from https://css-tricks.com/converting-color-spaces-in-javascript/
  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;
  // Calculate hue
  // No difference
  if (delta == 0)
    h = 0;
  // Red is max
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g)
    h = (b - r) / delta + 2;
  // Blue is max
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);
    
  // Make negative hues positive behind 360°
  if (h < 0)
      h += 360;

    // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return "hsl(" + h + "," + s + "%," + l + "%)";  
}



function HSLToRGB(h,s,l) {  // adopted from https://css-tricks.com/converting-color-spaces-in-javascript/
// e.g HSLToRGB(180,100,50)

  // convert s and l to fractions of 1
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return "rgb(" + r + "," + g + "," + b + ")";
}

function getRgbObject(rgbString) {
    var RGB={}
     if(rgbString.search('rgb')>=0){  
      var rgbArray=rgbString
      // rgbArray ="#rgb(128,0,255)"
      rgbArray = rgbArray.replace(/[^\d,]/g, '').split(',')
      // rgbArray =[ "128", "0", "255" ]
      var rgbKeys=["r","g","b"]
      RGB=rgbKeys.reduce((obj, key, index) => ({ ...obj, [key]:parseInt(rgbArray[index]) }), {});
      // RGB={ r: 110, g: 255, b: 182 }
    }
    else{
         RGB=hexToRgb(rgbString)
        // RGB={ r: 110, g: 255, b: 182 }
    }
    return RGB;
}

// Help:  To get hsl values:
function getHslObject(hslString) {   // hsl is a string such that :  "hsl(180,100%,50%)"
    var HslObj={}
    hslArray = hslString.replace(/[^\d,]/g, '').split(',')
    // hslArray= [ "180", "100", "50" ]
    var hslKeys=["h","s","l"]
    HslObj=hslKeys.reduce((obj, key, index) => ({ ...obj, [key]:parseInt(hslArray[index]) }), {});

    return HslObj;    // HslObj= { h: "180", s: 1, l: 0.5 }
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function RGBtoHEX(rgb) { //rgb(255,0,0)
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}


function rgbObj2Str(RGB){
    return "rgb("+RGB.r+","+RGB.g+","+RGB.b+")"
}


function createContrastMaxArray(grpColorArray){
  var contastMaxArray = [];
  for(var index = 0; index < grpColorArray.length; index ++){
    var similarColorEntry = mapColorSimilarity(grpColorArray[index])
    contastMaxArray.push(similarColorEntry.contrast_Max);
    }
    return contastMaxArray
}

function createContrastMinArray(grpColorArray){
  var contastMinArray = [];
  for(var index = 0; index < grpColorArray.length; index ++){
    var similarColorEntry = mapColorSimilarity(grpColorArray[index])
    contastMinArray.push(similarColorEntry.contrast_Min);
    }
    return contastMinArray
}


function mapColorSimilarity(curChColor){ // Use this function to find closed color to current auto colored channel from colorContrastMap
    var similarity = Infinity;
    var similarColorIndex;
    var curChColorRgb = hexToRgb(curChColor)  
    for(var index = 0; index < colorContrastMap.length; index ++){
              var colorMapRgb = hexToRgb(colorContrastMap[index].color)  
              var dist = rgbColorsDist(curChColorRgb, colorMapRgb)
              if(similarity > dist){ 
                   similarity = dist;
                   similarColorIndex = index;
                }
    }
    return colorContrastMap[similarColorIndex]
}

function rgbColorsDist(rgb1, rgb2){
   var dist = Math.sqrt(Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2));
   return dist;
 
}

function createGrpColorsArray(numOfFrames){
    var colorStep=Math.floor(360/numOfFrames); // 360 is HSL max hue
    var saturation=100
    var lightness=50
    var initHue=0
    var colorsArray = [];
    for(var n=0; n<numOfFrames; n++){
        var frameColorRgb = HSLToRGB(n*colorStep, saturation, lightness)
        colorsArray.push(RGBtoHEX(frameColorRgb));
    }
    return colorsArray;
}

function reloadOSD(curGroup) {
  var hostAPI = currentHostCollectSelectionStates.hostObject.hostAPI
  var item = currentHostCollectSelectionStates.item;
  var counter = 1;
  var min = 500; // default value
  var max = 30000; // default value  for contrast max
  clearOSDViewer();

  var numOfFrames = curGroup.Channels.length;

  for (var k = 1; k <= numOfFrames; k++) {
    var frameNum = curGroup.Numbers[k-1];
    var palette1 = "rgb(0,0,0)"
    var palette2 = rgbObj2Str(hexToRgb(curGroup.Colors[k-1]));
    //Check if the default of min/max are set... also want to add a dynamic widget here
    if (curGroup.Contrast_Min[k-1]) {
         min = curGroup.Contrast_Min[k-1];
    }

    if (curGroup.Contrast_Max[k-1]) {
         max = curGroup.Contrast_Max[k-1];
    }

    viewer.addTiledImage({
      tileSource: getOMETileSourceColored( hostAPI, item._id, frameNum, palette1, palette2, min, max),
      opacity: 1,
      success: function (obj) {
        if (counter == numOfFrames) {
          if (numOfFrames > 1) compositeFrames(curGroup);
        }
        counter = counter + 1;
      }
    });
  }
}


function compositeFrames(curGroup, compositeType = 'difference') {
  var numOfFrames = curGroup.Channels.length;
  var topFrameIndex = numOfFrames - 1;

  if ((numOfFrames > 1)) {
    for (var i = topFrameIndex - numOfFrames + 1; i < topFrameIndex; i++) {
      var bottomFrameIndex = i;
      var topFrame = viewer.world.getItemAt(bottomFrameIndex + 1);
      topFrame.setCompositeOperation(compositeType);
    }

  } else {
         viewer.viewport.goHome()
    //  addFrameAnnotations()
  }
}

  ///////////////////////////////////////////////
 //------- Host and Collection initialion ----//
///////////////////////////////////////////////

function initCollectionsList(hostAPI, hostIndex){ 
    var nodes="";
    document.getElementById("collectionsTitle").innerHTML="Collections:";    
    var collectList = getCollectionsList(hostAPI);
    currentHostCollectSelectionStates.collectionList = collectList;
    document.getElementById("collectionsList").innerHTML=""; 

    for(var i=1; i<= collectList.length; i++){
       var collectionName = collectList[i-1].name; 
       nodes +=  '<li style="background-color: none" id="colLi'+hostIndex+'-'+i+'"><a href="javascript:void(0)" onclick="onSelectedCollection('+hostIndex+','+i+')"><font size="3" id="colFont'+hostIndex+'-'+i+'">'+collectionName+'</font></a></li>'
    }
    document.getElementById("collectionsList").innerHTML +=nodes;
} 


function initHostList(){ 
    var nodes="";
    document.getElementById("hostsList").innerHTML=""; 

    for(var i=1; i<= Settings.dsaServers.length; i++){
       var hostName = Settings.dsaServers[i-1].value; 
       var hostIndex = Settings.dsaServers[i-1].id;
        nodes +=  '<li style="background-color: none" id="Host'+hostIndex+'"><a href="javascript:void(0)"  onclick="onSelectedHost('+hostIndex+')"><font  size="3" id="HostFont'+hostIndex+'">'+hostName+'</font></a></li>'
    }
    document.getElementById("hostsList").innerHTML +=nodes;
}  

  //////////////////////////////////// 
 //------- Channel  initiation ----//
////////////////////////////////////

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}



function onChannelCheckboxClick(channelIndex){

   var omeSceneDescription = currentHostCollectSelectionStates.item.meta.omeSceneDescription;
   if(!tempSceneSelections.length) {
         tempSceneSelections.push( omeSceneDescription[channelIndex])
         document.getElementById("ChannelCheckboxId"+channelIndex).innerHTML = '<i class="fa fa-check-square" >&nbsp&nbsp</i>'
   }
   else{
        var checkExistRecord = findObjectByKey(tempSceneSelections, 'channel_number', channelIndex)
        if(checkExistRecord){
          tempSceneSelections.splice( tempSceneSelections.indexOf(checkExistRecord), 1 );
          document.getElementById("ChannelCheckboxId"+channelIndex).innerHTML = '<i class="fa fa-square" >&nbsp&nbsp</i>'

        }else{
          tempSceneSelections.push( omeSceneDescription[channelIndex])
          document.getElementById("ChannelCheckboxId"+channelIndex).innerHTML = '<i class="fa fa-check-square" >&nbsp&nbsp</i>'
        }
    }
}



function getOMETileSourceColored(hostApi, _id, frame, palette1="rgb(0,0,0)", palette2="rgb(204,240,0)", min=100, max=65000) {
 // palette1 format is  "%23000" or "rgb(0,0,0)"
  var tile = [];
  webix.ajax().sync().get(hostApi + "/item/" + _id + "/tiles", function (data) {
    tile = JSON.parse(data)
    tile['maxLevel'] = tile['levels'] - 1
    tile['minLevel'] = 0
    tile['width'] = tile['sizeX']
    tile['height'] = tile['sizeY']
    tile['getTileUrl'] = function (level, x, y) {

    return hostApi+"/item/" + _id + "/tiles/zxy/" + level + "/" + x + "/" + y + "?edge=crop&frame="+frame+"&style={%22min%22:"+min+",%22max%22:"+max+",%22palette%22:[%22"+palette1+"%22,%22"+palette2+"%22]}";

    }
  })

  return tile
}



function getOMETileSource(hostApi, _id, frame) {
      var tile=[];
      webix.ajax().sync().get(hostApi+"/item/" + _id + "/tiles", function(data) {
            tile = JSON.parse(data)
            tile['maxLevel'] = tile['levels'] - 1
            tile['minLevel'] = 0
            tile['width'] = tile['sizeX']
            tile['height'] = tile['sizeY']
            tile['getTileUrl'] = function(level, x, y) {
            return hostApi+"/item/" + _id + "/tiles/fzxy/" + frame + "/" + level + "/" + x + "/" + y + "?redirect=false"
             }
      })
    return tile
 }




function onSelectedChannel(channelIndex){
           channelStates.currentIndex = channelIndex  
           if(channelStates.lastIndex!=channelIndex){
              if(channelStates.lastIndex!=null){
                  channelStates.channelChanged=1;
                  document.getElementById("Channel" + channelStates.lastIndex).style.backgroundColor = Opts.defaultElemBgColor 
                  document.getElementById("ChannelFont" + channelStates.lastIndex).style.color = Opts.defaultElemFontColor  
              }
           else{
          
           }
          document.getElementById("Channel"+channelIndex).style.backgroundColor= Opts.selectedElemBgColor;
          document.getElementById("ChannelFont"+channelIndex).style.color = Opts.selectedElemFontColor;
          channelStates.lastIndex = channelIndex;
           var hostAPI = currentHostCollectSelectionStates.hostObject.hostAPI
           var item = currentHostCollectSelectionStates.item;
           if (item.largeImage) {
              clearOSDViewer()
              viewer.addTiledImage({
                tileSource: getOMETileSource(hostAPI, item._id, channelIndex),
                opacity: 1,
                success: function (obj) {
                     clearGrpBarRight()
                     resetGrpSelection()
                }
              });
           } 

      }

} 

function getItemRootName(itemName){
   var ItemRootName = itemName.split('.')[0]
   ItemRootName = ItemRootName.split('-')[0]
   ItemRootName = ItemRootName.split('_')[0]
   return ItemRootName;

}

function initChannelList(omeChannels, itemName){ 
    var nodes="";
    document.getElementById("channelList").innerHTML=""; 

    for(var i=1; i<= omeChannels.length; i++){
       var channelName = omeChannels[i-1].channel_name; 
       var channelNumber = omeChannels[i-1].channel_number;
        nodes +=  '<li style="background-color: none" id="Channel'+channelNumber+'"><a href="javascript:void(0)" class="channelCheckboxClass" id="ChannelCheckboxId'+channelNumber+'"  onclick="onChannelCheckboxClick('+channelNumber+')"><i class="fa fa-square" >&nbsp&nbsp</i></a><a href="javascript:void(0)"  onclick="onSelectedChannel('+channelNumber+')"><font  size="3" id="ChannelFont'+channelNumber+'">'+channelName+'</font></a></li>'
    }
    document.getElementById("channelList").innerHTML += nodes;
    document.getElementById("channelsName").innerHTML = '<i style="font-size:30px"  class="fa fa-th" ></i> &nbsp&nbsp' +getItemRootName(itemName) + " CHNL"
    
}  


 function showBarExtention(barId){
      var nodes = "";
      var panelId = barId.split("Bar")[0]; 
      var btnId = barId + "Btn"
      nodes += '<a href="javascript:void(0)" style ="font-size: 25px; outline: none" id='+btnId+ ' onclick="togglePanel('+panelId+')"> <i class="fa fa-chevron-circle-left" aria-hidden="true"></i></a> '      

      if(barId === "itemTreeViewBar"){
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="viewerZoomHome()"><i class="fa fa-home"></i></a>'
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="viewerZoomIn()"><i class="fa fa-search-plus"></i></a>'
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="viewerZoomOut()"><i class="fa fa-search-minus"></i></a>'
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="goToOnlineItem()"> <i class="fa fa-cloud"></i></a>'
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="togglePanel('+"infoPanel"+')"><i class="fa fa-info-circle"></i></div></a>'
      }       
      document.getElementById(barId).innerHTML = nodes;
  }
  
  function showBarBasic(barId){
      destroyBar(barId)
      showBar(barId)
  }
  
  function initBar(barId){
      var nodes = "";
      var panelId = barId.split("Bar")[0]; 
      var btnId = barId + "Btn"
      nodes += '<a href="javascript:void(0)" style ="font-size: 25px; outline: none" id='+btnId+ ' onclick="togglePanel('+panelId+')"> <i class="fa fa-chevron-circle-left" aria-hidden="true"></i></a> '

      if(barId === "channelListViewBar"){
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="viewerZoomHome()"><i class="fa fa-home"></i></a>'
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="viewerZoomIn()"><i class="fa fa-search-plus"></i></a>'
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="viewerZoomOut()"><i class="fa fa-search-minus"></i></a>'
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="goToOnlineItem()"> <i class="fa fa-cloud"></i></a>'
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="createNewGroup()"><div class="tooltip"><i class="fa fa-stop-circle"></i><span class="tooltiptext">Add</span></div></a>'
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="resetChannelCheckboxes()"><div class="tooltip"><i class="fa fa-repeat"></i><span class="tooltiptext">reset</span></div></a>'        
      }
      document.getElementById(barId).innerHTML = nodes;
  }


  function showBar(panelId, showPanel = true){
    var barId = panelId + "Bar";
    if(document.getElementById(barId)){ // need this check because infoPanel and chColorContrastPanel have no Bars
          if(!document.getElementById(barId).children.length){ //if right Bar empty
              initBar(barId);
          }    
          if(showPanel){
                     if(isPanelRightSide(panelId)){
                          document.getElementById(barId).style.marginRight = "380px";
                          document.getElementById(barId+"Btn").innerHTML = '<i class="fa fa-chevron-circle-right" aria-hidden="true"></i>'
                      } 
                     else{
                          document.getElementById(barId).style.marginLeft = "310px";
                          document.getElementById(barId+"Btn").innerHTML = '<i class="fa fa-chevron-circle-left" aria-hidden="true"></i>'     
                         }   
          }else{
                     if(isPanelRightSide(panelId)){
                          document.getElementById(barId).style.marginRight = "0px";
                          document.getElementById(barId+"Btn").innerHTML = '<i class="fa fa-chevron-circle-left" aria-hidden="true"></i>'
                      } 
                     else{
                          document.getElementById(barId).style.marginLeft = "0px";
                          document.getElementById(barId+"Btn").innerHTML = '<i class="fa fa-chevron-circle-right" aria-hidden="true"></i>'     
                         }  
         
               }  
     }          
  } 

  function destroyBar(barId){
      document.getElementById(barId).innerHTML = ""
  }    

  function showPanel(panelId, showPanel = true){
    if(showPanel){
         if(isPanelRightSide(panelId)){
            document.getElementById(panelId).style.marginRight = "20px";
         }
         else{
            document.getElementById(panelId).style.marginLeft = "20px";          
         }
    }else{
         if(isPanelRightSide(panelId)){
            document.getElementById(panelId).style.marginRight = "-370px";
         }
         else{
            document.getElementById(panelId).style.marginLeft = "-320px";   
         }
          if(panelId === "chColorContrastPanel") curChColorContrastStates = [];         
         }
    showBar(panelId, showPanel)
  } 


  function isPanelRightSide(panelId){
      let panel = document.getElementById(panelId)
      let rightPos = parseInt(window.getComputedStyle(panel, null).getPropertyValue("right").split("px")[0])
      let leftPos  = parseInt(window.getComputedStyle(panel, null).getPropertyValue("left").split("px")[0])
      return  (rightPos < leftPos)||(leftPos>(screen.width/2))?  true : false; 
   }

  function isPanelActive(panelId){
    var panel = document.getElementById(panelId);
    if(isPanelRightSide(panelId)){
       var marginRightValue = parseInt(panel.style.marginRight.split("px")[0])
       return marginRightValue >= 0 ? true : false;
     }else {
       var marginLeftValue = parseInt(panel.style.marginLeft.split("px")[0])
       return marginLeftValue >= 0 ? true : false;
    }
  }

  function togglePanel(panel){
    if(isPanelActive(panel.id)){
        showPanel(panel.id, false);
    }else{
        showPanel(panel.id, true);
    }

  }

  function openBrowseLayout(){
       if(currentHostCollectSelectionStates.item){
            onCurTileSourceClick();
        }
        showPanel("itemTreeView");
        showPanel("hostCollectView"); 
         if(getActiveLayout()){
           showBarExtention("itemTreeViewBar")
         }          
        return  true;    
  }

  function hideLayout(layoutId){
        var allLayoutPanels = document.querySelectorAll('div[layout="'+layoutId+'"]')
        allLayoutPanels.forEach(function(panel) {
             showPanel(panel.id, false)
             if(document.getElementById(panel.id +"Bar")){ 
                destroyBar(panel.id +"Bar")
             }
   })
  }

  function openLayout(layoutId) {
       if(!isLayoutActive(layoutId)){
           let functionName = "open" + layoutId + "Layout"; 
           let  param = null; 
           let returnValue = callFunctionByName(functionName, param)
           if(returnValue){
               if(getActiveLayout()){
                       hideLayout(getActiveLayout())
               }              
               setActiveLayout(layoutId)
            }
       }    
  }


 //----------- Tool Bar options --------------- //
 // --------Toolbar Settings Form Tabs----------//
    function pageReload(){
       window.location.reload();
    }


   function openSettingsTab(tabName,elm,color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(tabName).style.display = "block";
    elm.style.backgroundColor = color;
  }

    //--- Check Path  availability----------//
    function UrlExists(url, cb){
                jQuery.ajax({
                    url:      url,
                    type:     'GET',
                    dataType: 'jsonp',                   
                    complete:  function(xhr){
                        if(typeof cb === 'function')
                           cb.apply(this, [xhr.status]);
                    }
                });
            }


   function openSettingsForm() { 
       if(!getActiveForm()){
          var form = document.getElementById("settingsForm")
          form.classList.remove("formflashanimation"); 
          form.style.display = "block";
          initSettingsFormServerList();
          initSettingsFormOptionsList();  
          initSettingsFormChangeStates();        
          getElementCenterOnScreen(form)
          document.getElementById("defaultOpenSettingsTab").click();
          setActiveForm(form)
      
      }else{
            getActiveForm().classList.toggle("formflashanimation")
      }    
    }

  function closeSettingsForm() {
      var settingsForm = document.getElementById("settingsForm");
      settingsForm.style.display = "none";      
      cancelSettingsFormChangess()        
      resetActiveFormState();
    }

  function deleteServerFromSettings(serverIndex){
        var serverToRemove = Settings.dsaServers[serverIndex-1];
        if(parseInt(serverToRemove.id) == getHostId()){
          triggerHint("Removing Current in use server will reload the page", "error", 3000)
        }
        tempServerRemoved.push({id: parseInt(serverToRemove.id), hostApi: serverToRemove.hostAPI })
        remove(Settings.dsaServers, serverToRemove)
        initSettingsFormServerList();
        flagServerChanges();
    }

    function checkAutoLoginToRemovedServer(callback){
        if(tempServerRemoved.length){
          for(var i=0; i< tempServerRemoved.length; i++){
               removeHostCredentials(tempServerRemoved[i].id , tempServerRemoved[i].hostApi)
          }

        }
        callback();

    }

    function maintainCurHostSelection(hostIndex){
          document.getElementById("Host"+hostIndex).style.backgroundColor= Opts.selectedElemBgColor;
          document.getElementById("HostFont"+hostIndex).style.color = Opts.selectedElemFontColor;
    }

    function comfirmServerListChangesInSettings(){
       cacheServerListLocal()
       checkAutoLoginToRemovedServer(function(){
          var curServerIndex = findObjectByKey(Settings.dsaServers, 'id', getHostId().toString(), 'INDEX')
          if( curServerIndex == null){
             pageReload();
           }else{
             initHostList( );
             maintainCurHostSelection(Settings.dsaServers[curServerIndex].id)
             resetActiveFormState();
             resetTempRemovedServerList();
           }
       })
    } 

    function resetTempRemovedServerList(){
           tempServerRemoved = [];
    }

    function restorDefaultServerListForSettings(){
           Settings.dsaServers= JSON.parse( JSON.stringify( DSA_SERVER_LIST ) ) ; // to copy obj without reference
           initSettingsFormServerList();
           resetTempRemovedServerList();
           flagServerChanges();
    }     

    function cancelServerListChangesInSettings(){
           Settings.dsaServers= initServerList()
           initSettingsFormServerList();
           resetTempRemovedServerList();
    }   

    function cacheServerListLocal(){
          webix.storage.local.put("serverList",Settings.dsaServers);
    }      

    function fetchCachedServerList(){
          return webix.storage.local.get("serverList");

    }  

   function checkServerDuplication(newServerName, newServerPath){
       // if there is a duplication, and user want to rename server name, must delecte the old one first and then add new server name
       var duplicateNameIndex = findObjectByKey(Settings.dsaServers, 'value', newServerName, 'INDEX')
       var duplicatePathIndex = findObjectByKey(Settings.dsaServers, 'hostAPI', newServerPath, 'INDEX')
       if((duplicateNameIndex == null) && (duplicatePathIndex == null)){
             return true;  // No duplication   
       }else{
             return false;  // There is a duplication 
       }
   } 

   function getNewId(idSeed, callback){
       // Help assigning new Id to a new server added to the server list with Settings.dsaServers.
       var newId = findObjectByKey(Settings.dsaServers, 'id', idSeed.toString(), 'INDEX')
       if(newId == null){
             callback(idSeed.toString());  // No id duplication   
       }else{
             idSeed = idSeed +1
             getNewId(idSeed, callback);  // There is a duplication 
       }
   }   

   function addServerToSettings(){
       var newServerName = document.getElementById("newServerNameText").value.trim();
       var newServerPath = document.getElementById("newServerPathText").value.trim();
       if((newServerName !=="")&&(newServerPath !=="")){
          if(checkServerDuplication(newServerName, newServerPath)){
             webix.ajax()
              .get(`${newServerPath}/collection`)
              .fail(parseError)
              .then(result => {
                                    getNewId(1, function (newId){  
                                      Settings.dsaServers.push({id: newId, value: newServerName, hostAPI: newServerPath});
                                      initSettingsFormServerList()
                                      flagServerChanges();
                                   }) 
                              });
          }else{
               triggerHint("List Duplication Found","error", 3000)
          }
       }
   } 

  function  initServerList(){
        return fetchCachedServerList()!==null ? fetchCachedServerList(): JSON.parse( JSON.stringify( DSA_SERVER_LIST ) ) ; // to copy obj without reference
  }
 


    function initSettingsFormServerList(){ 
        var serverNode = "";
        serverNode += '<table style = "border-spacing: 5px">'
        serverNode += '<colgroup> <col style="width:25%"><col style="width:70%"> <col style="width:5%"></colgroup>' 
        serverNode +=  '<tr >'
        serverNode +=    '<th style="text-align: center; border: 0px solid black; padding: 5px">' + "Server" + '</th>'      
        serverNode +=    '<th style="text-align: center; border: 0px solid black; padding: 5px">' + "Path" + '</th>' 
        serverNode +=    '<th style="text-align: center; border: 0px solid black; padding: 5px">'
        serverNode +=      '<a href="javascript:void(0)" onclick="restorDefaultServerListForSettings()"><i style="font-size:15px" class="fa fa-undo" ></i></a>'
        serverNode +=    '</th>'           
        serverNode +=  '</tr>' 

        for(var i=1; i<= Settings.dsaServers.length; i++){
          var serverName = Settings.dsaServers[i-1].value; 
          var serverPath = Settings.dsaServers[i-1].hostAPI;           

          serverNode +=  '<tr >'
          serverNode +=    '<th style="text-align: left; border: 1px solid black; padding: 5px ">'
          serverNode +=        ' <font size="2" >'+ serverName+'</font>'
          serverNode +=    '</th>'

          serverNode +=    '<th style="text-align: left; border: 1px solid black; padding: 5px">'
          serverNode +=        '<font size="2" >'+ serverPath+'</font>'
          serverNode +=    '</th>'

          serverNode +=    '<th style="text-align: center; border: 1px solid black; padding: 5px">'
          serverNode +=      '<a id="deleteServer'+i+'" href="javascript:void(0)" onclick="deleteServerFromSettings('+i+')"><i style="font-size:15px" class="fa fa-minus-circle" ></i></a>'
          serverNode +=    '</th>'
          serverNode +=  '</tr>'          
        }

        if(Settings.dsaServers.length < Opts.maxhostListWithSettings){
          serverNode +=  '<tr >'
          serverNode +=    '<th style="margin-Left: 0px; text-align: left; border: 1px solid black; padding: 5px ">'
          serverNode +=        '<input type="text" id="newServerNameText" style="margin-Left: 0px; margin-Top: 0px; width: 100%"  placeholder="Name...">'
          serverNode +=    '</th>'

          serverNode +=    '<th style="text-align: center; border: 1px solid black; padding: 5px">'
          serverNode +=        '  <input type="text" id="newServerPathText" style="margin-Left: 0px; margin-Top: 0px; width: 100%"  placeholder="Path...">'
          serverNode +=    '</th>'

          serverNode +=    '<th style="text-align: center; border: 1px solid black; padding: 5px">'
          serverNode +=      '<a  href="javascript:void(0)" onclick="addServerToSettings()"><i style="font-size:15px" class="fa  fa-plus-square" ></i></a>'
          serverNode +=    '</th>'
          serverNode +=  '</tr>'         
         }
 
         serverNode += '</table>' 

         serverNode += '<table style=" position:absolute; bottom: 20px;" >'    

         serverNode +=  '<tr >'  
         serverNode +=    '<td colspan="3">'
         serverNode +=       '<a  href="javascript:void(0)" onclick="confirmSettingsFormChanges()"><i style="font-size:30px; padding: 25px""    class="fa fa-check-circle"></i></a>'
         serverNode +=     '</td>'
         serverNode +=   '</tr>'   

         serverNode += '</table>' 

        document.getElementById("settingsFormServerList").innerHTML = serverNode;    
    }     


  function optionsListDefaultValues(){
          var defaultOptions = [];
          defaultOptions.push({
                               optionId: "optionId.AutoLogin"  , optionValue: true}
                             );
          return defaultOptions;
  }

  function comfirmOptionsListChangesInSettings(){
       resetActiveFormState();
       cacheOptionsListLocal()
  }

  function cancelOptionsListChangesInSettings(){
         Settings.options= initOptionsList()
         initSettingsFormOptionsList();
  } 

  function queryElemValueAttribute(elem){
         switch (elem.tagName){
               case "INPUT":
                  switch (elem.type){
                      case 'checkbox':
                       return "checked";
                      case 'number':
                       return "value"; 
                      case 'radio':  
                       return "checked"; 
                      case 'range':
                       return "value"; 
                      case 'text':
                       return "value";                  
                  }
               case "SELECT":
                       return "value";
               default:
                       return null;                    
         }   
  }    

  function queryElemTypeValue(elem){
         switch (elem.tagName){
               case "INPUT":
                  switch (elem.type){
                      case 'checkbox':
                       return elem.checked;
                      case 'number':
                       return elem.value; 
                      case 'radio':
                       return elem.checked; 
                      case 'range':
                       return elem.value; 
                      case 'text':
                       return elem.value;                  
                  }
               case "SELECT":
                       return elem.options[elem.selectedIndex].value;
               default:
                       return null;                    
         }   
  }  

  function optionChanged(id){
            var elem = document.getElementById(id)
            var elemTag = elem.tagName
            var elemValue = queryElemTypeValue(elem)
          
            if ((elemValue != null)|| (elemValue !== null)){
               var elemIndex = findObjectByKey(Settings.options, 'optionId', id, 'INDEX')
               if(elemIndex != null){
                     var elemToRemove = Settings.options[elemIndex];
                     remove(Settings.options, elemToRemove);
               } 
               if(elemTag === "INPUT")
                    Settings.options.push({optionId: id  , optionValue: elemValue})
               if(elemTag === "SELECT")
                    Settings.options.push({optionId: id  , optionValue: elemValue, selectedIndex: elem.selectedIndex})

               flagOptionChanges();               
            }else{
                 // for debug mode 
                 triggerHint(" Improper selection of option element", "error", 5000)
            }
  }

  function isAutoLoginEnabled(){
           var elemIndex = findObjectByKey(Settings.options, 'optionId', "optionId.AutoLogin", 'INDEX')
           return Settings.options[elemIndex].optionValue;
  }

  function loadOptionListValues(){
    var elem;
    var elemValue;
    for(var i=0; i<Settings.options.length; i++){
        elem = document.getElementById(Settings.options[i].optionId);
        elemValue = Settings.options[i].optionValue;
       
        if(elem.tagName === "INPUT"){
              elem[queryElemValueAttribute(elem)] = elemValue
         }     
        if(elem.tagName === "SELECT"){
              elem.options[Settings.options[i].selectedIndex][queryElemValueAttribute(elem)] = elemValue
         }     
    }

  }

  function cacheOptionsListLocal(){
        webix.storage.local.put("optionsList",Settings.options);
  }    

  function fetchCachedOptionsList(){
        return (webix.storage.local.get("optionsList")!= null) && Array.isArray(webix.storage.local.get("optionsList")) ? 
                           webix.storage.local.get("optionsList") : optionsListDefaultValues();
  }  


  function  initOptionsList(){
        return fetchCachedOptionsList();
  }

    function initSettingsFormOptionsList(){ 
        var optionsNode = "";
        optionsNode += '<fieldset> <legend>Account:</legend>'       
        optionsNode += '<table id="optionsListTable" style = "border-spacing: 5px">'
        optionsNode += '<colgroup> <col style="width:10%"><col style="width:90%"> </colgroup>' 
        optionsNode +=  '<tr >'
        optionsNode +=    '<th style="text-align: center; border: 0px solid black; padding: 5px">'
        optionsNode +=      '<input type="checkbox" style="margin-Left: 0px; margin-Top: 0px; width: 100%"  id="optionId.AutoLogin" onchange="optionChanged(this.id)"> '
        optionsNode +=    '</th>'  
        optionsNode +=    '<th style="text-align: left; border: 0px solid black; padding: 5px">' + "Enable Auto-Login for hosts." + '</th>' 
        optionsNode +=  '</tr>' 

        optionsNode += '</table>' 
        optionsNode += '</fieldset>'         

        optionsNode += '<table style=" position:absolute; bottom: 20px;" >'        
        optionsNode +=  '<tr >'  
        optionsNode +=    '<td colspan="2">'
        optionsNode +=       '<a  href="javascript:void(0)" onclick="confirmSettingsFormChanges()"><i style="font-size:30px; padding: 25px""    class="fa fa-check-circle"></i></a>'
        optionsNode +=     '</td>'
        optionsNode +=   '</tr>'   

        optionsNode += '</table>' 

        document.getElementById("settingsFormOptionsList").innerHTML = optionsNode;  
        loadOptionListValues()  
    
    }  





  function confirmSettingsFormChanges(){
     var settingsForm = document.getElementById("settingsForm");
     settingsForm.style.display = "none";
     if(isServerListChanged())      
        comfirmServerListChangesInSettings();     
     if(isOptionsListChanged())  
        comfirmOptionsListChangesInSettings();
  }  
 
  function cancelSettingsFormChangess(){
     if(isServerListChanged())    
        cancelServerListChangesInSettings();
     if(isOptionsListChanged())      
        cancelOptionsListChangesInSettings();
  }

  function initSettingsFormChangeStates(){
           Settings.serverListChanges = false;
           Settings.optionsListChanges = false;
  }

  flagServerChanges = () =>{
      Settings.serverListChanges  = true;
  }
  
  isServerListChanged = () =>{
      return Settings.serverListChanges ;
  }

  flagOptionChanges = () =>{
      Settings.optionsListChanges = true;
  }
  
  isOptionsListChanged = () =>{
      return Settings.optionsListChanges;
  }





  function homeMenu(){
     triggerHint("To be coded later")
  }


  function openDesignLayout(){
    if(currentHostCollectSelectionStates.item){  // item is loaded with OSD 
          var item = currentHostCollectSelectionStates.item;
          if((item.name.includes(".ome.tif"))&&(item.meta.omeSceneDescription!=null)) {

              var itemName = item.name.split(".")[0]
              initChannelList(item.meta.omeSceneDescription, itemName)   
              initCurrentTileSource()

              if(document.getElementById("itemTreeView").style.marginLeft === "20px"){
                    showPanel("itemTreeView", false);
                    showPanel("hostCollectView", false);
                    showPanel("channelListView",true);
                    showPanel("grpListView", true);
                    return true;
              }
          } 
          else{
            return 0; 
          }
     }else{
          triggerHint("Select OME File")
          return 0;
     }
  }




  function openContact(){
     triggerHint("To be coded later")
  }

  //------- Login/logout Toolbar Button ---------// 

   function openLoginForm() { 
     if(!getActiveForm()){ // if another active form is opened then esc
        var hostIndex = getHostId();
        if(hostIndex){ 
          var loginForm = document.getElementById("loginForm")
          loginForm.classList.remove("formflashanimation"); 
          loginForm.style.display = "block";

          document.getElementById("userNameId").style.borderColor = "black"
          document.getElementById("passwordId").style.borderColor = "black"
          getElementCenterOnScreen(loginForm)
          // $('#loginForm').toggleClass('animate');
          setActiveForm(loginForm)
        }else{ 
              triggerHint("Select Host First")
             } 
      }else{
            getActiveForm().classList.toggle("formflashanimation");
      }       
    }

  function closeLoginForm() {
      var loginForm = document.getElementById("loginForm");
      if (loginForm.style.display === "block") 
      {
         document.getElementById("userNameId").value = null
         document.getElementById("passwordId").value = null
         loginForm.style.display = "none";
         resetActiveFormState();
      }
    }

  function comfirmLogin(){
      var usr = document.getElementById("userNameId");
      if (!usr.value.length){ 
              usr.style.borderColor = "red";
            }
      var psw = document.getElementById("passwordId");
      if (!psw.value.length){ 
             psw.style.borderColor = "red";
          }

      if(usr.value.length && psw.value.length){     
          const loginCredentials = { username: usr.value ,  password: psw.value };
          login(loginCredentials).then((data) => { 
                                                   initLogoutToolbarBtn();
                                                   closeLoginForm(); 
                                                 });
     }
  }  

  function cancelLogin(){
     closeLoginForm();
  }

  function initLogoutToolbarBtn(){
     var lastName  = getUserInfo().lastName;
     var logoutNode = ""; 
     logoutNode += '<a  style="position:absolute; right:80px" href="javascript:void(0)" onclick="logoutCurHost()"><i style="font-size:15px; padding: 5px""    class="fa fa-sign-out"></i>' + lastName + '</a>'
     document.getElementById("login-out").innerHTML = logoutNode;        
  }

  function initLoginToolbarBtn(){
     var loginNode = ""; 
     loginNode += '<a  style="position:absolute; right:80px" href="javascript:void(0)" onclick="openLoginForm()">Login</a>'
     document.getElementById("login-out").innerHTML = loginNode;        
  }  

  function logoutCurHost(){
      logout()
      initLoginToolbarBtn();
  }


  function autoLogin(callback){
     var hostIndex = currentHostCollectSelectionStates.hostIndex;
     if(isAutoLoginEnabled()){
         if(hostIndex){ 
            var hostApi = currentHostCollectSelectionStates.hostObject.hostAPI 
            if(isLoggedIn()){
                initLogoutToolbarBtn();             
            }else{
                initLoginToolbarBtn(); // In case host changed while last host was login
            }
         }
     }else{
           logoutCurHost()
          } 
     callback();        
  }    

  function parseError(xhr) {
    let message;
    switch (xhr.status) {
      case 404:
        {
          message = "Not found";
          triggerHint(message,'error')
          break;
        }
      default:
        {
          try {
            let response = JSON.parse(xhr.response);
            message = response.message;
          } catch (e) {
            message = xhr.response;
            console.log(`Not JSON response for request to ${xhr.responseURL}`);
          }
          // webix.message({ text: message, expire: 5000 });
          triggerHint(message,'info', 5000)
          break;
        }
    }
    return Promise.reject(xhr);
  }


  function   _parseData(data) {
    return data ? data.json() : data;
  }  


  function  dsaLogin(sourceParams, hostApi) {
   // console.log("sourceParams : ", sourceParams)
    const params = sourceParams ? {
      username: sourceParams.username || 0,
      password: sourceParams.password || 0
    } : {};
    const tok = `${params.username}:${params.password}`;
    let hash;
    try {
      hash = btoa(tok);
      // console.log("hash : ", hash)      
    }
    catch (e) {
      triggerHint("Invalid character in password or login");
    }
    return webix.ajax()
      .headers({
        Authorization: `Basic ${hash}`
      })
      .get(hostApi + `/user/authentication${setTokenIntoUrl(getToken(), "?")}`)
      .then(result => _parseData(result));
  }


    function dsaLogout() {
      var hostApi = currentHostCollectSelectionStates.hostObject.hostAPI
      return webix.ajax().del(hostApi + `/user/authentication`)
        .catch(parseError)
        .then((result) => {
          _parseData(result);
          initCollectionsList(hostApi, getHostId());
          clearTreeView()
        });
    }

    webix.attachEvent("onBeforeAjax", (mode, url, data, request, headers, files, promise) => {
      let toSearchInUrl = "cdn.webix.com";
      let searchedInUrl = url.search(toSearchInUrl);
      if (searchedInUrl === -1) {
        headers["Girder-Token"] = getToken();
      }
    });                                            

    function   setTokenIntoUrl(token, symbol) {
        return token ? `${symbol}token=${token}` : "";
     }

    function login(params) {
      var hostApi = currentHostCollectSelectionStates.hostObject.hostAPI
      return dsaLogin(params, hostApi).then((data) => {
        webix.storage.local.put(`${"authToken" + "-"}${getHostId()}`, data.authToken);
        webix.storage.local.put(`${"user" + "-"}${getHostId()}`, data.user);
        initCollectionsList(hostApi, getHostId());
        clearTreeView()  
      });
    }

    function  logout() {
       dsaLogout().then(() => {
        webix.storage.local.remove(`${"user" + "-"}${getHostId()}`);
        webix.storage.local.remove(`${"authToken" + "-"}${getHostId()}`);
      });
    }

   function getToken() {
      const authToken = webix.storage.local.get(`${"authToken" + "-"}${getHostId()}`);
      if (!authToken) {
        return null;
      }
      return authToken.token;
    }


    function getUserInfo() {
      return webix.storage.local.get(`${"user" + "-"}${getHostId()}`);
    }

    function isLoggedIn() {
      return getToken() && getUserInfo();
    } 
    
    function getHostId() {
      var hostId = currentHostCollectSelectionStates.hostIndex
      return hostId;
    }  

    function removeHostCredentials(hostIndex, hostApi){
       webix.ajax().del(hostApi + `/user/authentication`)
          .catch(parseError)
          .then((result) => { });
        webix.storage.local.remove(`${"user" + "-"}${hostIndex}`);
        webix.storage.local.remove(`${"authToken" + "-"}${hostIndex}`);

    }  

//-----------------Screen Status--------------------------------// 
 function setActiveForm(elm){
     screenStatus.activeForm = elm;
 } 

 function getActiveForm(){
     return screenStatus.activeForm ;
 } 
 
 function resetActiveFormState(){
     screenStatus.activeForm = null;
 }

  function setActiveMode(elm){
     screenStatus.activeMode = elm;
 } 

 function getActiveMode(){
     return screenStatus.activeMode ;
 } 
 
 function resetActiveModeState(){
     screenStatus.activeMode = null;
 }


 function getActiveLayout(){
     return screenStatus.activeLayout ;
 }

 function setActiveLayout(layoutId){
     screenStatus.activeLayout = layoutId ;
 } 

 function isLayoutActive(layoutId){
    return screenStatus.activeLayout === layoutId? true : false
 }

 function resetActiveLayout(){
    return screenStatus.activeLayout = null
 }
