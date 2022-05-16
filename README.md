# TestComplete - Keyboard Interface

> An interface to perform Keyboard (and some Mouse) actions in an easier way.

* **Version** : ``v0.6.2``
* **Compatibility** : **TestComplete** only
* **Script** : ``./node_modules/@testcomplete/keyboard/Keyboard.js``
* **Dependencies** :
    * none


## Summary

[](BeginSummary)
* [Summary](#summary)
* [Keyboard Setup for TestComplete](#keyboard-setup-for-testcomplete)
* [Get Started](#get-started)
* [Detailed Documentation](#detailed-documentation)
    * [Method ``on()``](#method-on)
    * [Method ``keys()``](#method-keys)
    * [method ``run()``](#method-run)
    * [method ``send()``](#method-send)
    * [Method ``delay()``](#method-delay)
    * [Method ``wait()``](#method-wait)
    * [Method ``refresh()``](#method-refresh)
    * [Method ``autorefresh()``](#method-autorefresh)
    * [Method ``keysautoclear()``](#method-keysautoclear)
    * [Method ``setFocus()``](#method-setfocus)
    * [Method ``function()``](#method-function)
    * [Method ``get()``](#method-get)
* [Cheat Sheet ``Keyboard``](#cheat-sheet-keyboard)
    * [Top of Methods](#top-of-methods)
        * [Method ``on()``](#method-on)
        * [Method ``keys()``](#method-keys)
        * [method ``run()``](#method-run)
        * [method ``send()``](#method-send)
        * [Method ``delay()``](#method-delay)
        * [Method ``wait()``](#method-wait)
        * [Method ``refresh()``](#method-refresh)
        * [Method ``autorefresh()``](#method-autorefresh)
        * [Method ``keysautoclear()``](#method-keysautoclear)
        * [Method ``setFocus()``](#method-setfocus)
        * [Method ``function()``](#method-function)
        * [Method ``get()``](#method-get)
* [List of all methods](#list-of-all-methods)
[](EndSummary)



## Keyboard Setup for TestComplete

As this library is published on **npmjs**,
you can easily get library with the following command
if you have **nodejs** installed on your computer.

````bash
npm install @testcomplete/keyboard
````

Please confer to this documentation to add script in TestComplete :

Script List for the setup :

* ``./node_modules/@testcomplete/keyboard/Keyboard.js``

[TestComplete Library Setup](https://gitlab.viseo.com/testcomplete/documentations/testcompletelibrarysetup)



## Get Started

During our developments, we encountered many situations where
navigation thanks to the keyboard highly help us for automation.

To increase code readability where keyboard is used and simplify writing, 
I choose to create a **Keyboard** interface which allow recording instructions
sequences from methods (name) standing for the keyboard key.
You can enter text sequence as like TestComplete standard one (`Keys()`) as well.

Some methods accept a **key** as parameter to produce a combination key as like **CTRL+F** (`.ctrl('f')`).

Please find below the exhaustive list of generated methods for keys

| Method | Combining | Keys | │ | Method | Combining | Keys |
|---|:---:|:---:|:---:|---|:---:|:---:|
| ctrl | True | CTRL | │ | win | False | Windows |
| shift | True | SHIFT | │ | pause | False | Pause |
| alt | True | ALT | │ | pageUp | False | Page Up |
| appsKey | False | Apps Key | │ | pageDown | False | Page Down |
| bs | False | Backspace | │ | prtsc | False | Print Screen |
| backspace | False | Backspace | │ | print | False | Print Screen |
| caps | False | Caps Lock | │ | printScreen | False | Print Screen |
| clear | False | Delete | │ | scrollLock | False | Scroll Lock|
| del | False | Delete | │ | sl | False | Scroll Lock |
| delete | False | Delete | │ | slock | False | Scroll Lock |
| down | False | Down | │ | numPlus | False | Numeric Plus (+) |
| end | False | End | │ | nump | False | Numeric Plus (+) |
| enter | False | Enter | │ | numMinus | False | Numeric Minus (-) |
| esc | False | Escape | │ | numm | False | Numeric Minus (-) |
| escape | False | Escape | │ | numLock | False | Numeric Lock |
| home | False | Home | │ | numl | False | Numeric Lock |
| ins | False | Insert | │ | numAsterisk | False | Numeric Asterisk |
| insert | False | Insert | │ | numa | False | Numeric Asterisk |
| left | False | Left | │ | numSlash | False | Numeric Slash |
| right | False | Right | │ | nums | False | Numeric Slash |
| up | False | Up | │ | space | False | Space |
| tab | False | Tabulation | │ | F1 | False | Function Key F1 |
| F2 | False | Function Key F2 | │ | F3 | False | Function Key F3 |
| F4 | False | Function Key F4 | │ | F5 | False | Function Key F5 |
| F6 | False | Function Key F6 | │ | F7 | False | Function Key F7 |
| F8 | False | Function Key F8 | │ | F9 | False | Function Key F9 |
| F10 | False | Function Key F10 | │ | F11 | False | Function Key F11 |
| F12 | False | Function Key F12 | │ | f1 | False | Function Key F1 |
| f2 | False | Function Key F2 | │ | f3 | False | Function Key F3 |
| f4 | False | Function Key F4 | │ | f5 | False | Function Key F5 |
| f6 | False | Function Key F6 | │ | f7 | False | Function Key F7 |
| f8 | False | Function Key F8 | │ | f9 | False | Function Key F9 |
| f10 | False | Function Key F10 | │ | f11 | False | Function Key F11 |
| f12 | False | Function Key F12 | │ |  |  |  |
| keys | True | TestComplete Keys() Method | │ | click | False | Mouse Click |
| clickM | False | Mouse Middle Click | │ | clickR | False | Mouse Right Click |
| dblClick | False | Mouse Double Click | │ | dblClickM | False | Mouse Double Middle Click |
| dblclickR | False | Mouse Double Right Click | │ | drag | False | Mouse Drag |
| dragM | False | Mouse Middle Button Drag | │ | dragR | False | Mouse Right Button Drag |
| hoverMouse | False | SAPLOGON Specific Mouse Hover | │ | mouseWheel | False | SAPLOGON Specific Scrolling |
| press | False | SAPLOGON Specific Press event | │ | setFocus | False | SAPLOGON Specific set focus on field |
| wait | False | Wait specified delay | │ | refresh | False | Refresh NameMapped object |
| autoRefresh | False | Enable/Disable autorefresh | │ | function | False | Executes provided function |

All here before methods mentioned can be called from loaded ``Keyboard`` interface
with following statement and main definition is (methods are case sensitive) :

> Keyboard <method>( [ String $sKey, [ Number $nDelayMs ] ] | [ Number $nDelayMs ] )

Before calling keys methods, you have at least call the method ``.on()``
to set TestComplete NameMapping Object which will receive inputs.

All keys methods called next to method ``.on()`` will refer to previously 
object set. You can change the TestComplete NM Object by calling method
``.on()`` at any time. 

````js
const Keyboard = require('Keyboard');

let kb = Keyboard.on(Aliases.browser.BrowserWindow).ctrl('f').enter().escape().right();
````

All methods have a last optional argument ``$nDelayMs`` to set the
delay time to wait at the end of the sequence. It's concerns only the 
sequence which is currently registering.

````js
// For Method accepting key :
Keyboard.ctrl('f', 1000);   // Press CTRL+F & Wait 1000ms

// For Method which stand for direct intput
Keyboard.enter(2000);       // Press Enter & Wait 2000ms
````

From this point, you can run sequence thanks to method ``run()`` (Alias `send()`);






## Detailed Documentation


### Method ``on()``

> Keyboard on( Object $oTestCompleteAlias )

This method store the TestComplete object which will received keys sequences
recorded in its own method ``Keys()``.

It can be set at anytime, before the call of method ``run()`` (Alias `send()`);



### Method ``keys()``

> Keyboard keys( String $sKeys, [ Number $nDelayMs] )

The ``Keyboard`` method `keys()` works like the TestComplete standard one and
accept any sequence which respect the following documentation :
[Keys Method](https://support.smartbear.com/testcomplete/docs/reference/test-objects/members/common-for-sys-desktop-pda/keys-method-sys-desktop-object.html)


````js
Keyboard.keys('[Hold]^f[Release]MySearchWord').run();
// Will produce the same result as :
Keyboard.ctrl('f').keys('MySearchWord').run();
````

You can passe in extra parameter the delay you want to apply
only for this sequence by filling ``$nDelayMs`` where the delay 
is in milliseconds.



### method ``run()``

> Keyboard run( [ Boolean $bClearSequence = true ] )

This method call method ``Keys()`` of the provided **TestComplete**
object set by ``on()``.
If object is not defined or if it does not have method ``Keys()``,
an error is logged with ``Error`` level and returns `false` .

As method ``run()`` return `Keyboard` interface, you can :

- Re-execute the sequence if ``run()`` has been call with flag
`$bClearSequence = false` and or append new sequences.
- Record a new sequence and execute it



### method ``send()``

> Keyboard send( [ Boolean $bClearSequence = true ] )

This method is an alias of method ``run()``.

Confer to chapter **Method ``run())``**.



### Method ``delay()``

> Keyboard delay( [ Number $dDelayMs = 100 ] )

Each sequence recorded thanks to keyboard key methods
make a pause delay. 

The default delay set & used while the sequence is recorded is ``100ms``.

You can change delay value at anytime. The new delay is used for all next
recorded sequences until you change the value again.

Example : 
````js
Keyboard.ctrl('f').keys('MySearchWord').delay(1000).enter().left().run();
// Result :
// Press CTLR+F and wait 100ms
// Type MySearchWord and wait 100ms
// Set the delay to 1000ms (from this point, all next sequences will wait for 1000ms)
// Press Enter and wait 1000ms
// Press left and wait 1000ms
````



### Method ``wait()``

> Keyboard wait( [ Number $dDelayMs = 100 ] )

Do not mix up with method ``delay( )``.
Delay allow you to set for all sequence a delay while ``wait``
perform the delay action with the provided time in ms.

Example : 
````js
Keyboard.on(Aliases.sap.TCODE_LAUNCHER)
    .keys('WE19')
    .wait(2000)
    .run();
// Result :
// In SAP, in TCODE Launcher,
// Type WE19
// Wait 2000 ms (2s)
````



### Method ``refresh()``

> Keyboard refresh(  )

This method allows you to force the Name Mapping refresh using
``RefreshMappingInfo()``.
It's useful when element is regenerated implying the reference which no longer exist
even if identifier still identical.

**Important** : **Keyboard** automatically perform refresh before each action.
But it can be disabled globally and done manually with this method (``refresh``).

Example : 
````js
Keyboard.on(Aliases.browser.pageIndex.Login)
    .click()
    .refresh()
    .click()
    .run();
// Result :
// Click on the button 'Login'
// Action will reload the page
// Perform refresh on the last object set with .on() 
// Here : Aliases.browser.pageIndex.Login
````



### Method ``autorefresh()``

> Keyboard refresh( Number $nDelayMs, Boolean $bEnabled )

By default, **Keyboard** automatically perform refresh before each action.
But it can be disabled globally with this method and done manually with 
method (``refresh``).

**Important** : Refreshing Name Mapping has a side effect which is
the focus is reset to default position.
If you encounter focus issue, please disable automatic refresh.

Example : 
````js
Keyboard
    .autorefresh(0, false)
    .on(Aliases.browser.pageIndex.Login)
    .click()
    .refresh()
    .click()
    .run();
// Result :
// Disable autorefresh globally
// Click on the button 'Login'
// Action will reload the page
// Perform refresh on the last object set with .on() 
// Here : Aliases.browser.pageIndex.Login
````



### Method ``keysautoclear()``

> Keyboard keysautoclear( Number $nDelayMs, Boolean $bEnabled )

By default, **Keyboard** automatically perform `CTRL + A, Back Space`
to clear input field before typing text requested with the method `keys()`.

You can turn off the autoclear for input fields.

Example : 
````js
Keyboard
    .keysautoclear(false)
    .run();
// Result :
// Disable auto clear globally
````



### Method ``setFocus()``

> Keyboard setFocus(  )

This method is a SAP Specific (via Addon).
It allows use to get focus for any element in SAP Logon.

Example : 
````js
Keyboard
    .on(Aliases.sap.TCODE_LAUNCHER)
    .setFcous()
    .run();
// Result :
// Place cursor (blinking) in field TCODE (in SAP)
````



### Method ``function()``

> Keyboard function( Number $nDelayMs, Function $fFunction [, ...$args] )

You can call any function between two action registred with **Keyboard**.

Example : Instead of splitting you code in two part, simply use method ``function()`` :

````js
let LoadVariant_BySearch = require('LoadVariant_BySearch');

Keyboard.on(Aliases.sap.TCODE_LAUNCHER)
    .keys('ZME59N')
    .enter()
    .run();

LoadVariant_BySearch('Variant');

Keyboard.on(Aliases.sap.ZME59N.IN.PLANT_LOW)
    .keys('S014')
    .f8()
    .run()
````

Do as following (readbility increased) :

````js
let LoadVariant_BySearch = require('LoadVariant_BySearch');

Keyboard.on(Aliases.sap.TCODE_LAUNCHER)
    .keys('ZME59N')
    .enter()
    .function(0, LoadVariant_BySearch, 'Variant')
    .on(Aliases.sap.ZME59N.IN.PLANT_LOW)
    .keys('S014')
    .f8()
    .run()
````



### Method ``get()``

> Keyboard get( String $sProperty )

**Keyboard** do much more than expected for a keyboard interface, but features
are a huge help in TestComplete script writing.

**Keyboard** allows you to retrieve a **TestComplete** property.
By using the method ``get()``, you will take advantage of **autorefresh**
and the speed of the capability to retrieve Web Element very quickly using
micro interval.

Prefer 

````js
let sText = Keyboard.on(Aliases.sap.ME22N.HEADER.ORGA_DATA.COMPANY_CODE).get('Text');
````

as 

````js
let sText = Aliases.sap.ME22N.HEADER.ORGA_DATA.COMPANY_CODE.Text;
````






## Cheat Sheet ``Keyboard``

> **Version** : v0.6.0


### Top of Methods


#### Method ``on()``

> Keyboard on( Object $oTestCompleteAlias )

This method store the TestComplete object which will received keys sequences
recorded in its own method ``Keys()``.

It can be set at anytime, before the call of method ``run()`` (Alias `send()`);



#### Method ``keys()``

> Keyboard keys( String $sKeys, [ Number $nDelayMs] )

The ``Keyboard`` method `keys()` works like the TestComplete standard one and
accept any sequence which respect the following documentation :
[Keys Method](https://support.smartbear.com/testcomplete/docs/reference/test-objects/members/common-for-sys-desktop-pda/keys-method-sys-desktop-object.html)


````js
Keyboard.keys('[HOLD]^f[Release]MySearchWord').run();
// Will produce the same result as :
Keyboard.ctrl('f').keys('MySearchWord').run();
````

You can passe in extra parameter the delay you want to apply
only for this sequence by filling ``$nDelayMs`` where the delay 
is in milliseconds.



#### method ``run()``

> Keyboard run( [ Boolean $bClearSequence = true ] )

This method call method ``Keys()`` of the provided **TestComplete**
object set by ``on()``.
If object is not defined or if it does not have method ``Keys()``,
an error is logged with ``Error`` level and returns `false` .

As method ``run()`` return `Keyboard` interface, you can :

- Re-execute the sequence if ``run()`` has been call with flag
`$bClearSequence = false` and or append new sequences.
- Record a new sequence and execute it




#### method ``send()``

> Keyboard send( [ Boolean $bClearSequence = true ] )

This method is an alias of method ``run()``.

Confer to chapter **Method ``run())``**.



#### Method ``delay()``

> Keyboard delay( [ Number $dDelayMs = 100 ] )

Each sequence recorded thanks to keyboard key methods
make a pause delay. 

The default delay set & used while the sequence is recorded is ``100ms``.

You can change delay value at anytime. The new delay is used for all next
recorded sequences until you change the value again.

Example : 
````js
Keyboard.ctrl('f').keys('MySearchWord').delay(1000).enter().left().run();
// Result :
// Press CTLR+F and wait 100ms
// Type MySearchWord and wait 100ms
// Set the delay to 1000ms (from this point, all next sequences will wait for 1000ms)
// Press Enter and wait 1000ms
// Press left and wait 1000ms
````



#### Method ``wait()``

> Keyboard wait( [ Number $dDelayMs = 100 ] )

Do not mix up with method ``delay( )``.
Delay allow you to set for all sequence a delay while ``wait``
perform the delay action with the provided time in ms.

Example : 
````js
Keyboard.on(Aliases.sap.TCODE_LAUNCHER)
    .keys('WE19')
    .wait(2000)
    .run();
// Result :
// In SAP, in TCODE Launcher,
// Type WE19
// Wait 2000 ms (2s)
````



#### Method ``refresh()``

> Keyboard refresh(  )

This method allows you to force the Name Mapping refresh using
``RefreshMappingInfo()``.
It's useful when element is regenerated implying the reference which no longer exist
even if identifier still identical.

**Important** : **Keyboard** automatically perform refresh before each action.
But it can be disabled globally and done manually with this method (``refresh``).

Example : 
````js
Keyboard.on(Aliases.browser.pageIndex.Login)
    .click()
    .refresh()
    .click()
    .run();
// Result :
// Click on the button 'Login'
// Action will reload the page
// Perform refresh on the last object set with .on() 
// Here : Aliases.browser.pageIndex.Login
````



#### Method ``autorefresh()``

> Keyboard refresh( Number $nDelayMs, Boolean $bEnabled )

By default, **Keyboard** automatically perform refresh before each action.
But it can be disabled globally with this method and done manually with 
method (``refresh``).

**Important** : Refreshing Name Mapping has a side effect which is
the focus is reset to default position.
If you encounter focus issue, please disable automatic refresh.

Example : 
````js
Keyboard
    .autorefresh(0, false)
    .on(Aliases.browser.pageIndex.Login)
    .click()
    .refresh()
    .click()
    .run();
// Result :
// Disable autorefresh globally
// Click on the button 'Login'
// Action will reload the page
// Perform refresh on the last object set with .on() 
// Here : Aliases.browser.pageIndex.Login
````



#### Method ``keysautoclear()``

> Keyboard keysautoclear( Number $nDelayMs, Boolean $bEnabled )

By default, **Keyboard** automatically perform `CTRL + A, Back Space`
to clear input field before typing text requested with the method `keys()`.

You can turn off the autoclear for input fields.

Example : 
````js
Keyboard
    .keysautoclear(false)
    .run();
// Result :
// Disable auto clear globally
````



#### Method ``setFocus()``

> Keyboard setFocus(  )

This method is a SAP Specific (via Addon).
It allows use to get focus for any element in SAP Logon.

Example : 
````js
Keyboard
    .on(Aliases.sap.TCODE_LAUNCHER)
    .setFcous()
    .run();
// Result :
// Place cursor (blinking) in field TCODE (in SAP)
````



#### Method ``function()``

> Keyboard function( Number $nDelayMs, Function $fFunction [, ...$args] )

You can call any function between two action registred with **Keyboard**.

Example : Instead of splitting you code in two part, simply use method ``function()`` :

````js
let LoadVariant_BySearch = require('LoadVariant_BySearch');

Keyboard.on(Aliases.sap.TCODE_LAUNCHER)
    .keys('ZME59N')
    .enter()
    .run();

LoadVariant_BySearch('Variant');

Keyboard.on(Aliases.sap.ZME59N.IN.PLANT_LOW)
    .keys('S014')
    .f8()
    .run()
````

Do as following (readbility increased) :

````js
let LoadVariant_BySearch = require('LoadVariant_BySearch');

Keyboard.on(Aliases.sap.TCODE_LAUNCHER)
    .keys('ZME59N')
    .enter()
    .function(0, LoadVariant_BySearch, 'Variant')
    .on(Aliases.sap.ZME59N.IN.PLANT_LOW)
    .keys('S014')
    .f8()
    .run()
````



#### Method ``get()``

> Keyboard get( String $sProperty )

**Keyboard** do much more than expected for a keyboard interface, but features
are a huge help in TestComplete script writing.

**Keyboard** allows you to retrieve a **TestComplete** property.
By using the method ``get()``, you will take advantage of **autorefresh**
and the speed of the capability to retrieve Web Element very quickly using
micro interval.

Prefer 

````js
let sText = Keyboard.on(Aliases.sap.ME22N.HEADER.ORGA_DATA.COMPANY_CODE).get('Text');
````

as 

````js
let sText = Aliases.sap.ME22N.HEADER.ORGA_DATA.COMPANY_CODE.Text;
````






## List of all methods

Keyboard <method>( [ String $sKey, [ Number $nDelayMs ] ] | [ Number $nDelayMs ]

* ``Keyboard ctrl( [ String $sKey [,  Number $nDelayMs ] ] )`` : 
* ``Keyboard shift( [ String $sKey [,  Number $nDelayMs ] ] )`` : 
* ``Keyboard alt( [ String $sKey [,  Number $nDelayMs ] ] )`` : 
* ``Keyboard appsKey( [ Number $nDelayMs ] )`` : 
* ``Keyboard bs( [ Number $nDelayMs ] )`` : 
* ``Keyboard backspace( [ Number $nDelayMs ] )`` : 
* ``Keyboard caps( [ Number $nDelayMs ] )`` : 
* ``Keyboard clear( [ Number $nDelayMs ] )`` : 
* ``Keyboard del( [ Number $nDelayMs ] )`` : 
* ``Keyboard delete( [ Number $nDelayMs ] )`` : 
* ``Keyboard down( [ Number $nDelayMs ] )`` : 
* ``Keyboard end( [ Number $nDelayMs ] )`` : 
* ``Keyboard enter( [ Number $nDelayMs ] )`` : 
* ``Keyboard esc( [ Number $nDelayMs ] )`` : 
* ``Keyboard escape( [ Number $nDelayMs ] )`` : 
* ``Keyboard home( [ Number $nDelayMs ] )`` : 
* ``Keyboard ins( [ Number $nDelayMs ] )`` : 
* ``Keyboard insert( [ Number $nDelayMs ] )`` : 
* ``Keyboard left( [ Number $nDelayMs ] )`` : 
* ``Keyboard right( [ Number $nDelayMs ] )`` : 
* ``Keyboard up( [ Number $nDelayMs ] )`` : 
* ``Keyboard tab( [ Number $nDelayMs ] )`` : 
* ``Keyboard win( [ Number $nDelayMs ] )`` : 
* ``Keyboard pause( [ Number $nDelayMs ] )`` : 
* ``Keyboard pageUp( [ Number $nDelayMs ] )`` : 
* ``Keyboard pageDown( [ Number $nDelayMs ] )`` : 
* ``Keyboard prtsc( [ Number $nDelayMs ] )`` : 
* ``Keyboard print( [ Number $nDelayMs ] )`` : 
* ``Keyboard printScreen( [ Number $nDelayMs ] )`` : 
* ``Keyboard scrollLock( [ Number $nDelayMs ] )`` : 
* ``Keyboard sl( [ Number $nDelayMs ] )`` : 
* ``Keyboard slock( [ Number $nDelayMs ] )`` : 
* ``Keyboard numPlus( [ Number $nDelayMs ] )`` : 
* ``Keyboard nump( [ Number $nDelayMs ] )`` : 
* ``Keyboard numMinus( [ Number $nDelayMs ] )`` : 
* ``Keyboard numm( [ Number $nDelayMs ] )`` : 
* ``Keyboard numLock( [ Number $nDelayMs ] )`` : 
* ``Keyboard numl( [ Number $nDelayMs ] )`` : 
* ``Keyboard numAsterisk( [ Number $nDelayMs ] )`` : 
* ``Keyboard numa( [ Number $nDelayMs ] )`` : 
* ``Keyboard numSlash( [ Number $nDelayMs ] )`` : 
* ``Keyboard nums( [ Number $nDelayMs ] )`` : 
* ``Keyboard space( [ Number $nDelayMs ] )`` : 
* ``Keyboard F1( [ Number $nDelayMs ] )`` : 
* ``Keyboard F2( [ Number $nDelayMs ] )`` : 
* ``Keyboard F4( [ Number $nDelayMs ] )`` : 
* ``Keyboard F6( [ Number $nDelayMs ] )`` : 
* ``Keyboard F8( [ Number $nDelayMs ] )`` : 
* ``Keyboard F10( [ Number $nDelayMs ] )`` : 
* ``Keyboard F12( [ Number $nDelayMs ] )`` : 
* ``Keyboard f2( [ Number $nDelayMs ] )`` : 
* ``Keyboard f4( [ Number $nDelayMs ] )`` : 
* ``Keyboard f6( [ Number $nDelayMs ] )`` : 
* ``Keyboard f8( [ Number $nDelayMs ] )`` : 
* ``Keyboard f10( [ Number $nDelayMs ] )`` : 
* ``Keyboard f12( [ Number $nDelayMs ] )`` : 
* ``Keyboard F3( [ Number $nDelayMs ] )`` : 
* ``Keyboard F5( [ Number $nDelayMs ] )`` : 
* ``Keyboard F7( [ Number $nDelayMs ] )`` : 
* ``Keyboard F9( [ Number $nDelayMs ] )`` : 
* ``Keyboard F11( [ Number $nDelayMs ] )`` : 
* ``Keyboard f1( [ Number $nDelayMs ] )`` : 
* ``Keyboard f3( [ Number $nDelayMs ] )`` : 
* ``Keyboard f5( [ Number $nDelayMs ] )`` : 
* ``Keyboard f7( [ Number $nDelayMs ] )`` : 
* ``Keyboard f9( [ Number $nDelayMs ] )`` : 
* ``Keyboard f11( [ Number $nDelayMs ] )`` : 
* ``Keyboard keys( [ String $sKey [,  Number $nDelayMs ] ] )`` : 
* ``Keyboard click( )`` : 
* ``Keyboard clickM( )`` : 
* ``Keyboard clickR( )`` : 
* ``Keyboard dblClick( )`` : 
* ``Keyboard dblClickM( )`` : 
* ``Keyboard dblClickR( )`` : 
* ``Keyboard drag( )`` : 
* ``Keyboard dragM( )`` : 
* ``Keyboard dragR( )`` : 
* ``Keyboard hoverMouse( )`` : 
* ``Keyboard mouseWheel( )`` : 
* ``Keyboard press( )`` : 
* ``Keyboard setFocus( )`` : 
* ``Keyboard wait( Number $nDelayMs )`` : 
* ``Keyboard refresh( )`` : 
* ``Keyboard autorefresh( Number $nDelayMs, Boolean $bEnabled )`` : 
* ``Keyboard function( Number $nDelayMs, Function $fFunction [, ...$aA : rgs] )``
* ``Keyboard on( Object $oTestCompleteAlias )`` : 
* ``Keyboard delay( [ Number $nDelayMs = 100 ] )`` : 
* ``Keyboard send( [ Boolean $bClearSequence = true ] )`` : 
* ``Keyboard run( [ Boolean $bClearSequence = true ] )`` : 
* ``Keyboard timeout( [ Number $nTimeoutMs = 30000 ] )`` : 
* ``Keyboard interval( [ Number $nIntervalMs = 250] )`` : 
* ``Keyboard get( String $sProperty [, Object $oObject] )`` : 
* ``Keyboard keyautoclear( [ Boolean $bEnabled = false] )`` : 


All here before methods mentioned can be called from loaded ``Keyboard`` interface
with following statement :

````js
const Keyboard = require('Keyboard');

let kb = Keyboard.on(Aliases.sap.MAIN).ctrl('f').enter().escape().right();
````

**Important** : Action will be perform on the last **TestComplete** object
set with method ``on()``.

All methods have a last optional argument ``$nDelayMs`` to set the
delay time to wait at the end of the sequence. It's concerns only the 
sequence which is currently registering.

````js
// For Method accepting key :
Keyboard.ctrl('f', 1000);   // Press CTRL+F & Wait 1000ms

// For Method which stand for direct intput
Keyboard.enter(2000);       // Press Enter & Wait 2000ms
````

From this point, you can run sequence thanks to method ``run()`` (Alias `send()`);