/**
 * Version v0.3.0
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
        // Run Sequences
        self._sequence.map(function ($oSequence) {
            // Is the sequence Method is a custom function ?
            if (/^\./.test($oSequence.method)) {
                self.customs(
                    $oSequence.receiver,
                    $oSequence.method,
                    $oSequence.keys,
                    $oSequence.delay,
                    $oSequence.args
                )[$oSequence.method.substr(1)]();

                return self;
            }

            // From this point, we are working with TC Functions
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
            let nAttemps = 5;
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
                        Log.Warning(`You requested "Keys()" method on "${$oSequence.receiver.MappedName}" but sequence is empty. It can be as you expected when you have to enter en blank value.`);
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

        // Refresh Sequence log
        if ($bClearSequence) {
            self._sequence = [];
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
     * @param {String}  $sMethod     TC Object Method to call
     * @param {String}  $sRecord     New sequence
     * @param {Number}  $nDelayMs    Delay to wait next to the Keys execution
     * @param {Boolean} $bReqEnabled Indicates if the Enabled check must be performed
     * @param {Array}   $aArgs       Extra arguments (rest) for customs functions
     */
    self.addRecord = function($sMethod, $sRecord, $nDelayMs = null, $bReqEnabled, $aArgs) {
        let nDelay = ($nDelayMs) ? $nDelayMs : self._delay;

        self._sequence.push({
            receiver: self._receiver,
            method: $sMethod,
            keys: $sRecord,
            delay: parseInt(nDelay),
            reqEnabled: $bReqEnabled,
            args: $aArgs
        });

        return self;
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
     * @return {{Delay: Delay}}
     */
    self.customs = function ($oReceiver, $sMethod, $sRecord, $nDelay, $aArgs) {
        return {
            Delay: function () {
                Delay($nDelay);
            }
        }
    };

    //  Generates function for direct Keyboard Controls
    // ------------------------------------------------------------------------
    let oDirectInput = {
        ctrl:         { bAcceptKey: true,  sConstant: '[HOLD]^'      , sMethod: 'Keys' },
        shift:        { bAcceptKey: true,  sConstant: '[HOLD]!'      , sMethod: 'Keys' },
        alt:          { bAcceptKey: true,  sConstant: '[HOLD]~'      , sMethod: 'Keys' },
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
                    oInputSetting.sMethod,
                    `${oInputSetting.sConstant}${$sKey}`,
                    $nDelayMs,
                    bReqEnabled,
                    aRest
                );
            } :
            function ($nDelayMs = null, ...aRest) {
                return self.addRecord(
                    oInputSetting.sMethod,
                    `${oInputSetting.sConstant}`,
                    $nDelayMs,
                    bReqEnabled,
                    aRest
                );
            };
    }

    return self;
}

module.exports = new Keyboard();
