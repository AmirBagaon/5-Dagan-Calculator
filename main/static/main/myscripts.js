				// <!-- global scope -->

                var global_PS_set = new Set()

				createCheckList();
				updateParticipantsCards()
        getAllParticipants()
        initMoreCalcs()
        initEnterPressing()
        redrawCards()	
        optimizeCalcs()	
				// <!-- functions -->

        function addDutyClick() {
          var error_line = document.getElementById("error_duty_div") 
          error_line.innerHTML = ""
          var amount = document.getElementById('duty_amount').value
          
          if (!validFloatInput(amount)) {
            error_line.innerHTML = "!נא לכתוב סכום תקין"
            return
          }
          var owes = document.getElementById("ps_duty").value
          var owed = document.getElementById("ps_credit").value

          if (owes == owed) {
            error_line.innerHTML = "נא לא לחייב ולזכות אותו אדם"
            return
          }
          amount = parseFloat(amount).toFixed(2)
          var description = document.getElementById("duty_description").value;

          insertToCalcsTable(owes,owed,amount,description)
          // var card = document.getElementById(owes)
          // var contents = card.getElementsByClassName("card_calcs_content")
          // for (content of contents) {
          //   var text = `<p><span class="expense each_ps_price">₪ ${amount}</span><span class="card-item-name"><a href="#">:${description}</a></span></p><br>`
          //   content.innerHTML += text
          //   // var addRow = document.createElement('div')
          //   // addRow.innerHTML = text
          //   // content.append(addRow)      
          // }
          redrawCards()
        //   var cartRow = document.createElement('div')
      	// var cartItems = document.getElementsByClassName('cart-items')[0]
      	// var cartRowContents = `
      	// <p>₪ <span class="cart-price">${itemPrice}</span><span class="cart-item"><span class="close">&times;</span><a href="#">${itemName}</a></span></p>`
      	// cartRow.innerHTML = cartRowContents
				// cartItems.append(cartRow)
        }

        function initEnterPressing() {
          enableEnterKey("add_chkbox","ps_adding")
          enableEnterKey("itemPrice", "add_item_btn")
          enableEnterKey("itemName", "add_item_btn")
          enableEnterKey("duty_amount", "add_duty_btn")
          enableEnterKey("duty_description", "add_duty_btn")
        }

        function enableEnterKey(inputBoxId, buttonId) {
          var input = document.getElementById(inputBoxId);
          input.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById(buttonId).click();
            }
          });
        }

        function  currentBuyDraw() {
          var whoPaid = document.getElementById("already_paid")
          console.log(whoPaid.value, whoPaid.selectedIndex)

          //Clear owe from others
          for (item of document.getElementsByClassName("card_owed_content")) {
            item.innerHTML = ""
          }

          if (whoPaid.selectedIndex == 0) //means "לא שולם"
          {
            var currentBuyLocation = document.getElementsByClassName("current_buy_location")
            for (item of currentBuyLocation) {
              item.innerHTML = ":קנייה נוכחית"
            }
            return
          }
          
          //If there is an owe to someone
          var paid_card = document.getElementById(whoPaid.value)
          var owe_location = paid_card.getElementsByClassName("card_owed_content")[0]
          owe_location.innerHTML += `<br>`
          var amount = amountToPayEach().toFixed(2)
          for (ps_name of global_PS_set.values()) {
            var current_card = document.getElementById(ps_name)
            var currentBuyLocation = current_card.getElementsByClassName("current_buy_location")[0]
            if (whoPaid.value == ps_name) {
              currentBuyLocation.innerHTML = ":קנייה נוכחית (תשלום על הכל)"
              var currentPrice = current_card.getElementsByClassName("each_ps_price")[0]
              currentPrice.innerHTML = `₪ ${(parseFloat(document.getElementById("total_price").innerHTML)).toFixed(2)}`
              continue
            }
            //If this isn't the one who paid, just changed the title to refer the owe to the one who paid
            currentBuyLocation.innerHTML = `:קנייה נוכחית (ל${whoPaid.value})`

            var text = `<p><span class="income">₪ ${amount}</span><span class="card-item-name"><a href="#">(קנייה נוכחית) מ${ps_name}</a></span></p><br>`
            owe_location.innerHTML += text      

          }
        }
        function redrawCards() {

          //Handle the 'current buy'
          currentBuyDraw()

          //Clear the other calcs content
          var contents = document.getElementsByClassName("card_calcs_content")
          for (item of contents) {
            item.innerHTML = ""
          }

          //Draw each card according to the calcs table
          var table = document.getElementById("calcs_table");
          if (table.rows.length == 0)
            return;

          for (var i = 1, row; row = table.rows[i]; i++) {
            var amount = row.cells[0].innerHTML
            var description = row.cells[1].innerHTML
            var owed = row.cells[2].innerHTML
            var owes = row.cells[3].innerHTML
            var owes_card = document.getElementById(owes)
            var contents = owes_card.getElementsByClassName("card_calcs_content")
            for (content of contents) {
              var text = `<p><span class="expense">₪ ${amount}</span><span class="card-item-name"><a href="#">(${description}) ל${owed}</a></span></p><br>`
              content.innerHTML += text      
            }
            var owed_card = document.getElementById(owed)
            var contents = owed_card.getElementsByClassName("card_calcs_content")
            for (content of contents) {
              var text = `<p><span class="income">₪ ${amount}</span><span class="card-item-name"><a href="#">(${description}) מ${owes}</a></span></p><br>`
              content.innerHTML += text      
            }
          }
          setTotalAmountForAllCards()
          // setCardsLength()
          optimizeCalcs()
        }
        function setCardsLength() {
          for (item of global_PS_set.values()){

            var card = document.getElementById(item)
            var total_amount_location = card.getElementsByClassName("total_for_ps")[0]
            console.log(total_amount_location.style.paddingTop)

            var amounts_list = card.getElementsByClassName("card_calcs_content")[0]
            var expenses = amounts_list.getElementsByClassName("expense")
            var incomes = amounts_list.getElementsByClassName("income")
            var totalAmounts = expenses.length + incomes.length
            if (totalAmounts < 2) continue;
            // var total_amount_location = card.getElementsByClassName("total_for_ps")[0]
            console.log(totalAmounts)
            console.log(total_amount_location.style.paddingTop)
            if (total_amount_location <= -1) { //TODO: fix this, it was just a testing
              total_amount_location.classList.remove("top_10")
              total_amount_location.classList.add("top_3")
            }
            else {
              total_amount_location.classList.remove("top_10")
              total_amount_location.classList.remove("top_3")
              total_amount_location.classList.add("top_0")
            }
            console.log(total_amount_location.classList)
            console.log(total_amount_location.classList.length)
          }
        }
        function setTotalAmountForAllCards() {
          for (item of global_PS_set.values()){
            var card = document.getElementById(item)
            var total_amount_location = card.getElementsByClassName("total_amount")[0]

            //get the first list (we have 2 same lists, 1 for front and 1 for back)
            var amounts_list = card.getElementsByClassName("card_calcs_content")[0]
            var expenses = amounts_list.getElementsByClassName("expense")
            var sum = 0
            sum -= amountToPayEach().toFixed(2)
            for(e of expenses) {
              var x = e.innerHTML.replace("₪","")
              var y = parseFloat(x)
              sum -= y
            }

            var incomes = amounts_list.getElementsByClassName("income")
            for(e of incomes) {
              var x = e.innerHTML.replace("₪","")
              var y = parseFloat(x)
              sum += y
            }
            total_amount_location.innerHTML = `₪ ${Math.abs(sum).toFixed(2)}`
            if (sum < 0) {
              total_amount_location.classList.remove("income")
              total_amount_location.classList.add("expense")
            }
            else {
              total_amount_location.classList.add("income")
              total_amount_location.classList.remove("expense")
            }
          }
        }

        function insertToCalcsTable(owes,owed,amount, description) {
          var table = document.getElementById("calcs_table");
          var row = table.insertRow(-1);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(0);
          var cell3 = row.insertCell(0);
          var cell4 = row.insertCell(0);
          var cell5 = row.insertCell(-1);

          cell1.innerHTML = owes;
          cell2.innerHTML = owed;
          cell3.innerHTML = description;
          cell4.innerHTML = amount;
          cell5.innerHTML = "&times"
          cell5.classList.add("clickable")  
          cell5.addEventListener("click", function() {
            try {
              var row2 = this.parentNode;
              row2.parentNode.removeChild(row2);
              redrawCards()
            }
            catch(err) {
              console.log(err)
            }	
            });
        }
        function initMoreCalcs() {
          initMoreCalcsBox('ps_duty') 
          initMoreCalcsBox('ps_credit')
          initMoreCalcsBox("already_paid", 1)          
        }
        function initMoreCalcsBox(element_id, length=0) {
          select = document.getElementById(element_id);
          old_value = select.value
          select.length = length
          for (item of global_PS_set.values()){
            var opt = document.createElement('option');
            opt.value = item;
            opt.innerHTML = item;
            select.appendChild(opt);
            //Keep the last value selected if possible
            if (item == old_value)
            {
              select.value = item
            }
          }
        }
        function participantAdd() {
          var add_name = document.getElementById("add_chkbox").value
          //Validate the name (not empty, not already in list)
          var valid_name = true
          var error_line = document.getElementById("error_ps_add_div")
          if(add_name == null || add_name == "")
          {
            error_line.innerHTML = "נא לכתוב שם כלשהו"
            valid_name = false
          }
          else if (getAllNames().has(add_name))
          {
            error_line.innerHTML = "נא לכתוב שם שאינו מופיע ברשימה"
            valid_name = false
          }
          if (!valid_name) {
            setTimeout(function(){ document.getElementById("error_ps_add_div").innerHTML = ""; }, 3000);
            return
          }

          //Clone some node, and give it the new name
          var temp_node = document.getElementsByClassName("participant")[0]
          var cln = temp_node.cloneNode(true) //create a clone of the first item
          cln.firstChild.checked = false //make it unchecked
          cln.lastChild.nodeValue = add_name //change its name to the text of the box
          
          var ps_lst = document.getElementById("participants")
          var last_item = document.getElementById("add_ps_list_item")
          ps_lst.removeChild(last_item)          
          ps_lst.appendChild(cln)
          ps_lst.appendChild(last_item)
        }
        function participantsChanged() {
          updateAllParticipants()
          initMoreCalcs()
          redrawCards()
        }

        function updateAllParticipants() {
          getAllParticipants()
          updateParticipantsCards()
        }
        function getAllParticipants() {
          global_PS_set.clear()
          var ps = document.getElementsByClassName('participant')
          for (i = 0; i < ps.length; i++) {
						var element = ps[i]
						var box = element.getElementsByClassName("p_chkbox")[0]
						if(box == null || !box.checked) continue;
            var ps_name = element.innerText || element.textContent;
            global_PS_set.add(ps_name)
          }
          //examples
          // console.log(global_PS_set.size)
          // for (item of global_PS_set.values())
          //   console.log(item)
          // console.log(global_PS_set.has("אפרת"))
        }
        //Get also those who currently not participate
        function getAllNames() {
          var s = new Set()
          var ps = document.getElementsByClassName('participant')
          for (i = 0; i < ps.length; i++) {
						var element = ps[i]
						var box = element.getElementsByClassName("p_chkbox")[0]
						if(box == null) continue;
            var ps_name = element.innerText || element.textContent;
            s.add(ps_name)
          }
          return s
        }

        function updateParticipantsCards() {
          getAllParticipants()
          var participants_locations = document.getElementsByClassName('ps_location')[0]
					participants_locations.innerHTML = ""
          var num = 0

          for (ps_name of global_PS_set.values()) {
            num += 1
            var insertRow = document.createElement('div')
						insertRow.className = "col-45 card"
						// insertRow.id =  `participant_${i}`
            // insertRow.id =  `participant_${ps_name}`
            insertRow.id =  `${ps_name}`
            
						insertRow.innerHTML = getCardContent(ps_name)					
						participants_locations.append(insertRow)
          }

					// Adding temp 'card' to make the last card to be with same size (and not being on the entire row)
					if ((global_PS_set.size % 2) == 1) {
					var tempRow = document.createElement('div')
					tempRow.className = "col-45"
					tempRow.innerHTML = ""
					participants_locations.append(tempRow)					
					}
          updateEachAmount()
        }

        // Build the entire card, with the wrapping classes
        function getCardContent(ps_name) {
            var card_text_content = getCardInnerText(ps_name)
            
						var rowContent =
						`
						  <div class="card-container"> 
                ${card_text_content}
				      </div>
		        
						`
            return rowContent
        }
        //The text of each card
        function getCardInnerText(ps_name) {
          var eachAmount = amountToPayEach()
          var card_text_content =
          `
            <h1>${ps_name}</h1>
            <p><span class="expense each_ps_price">₪ ${eachAmount}</span><span class="card-item-name"><a href="#" class="current_buy_location">:קנייה נוכחית</a></span></p>
            <div class="card_owed_content"><br></div>
            <br>
            <div class="card_calcs_content"></div>
            <div class="total_for_ps top_10">
            <hr>
            <p><span class="income total_amount">₪ 0</span><span class="card-item-name"><b>סה"כ</b></span></p>
            </div>
          `
          return card_text_content
        }
  
        function amountToPayEach() {
          ps_num = global_PS_set.size
          total_price = parseFloat(document.getElementById("total_price").innerHTML)
          return total_price/ps_num
        }
      
        function updateEachAmount() {
          var amount = amountToPayEach().toFixed(2)
          document.getElementById("each_ps_price").innerHTML = amount
          //gather all 'each price' elements
          var all_each = document.getElementsByClassName("each_ps_price") 
          for(var i = 0; i < all_each.length; i++) {
              all_each[i].innerHTML = `₪ ${amount}`
            }
        }

        function createCheckList() {
          var participants = document.getElementById('participants');
          document.getElementById('ps_anchor').onclick = function (evt) {
          if (participants.classList.contains('visible')){
          participants.classList.remove('visible');
          participants.style.display = "none";
          }
          
          else{
          participants.classList.add('visible');
          participants.style.display = "block";
          }
          
          
          }
            
          participants.onblur = function(evt) {
          participants.classList.remove('visible');
          }	 			  
				}
				
				
				function displayTable() {
          var x = document.getElementById("bottom_line");
          if (x.style.display === "none") {
           x.style.display = "block";
          } else {
           x.style.display = "none";
          }
				}

        function displaySummary() {
          var x = document.getElementById("summary_line");
          if (x.style.display === "none") {
           x.style.display = "block";
          } else {
           x.style.display = "none";
          }
				}

        function displaySpecialCalcs() {
          var x = document.getElementById("special_calcs_line");
          if (x.style.display === "none") {
           x.style.display = "block";
          } else {
           x.style.display = "none";
          }
				}
				
        function validFloatInput(x) {
          var valid = !/^\s*$/.test(x) && !isNaN(x) //Checks valid float input
          return valid
        }

				function addElement(itemName, itemPrice) {
        var error_line = document.getElementById("error_item_div")
        error_line.innerHTML = ""
      	if (itemName == null || itemName == "") {
          error_line.innerHTML = "!נא לכתוב את שם המוצר"
				  return
      	}
      	if (itemPrice == null || itemPrice == "") {
          error_line.innerHTML = "!נא לכתוב את מחיר המוצר"
				  return
      	}
        if (!validFloatInput(itemPrice))
        {
          error_line.innerHTML = "!נא לכתוב מחיר תקין"
          return
        }

      	var cartRow = document.createElement('div')
      	var cartItems = document.getElementsByClassName('cart-items')[0]
      	var cartRowContents = `
      	<p>₪ <span class="cart-price">${itemPrice}</span><span class="cart-item"><span class="close">&times;</span><a href="#">${itemName}</a></span></p>`
      	cartRow.innerHTML = cartRowContents
				cartItems.append(cartRow)
      	
      	setCloseAction()
				
        update()
				}
				
        // Adding the ability to close each added item by click the 'x' button
				function setCloseAction() {
      	var closebtns = document.getElementsByClassName("close");
      	var i;
				
      	for (i = 0; i < closebtns.length; i++) {
				closebtns[i].addEventListener("click", function() {
				try {
				this.parentElement.parentElement.style.display = 'none';
				this.parentElement.parentElement.innerHTML = "";
				update()
				}
				catch(err) {
				}	
				});
      	}
				}
				function update() {
      	
      	// <!-- update total items -->
      	var cartItems = document.getElementsByClassName('cart-items')[0]
      	var cartItemNames = cartItems.getElementsByClassName('cart-price')
      	document.getElementById("total_items").innerHTML = cartItemNames.length
      	
      	// <!-- update total price -->
      	var sum = 0
      	for (var i = 0; i < cartItemNames.length; i++) {
				sum += parseFloat(cartItemNames[i].innerHTML);
				}
      	document.getElementById("total_price").innerHTML = sum.toFixed(2)

        // Update price for each participant
        updateEachAmount()
        redrawCards()
				}

        function optimizeCalcs() {
          document.getElementById("summary_tbody").innerHTML = ""
          console.log("here")
          var owes_names = []
          var owes_values = []
          var owed_names = []
          var owed_values = []
          
          var total_items = parseInt(document.getElementById("total_items").innerHTML)
          if (total_price > 0) {
            var total_price = parseInt(document.getElementById("total_price").innerHTML)
            owed_names.push("קנייה")
            owes_values.push(total_price)
          }
          for (ps_name of global_PS_set.values()) {
            var card = document.getElementById(ps_name)
            var amount_location = card.getElementsByClassName("total_amount")[0]
            // console.log(amount_location.classList)
            
            var amount = amount_location.innerHTML
            amount = parseFloat(amount.replace("₪","")).toFixed(2)
            if (amount == 0 || amount == 0.00)
              continue
            if (amount_location.classList.contains("expense")) {
              owes_names.push(ps_name)
              owes_values.push(amount)
            }
            else {
              owed_names.push(ps_name)
              owed_values.push(amount)
            }
          }
          var count = 0
          // console.log("here2")
          // console.log(owed_names.length, owes_names.length)
          // console.log(global_PS_set.size * 10)
          while(owed_names.length >0 && owes_names.length > 0 && count < global_PS_set.size * 10) {
            console.log(owes_names, owes_values)
            console.log(owed_names, owed_values)
            count += 1
            var owes = owes_values[0]
            var owes_name = owes_names[0]
            var owed = owed_values[0]
            var owed_name = owed_names[0]

            if (owes > owed) {
              owes -= owed
              owed_values.shift()
              owed_names.shift()
              if (owes == 0) {
                owes_values.shift()
                owes_names.shift()
                // console.log("continue")
                // continue              
              }
              console.log("owes " + owes)
              insertToOptimizeTable(owes_name,owed_name,owed)
            }
            else {
              owed -= owes
              owes_values.shift()
              owes_names.shift()
              if (owed == 0) {
                owed_values.shift()
                owed_names.shift()
                // console.log("continue")
                // continue                              
              }
              console.log("owed " + owes)
              insertToOptimizeTable(owes_name,owed_name,owes)
            }
          }
          if (count >= global_PS_set.size * 10)
            console.log("count_stopping")
        }
        function insertToOptimizeTable(owes,owed,amount) {
          console.log("insert_row")
          var table = document.getElementById("summary_tbody");
          var row = table.insertRow(-1);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(0);
          var cell3 = row.insertCell(0);
          cell1.innerHTML = owes;
          cell2.innerHTML = owed;
          cell3.innerHTML = amount;
        }
        // function optimizeCalcs() {
        //   var dict_owes = {};
        //   var dict_owed = {};
        //   dict_owes['key'] = "testing";
        //   for (ps_name of global_PS_set.values()) {
        //     var card = document.getElementById(ps_name)
        //     var amount_location = card.getElementsByClassName("total_amount")[0]
        //     // console.log(amount_location.classList)
            
        //     var amount = amount_location.innerHTML
        //     amount = parseFloat(amount.replace("₪","")).toFixed(2)
        //     if (amount == 0 || amount == 0.00)
        //       continue
        //     if (amount_location.classList.contains("expense")) {
        //       dict_owes[ps_name] = amount
        //     }
        //     else {dict_owed[ps_name] = amount}
        //   }
        //   for(var key in dict_owed) {
        //     var first_owes = Object.keys(dict_owes)[0]
        //   }
        //   console.log(dict_owed)
        //   console.log(dict_owes)
        // }
