/**
 * Version v0.6.1
 *
 * @Author: Nicolas DUPRE (VISEO)
 *
 * Keyboard Interface to simplify manipulation with controls keys while
 * handling delay between input sequence
 *
 * @return {Keyboard}
 * @constructor
 */

function Keyboard() {
    let self = this;

    /**
     * @type {Array} _sequence  Recorded sequence to executes on run().
     * @private
     *
     */
    self._sequence = [];

    /**
     * @type {null} TestComplete object which must have method Keys()
     * @private
     */
    self._receiver = null;

    /**
     * @type {number} Delay to wait after the execution of the sequence.
     * @private
     */
    self._delay    = 100;

    /**
     * @type {boolean}  Indicates if we have to perform RefreshMappingInfo before
     *                  executing sequence.
     * @private
     */
    self._autorefresh = true;

    /**
     * @type {boolean}  Methods Keys will automatically clear the fill before entering text.
     *
     * @private
     */
    self._keysautoclear = true;

    /**
     * @type {number} Maximum time (in ms) to wait when we acquiring TC Object.
     * @private
     */
   // self._timeout = 30000;
    self._timeout = 120000;

    /**
     * @type {number} Time in ms between to retry for acquiring TC Object.
     * @private
     */
    self._interval = 250;

    /**
     * Set TestComplete object which has method Keys() to received recorded sequence.
     *
     * @param {object} $oTestCompleteAlias
     *
     * @return {Keyboard}
     */
    self.on = function ($oTestCompleteAlias) {
        self._receiver = $oTestCompleteAlias;

        return self;
    };

    /**
     * Set the delay in ms after registering a new sequence.
     *
     * @param $nDelayMs  Delay in millisecond
     *
     * @return {Keyboard}
     */
    self.delay = function ($nDelayMs = 100) {
        if (typeof $nDelayMs !== 'number') $nDelayMs = 100;

        self._delay = $nDelayMs;

        return self;
    };

    /**
     * Send recorded sequence in set received with method on()
     *
     * @param {boolean} $bClearSequence  Indicates if we have to clear recorded sequences
     *
     * @return {Keyboard}
     */
    self.send = function ($bClearSequence = true) {
        // Next to the new method 'function()',
        // We can have nested Keyboard calls (in callbacks).
        // addRecord() will complete self._sequence by append while
        // we are currently executing sequence.
        // So we picked sequence (consumed) to left an empty sequence
        // for nested Keyboard.x().run();
        //
        // Sequence will be recovered at the end of the execution
        // if $bClearSequence is set to false
        let oSequence = self._sequence;
        self._sequence = [];

        // Run Sequences
        oSequence.forEach(function ($oSequence, $nIdx) {
            // Is the sequence Method is a custom function ?
            if (/^\./.test($oSequence.method)) {
                self.customs(
                    $oSequence.receiver,
                    $oSequence.caller,
                    $oSequence.method,
                    $oSequence.keys,
                    $oSequence.delay,
                    $oSequence.args
                )[$oSequence.method.substr(1)]();

                return self;
            }
            // Autorefresh and wait until object is found with max timeout
            $oSequence.receiver = self.waitingFor($oSequence.receiver);

            // From this point, we are working with TC Functions
            // @TODO : !== ???
            if ($oSequence.receiver) {
                if (typeof $oSequence.Keys === 'function') {
                    Log.error('Keyboard Error :: Defined TestComplete object with on() do not have method Keys().');
                    return false;
                }
            } else {
                Log.error('Keyboard Error :: You have not defined TestComplete object with Keys() method.');
                return false;
            }

            // We knows there is a little delay where Receiver
            // can be Disabled before turning to Enabled
            // To prevent developper to set manually a delay
            // We will perform test before considering it as really Disabled
            let nAttemps = 10;
            let bCanRun  = true;

            if ($oSequence.reqEnabled) {
                while (nAttemps) {
                    if ($oSequence.receiver.Enabled) {
                        break;
                    }

                    Delay(100);
                    nAttemps--;
                }

                if (!$oSequence.receiver.Enabled) {
                    bCanRun = false;
                }
            }

            // Once possibily of execution determined
            // Perform the action.
            if (bCanRun) {
               // Mains Methods (Keyboard) Keys() expected A string    
               // When we pass an empty string, we must send empty keys
                if ($oSequence.keys) {
                    $oSequence.receiver[$oSequence.method]($oSequence.keys);
                } else {
                    // Check if methods is Keys()
                    if ($oSequence.method === 'Keys') {
                        //Log.Warning(`You requested "Keys()" method on "${$oSequence.receiver.MappedName}" but sequence is empty. It can be as you expected when you have to enter en blank value.`);
                        $oSequence.receiver[$oSequence.method]($oSequence.keys);
                    } else {
                        $oSequence.receiver[$oSequence.method]();
                    }
                }

                Delay($oSequence.delay);
            } else {
                Log.Warning(`Unable to process keyboard input "${$oSequence.method}( ${$oSequence.keys} )" into the disabled control : ${$oSequence.receiver.MappedName}`);
            }
        });

        // If we do not refresh sequence
        // Restore picked sequence
        if (!$bClearSequence) {
            self._sequence = oSequence;
        }

        return self;
    };

    /**
     * Alias of send() which can be more intuitive.
     *
     * @param {boolean} $bClearSequence  Indicates if we have to clear recorded sequences
     *
     * @return {Keyboard}
     */
    self.run = function ($bClearSequence = true) {
        return self.send($bClearSequence);
    };

    /**
     * Append request sequence record in the buffer.
     *
     * @param {String}  $sSelfMethod     Keyboard Caller Methode
     * @param {String}  $sCallMethod     TC Object Method to call
     * @param {String}  $sRecord     New sequence
     * @param {Number}  $nDelayMs    Delay to wait next to the Keys execution
     * @param {Boolean} $bReqEnabled Indicates if the Enabled check must be performed
     * @param {Array}   $aArgs       Extra arguments (rest) for customs functions
     *
     * @return {Keyboard}
     */
    self.addRecord = function($sSelfMethod, $sCallMethod, $sRecord, $nDelayMs = null, $bReqEnabled, $aArgs) {
        let nDelay = ($nDelayMs) ? $nDelayMs : self._delay;

        // Specific Rule for Native TC Method "Keys()"
        // We want to add "CTRL+A, BackSpace", to clear fields before input.
        if ($sSelfMethod === 'keys' && self._keysautoclear) {
            self._sequence.push({
                receiver: self._receiver,
                caller: $sSelfMethod,
                method: $sCallMethod,
                keys: '^a[BS]',
                delay: self._delay,
                reqEnabled: $bReqEnabled,
                args: $aArgs
            });
        }

        self._sequence.push({
            receiver: self._receiver,
            method: $sCallMethod,
            keys: $sRecord,
            delay: parseInt(nDelay),
            reqEnabled: $bReqEnabled,
            args: $aArgs
        });

        return self;
    };

    /**
     * Define the maximum time for acquiring TC Object.
     * Timeout is set by defaut to 30seconds.
     *
     * @param $nTimeoutMs  Delay in ms for Auto waiting.
     */
    self.timeout = function ($nTimeoutMs = 30000) {
       self._timeout = $nTimeoutMs;
    };

    /**
     * Define the delay interval between 2 retry of acquiring TC Object.
     *
     * @param {Number} $nIntervalMs Delay between to retry.
     */
    self.interval = function ($nIntervalMs = 250) {
        self._interval = $nIntervalMs;
    };

    /**
     * Acquiring the TestComplete object with wait until object is found (or timeout reached).
     *
     * @param {Object} $oObject Object to acquire.
     *
     * @return {{Exists}|*}
     */
    self.waitingFor = function ($oObject) {
        let nProjectTimeout = Options.Run.Timeout;
        let nStartTime = new Date();
        let nStepDate = new Date();

        if ($oObject) {
            if(self._autorefresh) {
                Options.Run.Timeout = self._interval;

                do {
                    nStepDate = new Date();
                    let nRemainingTime = (self._timeout/1000) - Math.round((nStepDate - nStartTime) / 1000);
                    try {
                        // Switch to micro time delay for acquiring object
                        $oObject.RefreshMappingInfo();
                    } catch (err) {

                    }
                    Indicator.PushText(`Timeout in ${nRemainingTime} seconds.`);
                } while(!$oObject.Exists && ((nStepDate - nStartTime) < self._timeout))

                if ($oObject.Exists) {
                    // Revert back to project setting
                    Options.Run.Timeout = nProjectTimeout;
                    Indicator.PushText(`Object found. Performing actions.`);
                } else {
                    // Revert back to project setting
                    Options.Run.Timeout = nProjectTimeout;
                    Indicator.PushText(`Object not found. Raising Error.`);
                    Log.Error(`Unable to find object in the expected time.`);
                }
            }
        }

        return $oObject;
    };

    /**
     * Return the property value of object set with .on()
     *
     * @param {String} $sProperty   Object property to retrieve.
     * @param {Object} $oObject     [Optional] Object to process.
     *
     * @return {*}
     */
    self.get = function ($sProperty, $oObject = null) {
        let oObject = $oObject || self._receiver;
        oObject = self.waitingFor(oObject);
        return oObject[$sProperty];
    };

    /**
     * Custom Internal function intefface.
     * This function purpose is to send all parameters and return the
     * function to call which can reuse interface object.
     * Extra arguments are in $aArgs.
     *
     * @param {Object} $oReceiver   TC Object set
     * @param {String} $sMethod     Method to call
     * @param {String} $sRecord     String record
     * @param {Number} $nDelay      Delays in ms
     * @param {Array}  $aArgs       All others arguments passed in method "Keyboard.<custFunction>(delay, x,y,z)
     *
     * @return {{Refresh: Refresh, Delay: Delay}}
     */
    self.customs = function ($oReceiver, $sCaller, $sMethod, $sRecord, $nDelay, $aArgs) {
        return {
            /**
             * Executes TC Statement Delay.
             */
            Delay: function () {
                Delay($nDelay);
            },

            /**
             * Executes TC Method RefreshMappingInfo on TC Object if
             * auto refresh is disabled.
             */
            Refresh: function () {
                self.waitingFor($oReceiver);
            },

            /**
             * Turn On/Off autorefresh before performing any action on TC Object.
             * Mainly designed for Web pages where elements can be updated.
             * This function do not need $nDelay, so considering the boolean is provided
             * in $nDelay to have this statement :
             *
             *  .autorefresh(true) insteand of .autorefresh(0, true)
             *
             * @return {Keyboard}
             */
            AutoRefresh: function () {
                let nBoolean = ($aArgs[0]) ? true : false;

                self._autorefresh = nBoolean;
            },

            /**
             * Executes the provided function in the first argument. The rest
             * is passed to the function.
             *
             * @return {Keyboard}
             */
            Function: function () {
                // Use var to left intact $aArgs
                let aArgs = $aArgs;

                // First argument = function
                aArgs.shift().apply(this, aArgs);

                // Perform provided delay
                Delay($nDelay);

                return self;
            }
        }
    };

    /**
     * Turn on/off the auto clear of field before typing the keys.
     *
     * @param {Boolean} $bEnabled
     *
     * @return {Keyboard}
     */
    self.keysautoclear = function ($bEnabled = false) {
        self._keysautoclear = $bEnabled;

        return self;
    }

    //  Generates function for direct Keyboard Controls
    // ------------------------------------------------------------------------
    let oDirectInput = {
        ctrl:         { bAcceptKey: true,  sConstant: '[Hold]^'      , sMethod: 'Keys' },
        shift:        { bAcceptKey: true,  sConstant: '[Hold]!'      , sMethod: 'Keys' },
        alt:          { bAcceptKey: true,  sConstant: '[Hold]~'      , sMethod: 'Keys' },
        appsKey:      { bAcceptKey: false, sConstant: '[Apps]'       , sMethod: 'Keys' },
        bs:           { bAcceptKey: false, sConstant: '[BS]'         , sMethod: 'Keys' },
        backspace :   { bAcceptKey: false, sConstant: '[BS]'         , sMethod: 'Keys' },
        caps :        { bAcceptKey: false, sConstant: '[Caps]'       , sMethod: 'Keys' },
        clear :       { bAcceptKey: false, sConstant: '[Clear]'      , sMethod: 'Keys' },
        del :         { bAcceptKey: false, sConstant: '[Del]'        , sMethod: 'Keys' },
        delete :      { bAcceptKey: false, sConstant: '[Del]'        , sMethod: 'Keys' },
        down :        { bAcceptKey: false, sConstant: '[Down]'       , sMethod: 'Keys' },
        end :         { bAcceptKey: false, sConstant: '[End]'        , sMethod: 'Keys' },
        enter :       { bAcceptKey: false, sConstant: '[Enter]'      , sMethod: 'Keys' },
        esc :         { bAcceptKey: false, sConstant: '[Esc]'        , sMethod: 'Keys' },
        escape :      { bAcceptKey: false, sConstant: '[Esc]'        , sMethod: 'Keys' },
        home :        { bAcceptKey: false, sConstant: '[Home]'       , sMethod: 'Keys' },
        ins :         { bAcceptKey: false, sConstant: '[Ins]'        , sMethod: 'Keys' },
        insert :      { bAcceptKey: false, sConstant: '[Ins]'        , sMethod: 'Keys' },
        left :        { bAcceptKey: false, sConstant: '[Left]'       , sMethod: 'Keys' },
        right :       { bAcceptKey: false, sConstant: '[Right]'      , sMethod: 'Keys' },
        up :          { bAcceptKey: false, sConstant: '[Up]'         , sMethod: 'Keys' },
        tab :         { bAcceptKey: false, sConstant: '[Tab]'        , sMethod: 'Keys' },
        win :         { bAcceptKey: false, sConstant: '[Win]'        , sMethod: 'Keys' },
        pause :       { bAcceptKey: false, sConstant: '[Pause]'      , sMethod: 'Keys' },
        pageUp :      { bAcceptKey: false, sConstant: '[PageUp]'     , sMethod: 'Keys' },
        pageDown :    { bAcceptKey: false, sConstant: '[PageDown]'   , sMethod: 'Keys' },
        prtsc :       { bAcceptKey: false, sConstant: '[PrtSc]'      , sMethod: 'Keys' },
        print :       { bAcceptKey: false, sConstant: '[PrtSc]'      , sMethod: 'Keys' },
        printScreen : { bAcceptKey: false, sConstant: '[PrtSc]'      , sMethod: 'Keys' },
        scrollLock :  { bAcceptKey: false, sConstant: '[ScrollLock]' , sMethod: 'Keys' },
        sl :          { bAcceptKey: false, sConstant: '[ScrollLock]' , sMethod: 'Keys' },
        slock :       { bAcceptKey: false, sConstant: '[ScrollLock]' , sMethod: 'Keys' },
        numPlus :     { bAcceptKey: false, sConstant: '[NumPlus]'    , sMethod: 'Keys' },
        nump :        { bAcceptKey: false, sConstant: '[NumPlus]'    , sMethod: 'Keys' },
        numMinus :    { bAcceptKey: false, sConstant: '[NumMinus]'   , sMethod: 'Keys' },
        numm :        { bAcceptKey: false, sConstant: '[NumMinus]'   , sMethod: 'Keys' },
        numLock :     { bAcceptKey: false, sConstant: '[NumLock]'    , sMethod: 'Keys' },
        numl :        { bAcceptKey: false, sConstant: '[NumLock]'    , sMethod: 'Keys' },
        numAsterisk : { bAcceptKey: false, sConstant: '[NumAsterisk]', sMethod: 'Keys' },
        numa :        { bAcceptKey: false, sConstant: '[NumAsterisk]', sMethod: 'Keys' },
        numSlash :    { bAcceptKey: false, sConstant: '[NumSlash]'   , sMethod: 'Keys' },
        nums :        { bAcceptKey: false, sConstant: '[NumSlash]'   , sMethod: 'Keys' },
        space :       { bAcceptKey: false, sConstant: ' '            , sMethod: 'Keys' },

        // Extra Mouse Functions (TC)
        keys:         { bAcceptKey: true,  sConstant: ''             , sMethod: 'Keys'                           },
        click:        { bAcceptKey: false, sConstant: ''             , sMethod: 'Click'                          },
        clickM:       { bAcceptKey: false, sConstant: ''             , sMethod: 'ClickM'                         },
        clickR:       { bAcceptKey: false, sConstant: ''             , sMethod: 'ClickR'                         },
        dblClick:     { bAcceptKey: false, sConstant: ''             , sMethod: 'DblClick'                       },
        dblClickM:    { bAcceptKey: false, sConstant: ''             , sMethod: 'DblClickM'                      },
        dblClickR:    { bAcceptKey: false, sConstant: ''             , sMethod: 'DblClickR'                      },
        drag:         { bAcceptKey: false, sConstant: ''             , sMethod: 'Drag'                           },
        dragM:        { bAcceptKey: false, sConstant: ''             , sMethod: 'DragM'                          },
        dragR:        { bAcceptKey: false, sConstant: ''             , sMethod: 'DragR'                          },

        // Extrat Mouse Function (SAP Specific)
        hoverMouse:   { bAcceptKey: false, sConstant: ''             , sMethod: 'HoverMouse'                     },
        mouseWheel:   { bAcceptKey: false, sConstant: ''             , sMethod: 'MouseWheel'                     },
        press:        { bAcceptKey: false, sConstant: ''             , sMethod: 'Press'                          },
        setFocus:     { bAcceptKey: false, sConstant: ''             , sMethod: 'SetFocus'   ,bReqEnabled: false },

        // Custom Functions
        wait:         { bAcceptKey: false, sConstant: ''             , sMethod: '.Delay'                         },
        refresh:      { bAcceptKey: false, sConstant: ''             , sMethod: '.Refresh'                       },
        autorefresh:  { bAcceptKey: false, sConstant: ''             , sMethod: '.AutoRefresh'                   },
        function:     { bAcceptKey: false, sConstant: ''             , sMethod: '.Function'                      },
    };

    // Settings for Fx Keys
    for (let f = 1; f < 13; f++) {
        let oFKeySetting = {
            bAcceptKey: false,
            sConstant : `[F${f}]`,
            sMethod   : 'Keys'
        };

        oDirectInput[`f${f}`] = oFKeySetting;
        oDirectInput[`F${f}`] = oFKeySetting;
    }

    // Generating Methods
    for (let sInput in oDirectInput) {
        let oInputSetting = oDirectInput[sInput];
        let bReqEnabled   = (oInputSetting.bReqEnabled) ? true : false;

        self[sInput] = (oInputSetting.bAcceptKey) ?
            function ($sKey, $nDelayMs = null, ...aRest) {
                return self.addRecord(
                    sInput,
                    oInputSetting.sMethod,
                    `${oInputSetting.sConstant}${$sKey}`,
                    $nDelayMs,
                    bReqEnabled,
                    aRest
                );
            } :
            function ($nDelayMs = null, ...aRest) {
                return self.addRecord(
                    sInput,
                    oInputSetting.sMethod,
                    `${oInputSetting.sConstant}`,
                    $nDelayMs,
                    bReqEnabled,
                    aRest
                );
            };
    }

    // Set default Timeout to fix Options after a crash
    Options.Run.Timeout = 10000;

    return self;
}

module.exports = new Keyboard();
