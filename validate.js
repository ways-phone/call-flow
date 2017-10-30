$('document').ready(function () {

    $('.Personal').on('change', validatePersonalDetails);
    $('.Gift').on('change', validateGiftDetails);
    $('.Payment').on('change', validatePaymentDetails);

    var personalInvalids = []; // keeps track of invalid elements in the personal panel
    var giftInvalids = []; // keeps track of invalid elements in the gift panel
    var paymentInvalids = []; // keeps track of invalid elements in the payment panel

    /////////// Validation Logic /////////////////

    // validates the personal details panel
    function validatePersonalDetails() {
        var panel = $('.personal-panel');
        Address();
        Bio();

        // validates address details
        function Address() {
            // define elements for validation
            var address = $('.Address1');
            var suburb = $('.Suburb');
            var state = $('.State');
            var postcode = $('.Postcode');

            var filled = [address, suburb, state, postcode];

            // mark empty fields as invalid;
            filled.forEach(shouldBeFilled);

            // mark address invalid if there is no number
            if (!empty(address.val())) {
                if (!address.val().match(/\d+/g)) {
                    elementInvalid(address, "Address Has No Number!", personalInvalids, panel);
                } else {
                    elementValid(address, personalInvalids, panel);
                }
            }
        }

        // validates first name & last name
        function Bio() {
            // define elements for validation
            var firstName = $('.FirstName');
            var lastName = $('.LastName');
            var filled = [firstName, lastName];

            // mark empty fields as invalid
            filled.forEach(shouldBeFilled);
        }

        // to be used in a for each loop. Marks empty fields as invalid;
        function shouldBeFilled(element) {
            if (empty(element.val())) {
                elementInvalid(element, getClass(element) + " should not be empty!", personalInvalids, panel);
            } else {
                elementValid(element, personalInvalids, panel);
            }
        }

    }

    // validates the gift details panel
    function validateGiftDetails() {
        var panel = $('.gift-panel');

        var rg = $('.RGAmount');
        var sg = $('.SGAmount');
        var startMonth = $('.StartMonth');
        var debitDay = $('.DebitDay');

        var filled = [rg, startMonth, debitDay];

        validateRG();
        validateSG();

        function validateRG() {

            markEmptiesInvalid();
            checkRGFormat();
            validateStartMonth();
            validateDebitDay();


            function markEmptiesInvalid() {
                if (!allElementsEmpty(filled)) {
                    filled.forEach(shouldBeFilled);
                } else {
                    filled.forEach(function (el) {
                        elementValid(el, giftInvalids, panel);
                    });
                }
            }


            function checkRGFormat() {
                if (!!rg.val()) {
                    if (!rgValid(rg)) {
                        elementInvalid(rg, "Incorrect Format!", giftInvalids, panel);
                    } else {
                        elementValid(rg, giftInvalids, panel);
                    }
                }
            }

            function rgValid(rg) {
                if (!!rg.val()) {
                    return !!rg.val().match(/^\d+(\.\d{1,2})?$/g);
                } else {
                    return false;
                }
            }

            function validateStartMonth() {
                var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                var today = new Date();
                var month = today.getMonth() + 1;
                var index = months.indexOf(startMonth.val());
                if (index > -1) {
                    if ((index + 1) < month) {
                        elementInvalid(startMonth, "Start month cannot be before the current month", giftInvalids, panel);
                    } else {
                        elementValid(startMonth, giftInvalids, panel);
                    }
                }

            }

            function validateDebitDay() {

            }

            function allElementsEmpty(elements) {
                allEmpty = true;
                if (!!elements) {
                    elements.forEach(function (el) {
                        if (el.val() !== "") {
                            allEmpty = false;
                        }
                    });
                }
                return allEmpty;
            }

            // to be used in a for each loop. Marks empty fields as invalid;
            function shouldBeFilled(element) {
                if (empty(element.val())) {
                    elementInvalid(element, getClass(element) + " should not be empty!", giftInvalids, panel);
                } else {
                    elementValid(element, giftInvalids, panel);
                }
            }
        }

        function validateSG() {

            function validateSGAmount() {

            }
            if (sg.val() !== "") {
                filled.forEach(shouldBeEmpty);
            }

            function shouldBeEmpty(element) {
                if (!empty(element.val())) {
                    elementInvalid(element, getClass(element) + " should be empty!", giftInvalids, panel);
                } else {
                    elementValid(element, giftInvalids, panel);
                }
            }
        }

    }

    // validates the payment details panel
    function validatePaymentDetails() {

        var panel = $('.payment-panel');
        var cardNumber = $('.CardNumber');
        var cardName = $('.NameOnCard');
        var ExpiryMonth = $('.ExpiryMonth');
        var ExpiryYear = $('.ExpiryYear');
        var DebitName = $('.AccountHoldersName');
        var BSB = $('.BSB');
        var AccountNumber = $('.AccountNumber');

        validateCreditCard();
        validateDirectDebit();

        function validateCreditCard() {

            var filled = [cardName, cardNumber, ExpiryMonth, ExpiryYear]
            var empty = [DebitName, BSB, AccountNumber];

            validate();

            function validate() {
                if (!allElementsEmpty(filled)) {
                    filled.forEach(shouldBeFilled);
                    validateCardNumber();
                    validateExpiryYear();
                    validateExpiryMonth();
                } else {
                    filled.forEach(function (el) {
                        elementValid(el, paymentInvalids, panel);
                    });
                }
            }

            function validateCardNumber() {
                elementValid(cardNumber, paymentInvalids, panel);
                if (length()) {
                    elementInvalid(cardNumber, "Incorrect Number of Digits", paymentInvalids, panel);
                } else {
                    elementValid(cardNumber, paymentInvalids, panel);
                    if (!luhn()) {
                        elementInvalid(cardNumber, "Fails Luhn Algorithm", paymentInvalids, panel);
                    } else {
                        elementValid(cardNumber, paymentInvalids, panel);
                    }
                }

                function luhn() {
                    var value = cardNumber.val()
                    var double = false;
                    var sum = 0;
                    for (var i = value.length - 1; i >= 0; i--) {
                        var intVal = parseInt(value.charAt(i));
                        if (double) {
                            var newVal = intVal * 2;
                            double = false;
                            if (newVal > 9) {
                                newVal -= 9;
                                sum += newVal;
                            } else {
                                sum += newVal;
                            }
                        } else {
                            sum += intVal;
                            double = true;
                        }
                    }
                    return sum % 10 === 0;

                }

                function length() {
                    var b = (cardNumber.val().length < 15 || cardNumber.val().length > 16);
                    console.log(b);
                    return b;
                }
            }

            function validateExpiryMonth() {
                var today = new Date();
                var currentMonth = today.getMonth() + 1;
                var currentYear = today.getFullYear();
                if (Number.parseInt(ExpiryYear.val()) === currentYear) {
                    if (Number.parseInt(ExpiryMonth.val()) < currentMonth) {
                        elementInvalid(ExpiryMonth, "Expiry Month cannot be before the current month", paymentInvalids, panel)
                    } else {
                        elementValid(ExpiryMonth, paymentInvalids, panel);
                    }
                } else {
                    if (ExpiryMonth.val() !== "") {
                        elementValid(ExpiryMonth, paymentInvalids, panel);
                    }
                }
            }

            function validateExpiryYear() {
                var today = new Date();
                var currentYear = today.getFullYear();
                if (Number.parseInt(ExpiryYear.val()) < currentYear) {
                    elementInvalid(ExpiryYear, "Expiry Year cannot be before the current year", paymentInvalids, panel);
                } else {
                    if (ExpiryYear.val() !== "") {
                        elementValid(ExpiryYear, paymentInvalids, panel);
                    }
                }
            }


        }

        function validateDirectDebit() {
            var filled = [DebitName, BSB, AccountNumber];

            validate();

            function validate() {
                if (!allElementsEmpty(filled)) {
                    filled.forEach(shouldBeFilled);
                    validateBSB();
                    validateAccountNumber();
                } else {
                    filled.forEach(function (el) {
                        elementValid(el, paymentInvalids, panel);
                    });
                }
            }

            function validateBSB() {
                if (!(BSB.val().match(/^((\d{2}-\d{2})|(\d{3}-\d{3}))$/g))) {
                    elementInvalid(BSB, "Invalid BSB Format (Must be XXX-XXX or XX-XX)", paymentInvalids, panel);
                } else {
                    if (BSB.val() !== "") {
                        elementValid(BSB, paymentInvalids, panel);
                    }
                }
            }

            function validateAccountNumber() {
                if (!(AccountNumber.val().match(/^\d+$/g))) {
                    elementInvalid(AccountNumber, "Account Number must only be Numbers", paymentInvalids, panel);
                } else {
                    if (AccountNumber.val() !== "") {
                        elementValid(AccountNumber, paymentInvalids, panel);
                    }
                }
            }

        }

        function allElementsEmpty(elements) {
            allEmpty = true;
            if (!!elements) {
                elements.forEach(function (el) {
                    if (el.val() !== "") {
                        allEmpty = false;
                    }
                });
            }
            return allEmpty;
        }

        // to be used in a for each loop. Marks empty fields as invalid;
        function shouldBeFilled(element) {
            if (empty(element.val())) {
                elementInvalid(element, getClass(element) + " should not be empty!", paymentInvalids, panel);
            } else {
                elementValid(element, paymentInvalids, panel);
            }
        }

        function shouldBeEmpty(element) {
            if (!empty(element.val())) {
                elementInvalid(element, getClass(element) + " should be empty!", paymentInvalids, panel);
            } else {
                elementValid(element, paymentInvalids, panel);
            }
        }

    }


    //////////////// General Functions //////////////

    // returns true if an element is emtpy
    function empty(field) {
        if (field) {
            return field.length === 0;
        } else {
            return true;
        }
    }

    // gets the warning defined class in order to remove it 
    function getClass(element) {
        var arr = element.attr('class').split(' ');
        return arr[arr.length - 1];
    }

    // marks an element as invalid
    function elementInvalid(element, message, invalidArr, panel) {
        // if the element has not been marked invalid continue
        if (invalidArr.indexOf(getClass(element)) === -1) {
            setElementCss(element, message, getClass(element));
            invalidArr.push(getClass(element));
            panelInvalid(panel);
        }
        // sets the element css to show it is invalid
        function setElementCss(element, message, className) {
            element.css("border-color", "red");
            element.closest('tr').after("<tr id=" + className + "warning><td></td><td class='errors'" +
                "style='color:#a94442; padding:8px;'>" + message + "</td></tr>")
        }

    }

    // marks an element as valid
    function elementValid(element, invalidArr, panel) {
        // removes the warning message element 
        $('#' + getClass(element) + 'warning').remove();

        // ensures the error exists in the invalids array 
        var index = invalidArr.indexOf(getClass(element));
        if (index !== -1) {
            invalidArr.splice(index, 1);
            element.css("border-color", "#ccc");
        }
        // if there are no panel invalids mark the panel as valid;
        if (invalidArr.length === 0) {
            panelValid(panel);
        }
    }

    // puts a red border around the panel if there are errors
    function panelInvalid(panel) {
        panel.css("border-color", "red");
        panel.children('.panel-heading').css("background-color", "#ff8080");
        panel.children('.panel-heading').children().css("color", "#c90000");
    }

    // removes the red borders around the panel if there are no errors
    function panelValid(panel) {
        panel.css("border", "none");
        panel.children('.panel-heading').css("background-color", "white");
        panel.children('.panel-heading').children().css("color", "black");
    }
});