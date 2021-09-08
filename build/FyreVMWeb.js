var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
/*
 * TypeScript port by Thilo Planz
 *
 * https://gist.github.com/thiloplanz/6abf04f957197e9e3912
 */
/*
  I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
  so it's better encapsulated. Now you can have multiple random number generators
  and they won't stomp all over eachother's state.
  
  If you want to use this as a substitute for Math.random(), use the random()
  method like so:
  
  var m = new MersenneTwister();
  var randomNumber = m.random();
  
  You can also call the other genrand_{foo}() methods on the instance.

  If you want to use a specific seed in order to get a repeatable random
  sequence, pass an integer into the constructor:

  var m = new MersenneTwister(123);

  and that will always produce the same random sequence.

  Sean McCullough (banksean@gmail.com)
*/
/*
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.
 
   Before using, initialize the state by using init_genrand(seed)
   or init_by_array(init_key, key_length).
 
   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.
 
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:
 
     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
 
     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
 
     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.
 
   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 
 
   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/
var MersenneTwister = /** @class */ (function () {
    function MersenneTwister(seed) {
        /* Period parameters */
        this.N = 624;
        this.M = 397;
        this.MATRIX_A = 0x9908b0df; /* constant vector a */
        this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
        this.LOWER_MASK = 0x7fffffff; /* least significant r bits */
        this.mt = new Array(this.N); /* the array for the state vector */
        this.mti = this.N + 1; /* mti==N+1 means mt[N] is not initialized */
        if (seed == undefined) {
            seed = new Date().getTime();
        }
        this.init_genrand(seed);
    }
    /* initializes mt[N] with a seed */
    MersenneTwister.prototype.init_genrand = function (s) {
        this.mt[0] = s >>> 0;
        for (this.mti = 1; this.mti < this.N; this.mti++) {
            s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
                + this.mti;
            /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
            /* In the previous versions, MSBs of the seed affect   */
            /* only MSBs of the array mt[].                        */
            /* 2002/01/09 modified by Makoto Matsumoto             */
            this.mt[this.mti] >>>= 0;
            /* for >32 bit machines */
        }
    };
    /* initialize by an array with array-length */
    /* init_key is the array for initializing keys */
    /* key_length is its length */
    /* slight change for C++, 2004/2/26 */
    MersenneTwister.prototype.init_by_array = function (init_key, key_length) {
        var i, j, k;
        this.init_genrand(19650218);
        i = 1;
        j = 0;
        k = (this.N > key_length ? this.N : key_length);
        for (; k; k--) {
            var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
                + init_key[j] + j; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            j++;
            if (i >= this.N) {
                this.mt[0] = this.mt[this.N - 1];
                i = 1;
            }
            if (j >= key_length)
                j = 0;
        }
        for (k = this.N - 1; k; k--) {
            var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
                - i; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            if (i >= this.N) {
                this.mt[0] = this.mt[this.N - 1];
                i = 1;
            }
        }
        this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
    };
    /* generates a random number on [0,0xffffffff]-interval */
    MersenneTwister.prototype.genrand_int32 = function () {
        var y;
        var mag01 = new Array(0x0, this.MATRIX_A);
        /* mag01[x] = x * MATRIX_A  for x=0,1 */
        if (this.mti >= this.N) { /* generate N words at one time */
            var kk;
            if (this.mti == this.N + 1) /* if init_genrand() has not been called, */
                this.init_genrand(5489); /* a default initial seed is used */
            for (kk = 0; kk < this.N - this.M; kk++) {
                y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            for (; kk < this.N - 1; kk++) {
                y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
            this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
            this.mti = 0;
        }
        y = this.mt[this.mti++];
        /* Tempering */
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);
        return y >>> 0;
    };
    /* generates a random number on [0,0x7fffffff]-interval */
    MersenneTwister.prototype.genrand_int31 = function () {
        return (this.genrand_int32() >>> 1);
    };
    /* generates a random number on [0,1]-real-interval */
    MersenneTwister.prototype.genrand_real1 = function () {
        return this.genrand_int32() * (1.0 / 4294967295.0);
        /* divided by 2^32-1 */
    };
    /* generates a random number on [0,1)-real-interval */
    MersenneTwister.prototype.random = function () {
        return this.genrand_int32() * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    };
    /* generates a random number on (0,1)-real-interval */
    MersenneTwister.prototype.genrand_real3 = function () {
        return (this.genrand_int32() + 0.5) * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    };
    /* generates a random number on [0,1) with 53-bit resolution*/
    MersenneTwister.prototype.genrand_res53 = function () {
        var a = this.genrand_int32() >>> 5, b = this.genrand_int32() >>> 6;
        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    };
    return MersenneTwister;
}());
// Written in 2015 by Thilo Planz 
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
/**
 * A wrapper to emulate minimal Glk functionality.
 */
/// <reference path='Engine.ts' />
var FyreVM;
// Written in 2015 by Thilo Planz 
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
/**
 * A wrapper to emulate minimal Glk functionality.
 */
/// <reference path='Engine.ts' />
(function (FyreVM) {
    var GlkWindowStream = /** @class */ (function () {
        function GlkWindowStream(id, engine) {
            this.id = id;
            this.engine = engine;
        }
        GlkWindowStream.prototype.getId = function () {
            return this.id;
        };
        GlkWindowStream.prototype.put = function (s) {
            this.engine['outputBuffer'].write(s);
        };
        GlkWindowStream.prototype.close = function () {
            return { ok: false, written: 0, read: 0 };
        };
        return GlkWindowStream;
    }());
    function GlkWrapperCall(code, argc) {
        if (!this.glkHandlers) {
            this.glkHandlers = initGlkHandlers();
            this.glkStreams = [];
        }
        if (argc > 8) {
            throw new Error("Too many stack arguments for glk call " + code + ": " + argc);
        }
        var glkArgs = [];
        while (argc--) {
            glkArgs.push(this.pop());
        }
        var handler = this.glkHandlers[code];
        if (handler) {
            return handler.apply(this, glkArgs);
        }
        else {
            console.error("unimplemented glk call " + code);
            return 0;
        }
    }
    FyreVM.GlkWrapperCall = GlkWrapperCall;
    function GlkWrapperWrite(s) {
        if (this.glkCurrentStream) {
            this.glkCurrentStream.put(s);
        }
    }
    FyreVM.GlkWrapperWrite = GlkWrapperWrite;
    function stub() { return 0; }
    ;
    function initGlkHandlers() {
        var handlers = [];
        // glk_stream_iterate
        handlers[0x40] = stub;
        // glk_window_iterate
        handlers[0x20] = function (win_id) {
            if (this.glkWindowOpen && win_id === 0)
                return 1;
            return 0;
        };
        // glk_fileref_iterate 
        handlers[0x64] = stub;
        // glk_window_open
        handlers[0x23] = function () {
            if (this.glkWindowOpen)
                return 0;
            this.glkWindowOpen = true;
            this.glkStreams[1] = new GlkWindowStream(1, this);
            return 1;
        };
        // glk_set_window
        handlers[0x2F] = function () {
            if (this.glkWindowOpen) {
                this.glkCurrentStream = this.glkStreams[1];
            }
            return 0;
        };
        // glk_set_style
        handlers[0x86] = stub;
        //glk_stylehint_set 
        handlers[0xB0] = stub;
        // glk_style_distinguish
        handlers[0xB2] = stub;
        // glk_style_measure
        handlers[0xB3] = stub;
        // glk_char_to_lower
        handlers[0xA0] = function (ch) {
            return String.fromCharCode(ch).toLowerCase().charCodeAt(0);
        };
        // glk_char_to_upper
        handlers[0xA1] = function (ch) {
            return String.fromCharCode(ch).toUpperCase().charCodeAt(0);
        };
        // glk_request_line_event
        handlers[0xD0] = function (winId, buffer, bufferSize) {
            this.glkWantLineInput = true;
            this.glkLineInputBufSize = bufferSize;
            this.glkLineInputBuffer = buffer;
        };
        // glk_request_char_event
        handlers[0xD2] = function () {
            this.glkWantCharInput = true;
        };
        // glk_put_char
        handlers[0x80] = function (c) {
            GlkWrapperWrite.call(this, String.fromCharCode(c));
        };
        // glk_select 
        handlers[0xC0] = function (reference) {
            this.deliverOutput();
            if (this.glkWantLineInput) {
                this.glkWantLineInput = false;
                if (!this.lineWanted) {
                    GlkWriteReference.call(this, reference, 3 /* evtype_LineInput */, 1, 1, 0);
                    return 0;
                }
                var callback = function (line) {
                    if (line === void 0) { line = ''; }
                    var max = this.image.writeASCII(this.glkLineInputBuffer, line, this.glkLineInputBufSize);
                    GlkWriteReference.call(this, reference, 3 /* evtype_LineInput */, 1, max, 0);
                    this.resumeAfterWait([0]);
                };
                this.lineWanted(callback.bind(this));
                return 'wait';
            }
            else if (this.glkWantCharInput) {
                this.glkWantCharInput = false;
                if (!this.keyWanted) {
                    GlkWriteReference.call(this, reference, 2 /* evtype_CharInput */, 1, 0, 0);
                    return 0;
                }
                var callback = function (line) {
                    GlkWriteReference.call(this, reference, 2 /* evtype_CharInput */, 1, line.charCodeAt(0), 0);
                    this.resumeAfterWait([0]);
                };
                this.lineWanted(callback.bind(this));
                return 'wait';
            }
            else {
                // no event
                GlkWriteReference.call(this, reference, 0 /* evtype_None */, 0, 0, 0);
            }
            return 0;
        };
        return handlers;
    }
    function GlkWriteReference(reference) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        if (reference == 0xffffffff) {
            for (var i = 0; i < values.length; i++)
                this.push(values[i]);
        }
        else {
            for (var i = 0; i < values.length; i++) {
                this.image.writeInt32(reference, values[i]);
                reference += 4;
            }
        }
    }
})(FyreVM || (FyreVM = {}));
// Written from 2015 to 2016 by Thilo Planz and Andrew Plotkin
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
/**
 * Provides hardcoded versions of some commonly used veneer routines (low-level
 *  functions that are automatically compiled into every Inform game).
 * Inform games rely heavily on these routines, and substituting our "native" versions
 * for the Glulx versions in the story file can increase performance significantly.
 */
/// <reference path='Engine.ts' />
var FyreVM;
// Written from 2015 to 2016 by Thilo Planz and Andrew Plotkin
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
/**
 * Provides hardcoded versions of some commonly used veneer routines (low-level
 *  functions that are automatically compiled into every Inform game).
 * Inform games rely heavily on these routines, and substituting our "native" versions
 * for the Glulx versions in the story file can increase performance significantly.
 */
/// <reference path='Engine.ts' />
(function (FyreVM) {
    // RAM addresses of compiler-generated global variables
    var SELF_OFFSET = 16;
    var SENDER_OFFSET = 20;
    // offsets of compiler-generated property numbers from INDIV_PROP_START
    var CALL_PROP = 5;
    var PRINT_PROP = 6;
    var PRINT_TO_ARRAY_PROP = 7;
    /**
     * Registers a routine address or constant value, using the acceleration
     * codes defined in the Glulx specification.
     */
    function setSlotGlulx(isParam, slot, value) {
        if (isParam && slot === 6) {
            var image = this.image;
            if (value != image.getRamAddress(SELF_OFFSET)) {
                throw new Error("Unexpected value for acceleration parameter 6");
            }
            return true;
        }
        if (isParam) {
            switch (slot) {
                case 0: return setSlotFyre.call(this, 1007 /* classes_table */, value);
                case 1: return setSlotFyre.call(this, 1008 /* INDIV_PROP_START */, value);
                case 2: return setSlotFyre.call(this, 1003 /* Class */, value);
                case 3: return setSlotFyre.call(this, 1004 /* Object */, value);
                case 4: return setSlotFyre.call(this, 1002 /* Routine */, value);
                case 5: return setSlotFyre.call(this, 1001 /* String */, value);
                case 7: return setSlotFyre.call(this, 1006 /* NUM_ATTR_BYTES */, value);
                case 8: return setSlotFyre.call(this, 1009 /* cpv__start */, value);
                default: return false;
            }
        }
        switch (slot) {
            case 1: return setSlotFyre.call(this, 1 /* Z__Region */, value);
            case 2: return setSlotFyre.call(this, 2 /* CP__Tab */, value);
            case 3: return setSlotFyre.call(this, 4 /* RA__Pr */, value);
            case 4: return setSlotFyre.call(this, 7 /* RL__Pr */, value);
            case 5: return setSlotFyre.call(this, 3 /* OC__Cl */, value);
            case 6: return setSlotFyre.call(this, 8 /* RV__Pr */, value);
            case 7: return setSlotFyre.call(this, 9 /* OP__Pr */, value);
            default: return false;
        }
    }
    FyreVM.setSlotGlulx = setSlotGlulx;
    /**
     *  Registers a routine address or constant value, using the traditional
     *  FyreVM slot codes.
     */
    function setSlotFyre(slot, value) {
        var v = this.veneer;
        switch (slot) {
            case 1 /* Z__Region */:
                this.veneer[value] = Z__Region;
                return true;
            case 2 /* CP__Tab */:
                this.veneer[value] = CP__Tab;
                return true;
            case 3 /* OC__Cl */:
                this.veneer[value] = OC__Cl;
                return true;
            case 4 /* RA__Pr */:
                this.veneer[value] = RA__Pr;
                return true;
            case 5 /* RT__ChLDW */:
                this.veneer[value] = RT__ChLDW;
                return true;
            case 6 /* Unsigned__Compare */:
                this.veneer[value] = Unsigned__Compare;
                return true;
            case 7 /* RL__Pr */:
                this.veneer[value] = RL__Pr;
                return true;
            case 8 /* RV__Pr */:
                this.veneer[value] = RV__Pr;
                return true;
            case 9 /* OP__Pr */:
                this.veneer[value] = OP__Pr;
                return true;
            case 10 /* RT__ChSTW */:
                this.veneer[value] = RT__ChSTW;
                return true;
            case 11 /* RT__ChLDB */:
                this.veneer[value] = RT__ChLDB;
                return true;
            case 12 /* Meta__class */:
                this.veneer[value] = Meta__class;
                return true;
            case 1001 /* String */:
                v.string_mc = value;
                return true;
            case 1002 /* Routine */:
                v.routine_mc = value;
                return true;
            case 1003 /* Class */:
                v.class_mc = value;
                return true;
            case 1004 /* Object */:
                v.object_mc = value;
                return true;
            case 1006 /* NUM_ATTR_BYTES */:
                v.num_attr_bytes = value;
                return true;
            case 1007 /* classes_table */:
                v.classes_table = value;
                return true;
            case 1008 /* INDIV_PROP_START */:
                v.indiv_prop_start = value;
                return true;
            case 1009 /* cpv__start */:
                v.cpv_start = value;
                return true;
            // run-time error handlers are just ignored (we log an error message instead, like Quixe does, no NestedCall a la FyreVM)
            case 1005 /* RT__Err */:
            case 1010 /* ofclass_err */:
            case 1011 /* readprop_err */:
                return true;
            default:
                console.warn("ignoring veneer " + slot + " " + value);
                return false;
        }
    }
    FyreVM.setSlotFyre = setSlotFyre;
    function Unsigned__Compare(a, b) {
        a = a >>> 0;
        b = b >>> 0;
        if (a > b)
            return 1;
        if (a < b)
            return -1;
        return 0;
    }
    // distinguishes between strings, routines, and objects
    function Z__Region(address) {
        var image = this.image;
        if (address < 36 || address >= image.getEndMem())
            return 0;
        var type = image.readByte(address);
        if (type >= 0xE0)
            return 3;
        if (type >= 0xC0)
            return 2;
        if (type >= 0x70 && type <= 0x7F && address >= image.getRamAddress(0))
            return 1;
        return 0;
    }
    // finds an object's common property table
    function CP__Tab(obj, id) {
        if (Z__Region.call(this, obj) != 1) {
            // error "handling" inspired by Quixe
            // instead of doing a NestedCall to the supplied error handler
            // just log an error message
            console.error("[** Programming error: tried to find the \".\" of (something) **]");
            return 0;
        }
        var image = this.image;
        var otab = image.readInt32(obj + 16);
        if (otab == 0)
            return 0;
        var max = image.readInt32(otab);
        otab += 4;
        // PerformBinarySearch
        return this.opcodes[0x151].handler.call(this, id, 2, otab, 10, max, 0, 0);
    }
    // finds the location of an object ("parent()" function)
    function Parent(obj) {
        return this.image.readInt32(obj + 1 + this.veneer.num_attr_bytes + 12);
    }
    // determines whether an object is a member of a given class ("ofclass" operator)
    function OC__Cl(obj, cla) {
        var v = this.veneer;
        switch (Z__Region.call(this, obj)) {
            case 3:
                return (cla === v.string_mc ? 1 : 0);
            case 2:
                return (cla === v.routine_mc ? 1 : 0);
            case 1:
                if (cla === v.class_mc) {
                    if (Parent.call(this, obj) === v.class_mc)
                        return 1;
                    if (obj === v.class_mc || obj === v.string_mc ||
                        obj === v.routine_mc || obj === v.object_mc)
                        return 1;
                    return 0;
                }
                if (cla == this.veneer.object_mc) {
                    if (Parent.call(this, obj) == v.class_mc)
                        return 0;
                    if (obj == v.class_mc || obj == v.string_mc ||
                        obj == v.routine_mc || obj == v.object_mc)
                        return 0;
                    return 1;
                }
                if (cla == v.string_mc || cla == v.routine_mc)
                    return 0;
                if (Parent.call(this, cla) != v.class_mc) {
                    console.error("[** Programming error: tried to apply 'ofclass' with non-class **]");
                    return 0;
                }
                var image = this.image;
                var inlist = RA__Pr.call(this, obj, 2);
                if (inlist == 0)
                    return 0;
                var inlistlen = RL__Pr.call(this, obj, 2) / 4;
                for (var jx = 0; jx < inlistlen; jx++)
                    if (image.readInt32(inlist + jx * 4) === cla)
                        return 1;
                return 0;
            default:
                return 0;
        }
    }
    // finds the address of an object's property (".&" operator)
    function RA__Pr(obj, id) {
        var cla = 0;
        var image = this.image;
        if ((id & 0xFFFF0000) != 0) {
            cla = image.readInt32(this.veneer.classes_table + 4 * (id & 0xFFFF));
            if (OC__Cl.call(this, obj, cla) == 0)
                return 0;
            id >>= 16;
            obj = cla;
        }
        var prop = CP__Tab.call(this, obj, id);
        if (prop == 0)
            return 0;
        if (Parent.call(this, obj) === this.veneer.class_mc && cla == 0)
            if (id < this.veneer.indiv_prop_start || id >= this.veneer.indiv_prop_start + 8)
                return 0;
        if (image.readInt32(image.getRamAddress(SELF_OFFSET)) != obj) {
            var ix = (image.readByte(prop + 9) & 1);
            if (ix != 0)
                return 0;
        }
        return image.readInt32(prop + 4);
    }
    // finds the length of an object's property (".#" operator)
    function RL__Pr(obj, id) {
        var cla = 0;
        var image = this.image;
        if ((id & 0xFFFF0000) != 0) {
            cla = image.readInt32(this.veneer.classes_table + 4 * (id & 0xFFFF));
            if (OC__Cl.call(this, obj, cla) == 0)
                return 0;
            id >>= 16;
            obj = cla;
        }
        var prop = CP__Tab.call(this, obj, id);
        if (prop == 0)
            return 0;
        if (Parent.call(this, obj) == this.veneer.class_mc && cla == 0)
            if (id < this.veneer.indiv_prop_start || id >= this.veneer.indiv_prop_start + 8)
                return 0;
        if (image.readInt32(image.getRamAddress(SELF_OFFSET)) != obj) {
            var ix = (image.readByte(prop + 9) & 1);
            if (ix != 0)
                return 0;
        }
        return 4 * image.readInt16(prop + 2);
    }
    // performs bounds checking when reading from a word array ("-->" operator)
    function RT__ChLDW(array, offset) {
        var address = array + 4 * offset;
        var image = this.image;
        if (address >= image.getEndMem()) {
            console.error("[** Programming error: tried to read from word array beyond EndMem **]");
            return 0;
        }
        return image.readInt32(address);
    }
    // reads the value of an object's property ("." operator)
    function RV__Pr(obj, id) {
        var addr = RA__Pr.call(this, obj, id);
        var image = this.image;
        if (addr == 0) {
            var v = this.veneer;
            if (id > 0 && id < v.indiv_prop_start)
                return image.readInt32(v.cpv_start + 4 * id);
            console.error("[** Programming error: tried to read (something) **]");
            return 0;
        }
        return image.readInt32(addr);
    }
    // determines whether an object provides a given property ("provides" operator)
    function OP__Pr(obj, id) {
        var v = this.veneer;
        switch (Z__Region.call(this, obj)) {
            case 3:
                if (id == v.indiv_prop_start + PRINT_PROP ||
                    id == v.indiv_prop_start + PRINT_TO_ARRAY_PROP)
                    return 1;
                else
                    return 0;
            case 2:
                if (id == v.indiv_prop_start + CALL_PROP)
                    return 1;
                else
                    return 0;
            case 1:
                if (id >= v.indiv_prop_start && id < v.indiv_prop_start + 8)
                    if (Parent.call(this, obj) == v.class_mc)
                        return 1;
                if (RA__Pr.call(this, obj, id) != 0)
                    return 1;
                else
                    return 0;
            default:
                return 0;
        }
    }
    // performs bounds checking when writing to a word array ("-->" operator)
    function RT__ChSTW(array, offset, val) {
        var image = this.image;
        var address = array + 4 * offset;
        if (address >= image.getEndMem() || address < image.getRamAddress(0)) {
            console.error("[** Programming error: tried to write to word array outside of RAM **]");
            return 0;
        }
        else {
            image.writeInt32(address, val);
            return 0;
        }
    }
    // performs bounds checking when reading from a byte array ("->" operator)
    function RT__ChLDB(array, offset) {
        var address = array + offset;
        var image = this.image;
        if (address >= image.getEndMem()) {
            console.error("[** Programming error: tried to read from byte array beyond EndMem **]");
            return 0;
        }
        return image.readByte(address);
    }
    // determines the metaclass of a routine, string, or object ("metaclass()" function)
    function Meta__class(obj) {
        switch (Z__Region.call(this, obj)) {
            case 2:
                return this.veneer.routine_mc;
            case 3:
                return this.veneer.string_mc;
            case 1:
                if (Parent.call(this, obj) === this.veneer.class_mc)
                    return this.veneer.class_mc;
                if (obj == this.veneer.class_mc || obj == this.veneer.string_mc ||
                    obj == this.veneer.routine_mc || obj == this.veneer.object_mc)
                    return this.veneer.class_mc;
                return this.veneer.object_mc;
            default:
                return 0;
        }
    }
})(FyreVM || (FyreVM = {}));
// Written in 2015 by Thilo Planz and Andrew Plotkin
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
/// <reference path='../mersenne-twister.ts' />
/// <reference path='GlkWrapper.ts' />
/// <reference path='Veneer.ts' />
var FyreVM;
// Written in 2015 by Thilo Planz and Andrew Plotkin
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
/// <reference path='../mersenne-twister.ts' />
/// <reference path='GlkWrapper.ts' />
/// <reference path='Veneer.ts' />
(function (FyreVM) {
    var Opcode = /** @class */ (function () {
        function Opcode(code, name, loadArgs, storeArgs, handler, rule) {
            this.code = code;
            this.name = name;
            this.loadArgs = loadArgs;
            this.storeArgs = storeArgs;
            this.handler = handler;
            this.rule = rule;
        }
        return Opcode;
    }());
    FyreVM.Opcode = Opcode;
    // coerce Javascript number into uint32 range
    function uint32(x) {
        return x >>> 0;
    }
    // coerce uint32 number into  (signed!) int32 range
    function int32(x) {
        return x | 0;
    }
    var Opcodes;
    (function (Opcodes) {
        function initOpcodes() {
            var opcodes = [];
            function opcode(code, name, loadArgs, storeArgs, handler, rule) {
                opcodes[code] = new Opcode(code, name, loadArgs, storeArgs, handler, rule);
            }
            opcode(0x00, 'nop', 0, 0, function () { });
            opcode(0x10, 'add', 2, 1, function add(a, b) { return uint32(a + b); });
            opcode(0x11, 'sub', 2, 1, function sub(a, b) { return uint32(a - b); });
            opcode(0x12, 'mul', 2, 1, function mul(a, b) { return uint32(Math.imul(int32(a), int32(b))); });
            opcode(0x13, 'div', 2, 1, function div(a, b) { return uint32(int32(a) / int32(b)); });
            opcode(0x14, 'mod', 2, 1, function mod(a, b) { return uint32(int32(a) % int32(b)); });
            // TODO: check the specs
            opcode(0x15, 'neg', 1, 1, function neg(x) {
                return uint32(0xFFFFFFFF - x + 1);
            });
            // TODO: check if it works, JS has signed ints, we want uint
            opcode(0x18, 'bitand', 2, 1, function bitand(a, b) { return uint32(uint32(a) & uint32(b)); });
            // TODO: check if it works, JS has signed ints, we want uint
            opcode(0x19, 'bitor', 2, 1, function bitor(a, b) { return uint32(uint32(a) | uint32(b)); });
            // TODO: check if it works, JS has signed ints, we want uint
            opcode(0x1A, 'bitxor', 2, 1, function bitxor(a, b) { return uint32(uint32(a) ^ uint32(b)); });
            // TODO: check if it works, JS has signed ints, we want uint	
            opcode(0x1B, 'bitnot', 1, 1, function bitnot(x) { x = ~uint32(x); if (x < 0)
                return 1 + x + 0xFFFFFFFF; return x; });
            opcode(0x1C, 'shiftl', 2, 1, function shiftl(a, b) {
                if (uint32(b) >= 32)
                    return 0;
                return uint32(a << b);
            });
            opcode(0x1D, 'sshiftr', 2, 1, function sshiftr(a, b) {
                if (uint32(b) >= 32)
                    return (a & 0x80000000) ? 0xFFFFFFFF : 0;
                return uint32(int32(a) >> b);
            });
            opcode(0x1E, 'ushiftr', 2, 1, function ushiftr(a, b) {
                if (uint32(b) >= 32)
                    return 0;
                return uint32(uint32(a) >>> b);
            });
            opcode(0x20, 'jump', 1, 0, function jump(jumpVector) {
                this.takeBranch(jumpVector);
            });
            opcode(0x022, 'jz', 2, 0, function jz(condition, jumpVector) {
                if (condition === 0)
                    this.takeBranch(jumpVector);
            });
            opcode(0x023, 'jnz', 2, 0, function jnz(condition, jumpVector) {
                if (condition !== 0)
                    this.takeBranch(jumpVector);
            });
            opcode(0x024, 'jeq', 3, 0, function jeq(a, b, jumpVector) {
                if (a === b || uint32(a) === uint32(b))
                    this.takeBranch(jumpVector);
            });
            opcode(0x025, 'jne', 3, 0, function jne(a, b, jumpVector) {
                if (uint32(a) !== uint32(b))
                    this.takeBranch(jumpVector);
            });
            opcode(0x026, 'jlt', 3, 0, function jlt(a, b, jumpVector) {
                if (int32(a) < int32(b))
                    this.takeBranch(jumpVector);
            });
            opcode(0x027, 'jge', 3, 0, function jge(a, b, jumpVector) {
                if (int32(a) >= int32(b))
                    this.takeBranch(jumpVector);
            });
            opcode(0x028, 'jgt', 3, 0, function jgt(a, b, jumpVector) {
                if (int32(a) > int32(b))
                    this.takeBranch(jumpVector);
            });
            opcode(0x029, 'jle', 3, 0, function jle(a, b, jumpVector) {
                if (int32(a) <= int32(b))
                    this.takeBranch(jumpVector);
            });
            // TODO: check if it works, JS has signed ints, we want uint
            opcode(0x02A, 'jltu', 3, 0, function jltu(a, b, jumpVector) {
                if (a < b)
                    this.takeBranch(jumpVector);
            });
            // TODO: check if it works, JS has signed ints, we want uint
            opcode(0x02B, 'jgeu', 3, 0, function jgeu(a, b, jumpVector) {
                if (a >= b)
                    this.takeBranch(jumpVector);
            });
            // TODO: check if it works, JS has signed ints, we want uint
            opcode(0x02C, 'jgtu', 3, 0, function jgtu(a, b, jumpVector) {
                if (a > b)
                    this.takeBranch(jumpVector);
            });
            // TODO: check if it works, JS has signed ints, we want uint
            opcode(0x02D, 'jleu', 3, 0, function jleu(a, b, jumpVector) {
                if (a <= b)
                    this.takeBranch(jumpVector);
            });
            opcode(0x0104, 'jumpabs', 1, 0, function jumpabs(address) {
                this.PC = address;
            });
            opcode(0x30, 'call', 2, 0, function call(address, argc, destType, destAddr) {
                var args = [];
                while (argc--) {
                    args.push(this.pop());
                }
                this.performCall(address, args, destType, destAddr, this.PC);
            }, 3 /* DelayedStore */);
            opcode(0x160, 'callf', 1, 0, function callf(address, destType, destAddr) {
                this.performCall(address, null, destType, destAddr, this.PC);
            }, 3 /* DelayedStore */);
            opcode(0x161, 'callfi', 2, 0, function callfi(address, arg, destType, destAddr) {
                this.performCall(address, [uint32(arg)], destType, destAddr, this.PC);
            }, 3 /* DelayedStore */);
            opcode(0x162, 'callfii', 3, 0, function callfii(address, arg1, arg2, destType, destAddr) {
                this.performCall(address, [uint32(arg1), uint32(arg2)], destType, destAddr, this.PC);
            }, 3 /* DelayedStore */);
            opcode(0x163, 'callfiii', 4, 0, function callfiii(address, arg1, arg2, arg3, destType, destAddr) {
                this.performCall(address, [uint32(arg1), uint32(arg2), uint32(arg3)], destType, destAddr, this.PC);
            }, 3 /* DelayedStore */);
            opcode(0x31, 'return', 1, 0, function _return(retVal) {
                this.leaveFunction(uint32(retVal));
            });
            opcode(0x32, "catch", 0, 0, function _catch(destType, destAddr, address) {
                this.pushCallStub(destType, destAddr, this.PC, this.FP);
                // the catch token is the value of sp after pushing that stub
                this.performDelayedStore(destType, destAddr, this.SP);
                this.takeBranch(address);
            }, 4 /* Catch */);
            opcode(0x33, "throw", 2, 0, function _throw(ex, catchToken) {
                if (catchToken > this.SP)
                    throw new Error("invalid catch token ${catchToken}");
                // pop the stack back down to the stub pushed by catch
                this.SP = catchToken;
                // restore from the stub
                var stub = this.popCallStub();
                this.PC = stub.PC;
                this.FP = stub.framePtr;
                this.frameLen = this.stack.readInt32(this.FP);
                this.localsPos = this.stack.readInt32(this.FP + 4);
                // store the thrown value and resume after the catch opcode
                this.performDelayedStore(stub.destType, stub.destAddr, ex);
            });
            opcode(0x34, "tailcall", 2, 0, function tailcall(address, argc) {
                var argv = [];
                while (argc--) {
                    argv.push(this.pop());
                }
                this.performCall(address, argv, 0, 0, 0, true);
            });
            opcode(0x180, 'accelfunc', 2, 0, function (slot, value) {
                FyreVM.setSlotGlulx.call(this, false, slot, value);
            });
            opcode(0x181, 'accelparam', 2, 0, function (slot, value) {
                FyreVM.setSlotGlulx.call(this, true, slot, value);
            });
            opcode(0x40, "copy", 1, 1, function copy(x) {
                return uint32(x);
            });
            opcode(0x41, "copys", 1, 1, function copys(x) {
                return x & 0xFFFF;
            }, 2 /* Indirect16Bit */);
            opcode(0x42, "copyb", 1, 1, function copyb(x) {
                return x & 0xFF;
            }, 1 /* Indirect8Bit */);
            opcode(0x44, "sexs", 1, 1, function sexs(x) {
                return x & 0x8000 ? uint32(x | 0xFFFF0000) : x & 0x0000FFFF;
            });
            opcode(0x45, "sexb", 1, 1, function sexb(x) {
                return x & 0x80 ? uint32(x | 0xFFFFFF00) : x & 0x000000FF;
            });
            opcode(0x48, "aload", 2, 1, function aload(array, index) {
                return this.image.readInt32(uint32(array + 4 * index));
            });
            opcode(0x49, "aloads", 2, 1, function aloads(array, index) {
                return this.image.readInt16(uint32(array + 2 * index));
            });
            opcode(0x4A, "aloadb", 2, 1, function aloadb(array, index) {
                return this.image.readByte(uint32(array + index));
            });
            opcode(0x4B, "aloadbit", 2, 1, function aloadbit(array, index) {
                index = int32(index);
                var bitx = index & 7;
                var address = array;
                if (index >= 0) {
                    address += (index >> 3);
                }
                else {
                    address -= (1 + ((-1 - index) >> 3));
                }
                var byte = this.image.readByte(uint32(address));
                return byte & (1 << bitx) ? 1 : 0;
            });
            opcode(0x4C, "astore", 3, 0, function astore(array, index, value) {
                this.image.writeInt32(array + 4 * int32(index), uint32(value));
            });
            opcode(0x4D, "astores", 3, 0, function astores(array, index, value) {
                value = value & 0xFFFF;
                this.image.writeBytes(array + 2 * index, value >> 8, value & 0xFF);
            });
            opcode(0x4E, "astoreb", 3, 0, function astoreb(array, index, value) {
                this.image.writeBytes(array + index, value & 0xFF);
            });
            opcode(0x4F, "astorebit", 3, 0, function astorebit(array, index, value) {
                index = int32(index);
                var bitx = index & 7;
                var address = array;
                if (index >= 0) {
                    address += (index >> 3);
                }
                else {
                    address -= (1 + ((-1 - index) >> 3));
                }
                var byte = this.image.readByte(address);
                if (value === 0) {
                    byte &= ~(1 << bitx);
                }
                else {
                    byte |= (1 << bitx);
                }
                this.image.writeBytes(address, byte);
            });
            opcode(0x70, 'streamchar', 1, 0, FyreVM.Engine.prototype.streamCharCore);
            opcode(0x73, 'streamunichar', 1, 0, FyreVM.Engine.prototype.streamUniCharCore);
            opcode(0x71, 'streamnum', 1, 0, FyreVM.Engine.prototype.streamNumCore);
            opcode(0x72, 'streamstr', 1, 0, FyreVM.Engine.prototype.streamStrCore);
            opcode(0x130, 'glk', 2, 1, function glk(code, argc) {
                switch (this.glkMode) {
                    case 0 /* None */:
                        // not really supported, just clear the stack
                        while (argc--) {
                            this.pop();
                        }
                        return 0;
                    case 1 /* Wrapper */:
                        return FyreVM.GlkWrapperCall.call(this, code, argc);
                    default:
                        throw new Error("unsupported glkMode " + this.glkMode);
                }
            });
            opcode(0x140, 'getstringtbl', 0, 1, function getstringtbl() {
                return this.decodingTable;
            });
            opcode(0x141, 'setstringtbl', 1, 0, function setstringtbl(addr) {
                this.decodingTable = addr;
            });
            opcode(0x148, 'getiosys', 0, 2, function getiosys() {
                switch (this.outputSystem) {
                    case 0 /* Null */: return [0, 0];
                    case 1 /* Filter */: return [1, this.filterAddress];
                    case 2 /* Channels */: return [20, 0];
                    case 3 /* Glk */: return [2, 0];
                }
            });
            opcode(0x149, 'setiosys', 2, 0, function setiosys(system, rock) {
                switch (system) {
                    case 0:
                        this.outputSystem = 0 /* Null */;
                        return;
                    case 1:
                        this.outputSystem = 1 /* Filter */;
                        this.filterAddress = rock;
                        return;
                    case 2:
                        if (this.glkMode !== 1 /* Wrapper */)
                            throw new Error("Glk wrapper support has not been enabled");
                        this.outputSystem = 3 /* Glk */;
                        return;
                    case 20:
                        if (!this.enableFyreVM)
                            throw new Error("FyreVM support has been disabled");
                        this.outputSystem = 2 /* Channels */;
                        return;
                    default:
                        throw new Error("Unrecognized output system " + system);
                }
            });
            opcode(0x102, 'getmemsize', 0, 1, function getmemsize() {
                return this.image.getEndMem();
            });
            opcode(0x103, 'setmemsize', 1, 1, function setmemsize(size) {
                if (this.heap)
                    throw new Error("setmemsize is not allowed while the heap is active");
                try {
                    this.image.setEndMem(size);
                    return 0;
                }
                catch (e) {
                    console.error(e);
                    return 1;
                }
            });
            opcode(0x170, 'mzero', 2, 0, function mzero(count, address) {
                var _a;
                var zeros = [];
                count = uint32(count);
                while (count--) {
                    zeros.push(0);
                }
                (_a = this.image).writeBytes.apply(_a, __spreadArray([address], zeros));
            });
            opcode(0x171, 'mcopy', 3, 0, function mcopy(count, from, to) {
                var _a;
                var data = [];
                count = uint32(count);
                for (var i = from; i < from + count; i++) {
                    data.push(this.image.readByte(i));
                }
                (_a = this.image).writeBytes.apply(_a, __spreadArray([to], data));
            });
            opcode(0x178, 'malloc', 1, 1, function malloc(size) {
                if (size <= 0)
                    return 0;
                if (this.heap) {
                    return this.heap.alloc(size);
                }
                var oldEndMem = this.image.getEndMem();
                this.heap = new FyreVM.HeapAllocator(oldEndMem, this.image.memory);
                this.heap.maxHeapExtent = this.maxHeapSize;
                var a = this.heap.alloc(size);
                if (a === 0) {
                    this.heap = null;
                    this.image.setEndMem(oldEndMem);
                }
                return a;
            });
            opcode(0x179, 'mfree', 1, 0, function mfree(address) {
                if (this.heap) {
                    this.heap.free(address);
                    if (this.heap.blockCount() === 0) {
                        this.image.endMem = this.heap.heapAddress;
                        this.heap = null;
                    }
                }
            });
            opcode(0x150, 'linearsearch', 7, 1, PerformLinearSearch);
            opcode(0x151, 'binarysearch', 7, 1, PerformBinarySearch);
            opcode(0x152, 'linkedsearch', 6, 1, PerformLinkedSearch);
            opcode(0x50, 'stkcount', 0, 1, function stkcount() {
                return (this.SP - (this.FP + this.frameLen)) / 4;
            });
            opcode(0x51, 'stkpeek', 1, 1, function stkpeek(pos) {
                var address = this.SP - 4 * (1 + pos);
                if (address < this.FP + this.frameLen)
                    throw new Error("Stack underflow");
                return this.stack.readInt32(address);
            });
            opcode(0x52, 'stkswap', 0, 0, function stkswap(pos) {
                if (this.SP - (this.FP + this.frameLen) < 8)
                    throw new Error("Stack underflow");
                var a = this.pop();
                var b = this.pop();
                this.push(a);
                this.push(b);
            });
            opcode(0x53, 'stkroll', 2, 0, function stkroll(items, distance) {
                // TODO: treat distance as signed value
                if (items === 0)
                    return;
                distance %= items;
                if (distance === 0)
                    return;
                // rolling X items down Y slots == rolling X items up X-Y slots
                if (distance < 0)
                    distance += items;
                if (this.SP - (this.FP + this.frameLen) < 4 * items)
                    throw new Error("Stack underflow");
                var temp1 = [];
                var temp2 = [];
                for (var i = 0; i < distance; i++) {
                    temp1.push(this.pop());
                }
                for (var i = distance; i < items; i++) {
                    temp2.push(this.pop());
                }
                while (temp1.length) {
                    this.push(temp1.pop());
                }
                while (temp2.length) {
                    this.push(temp2.pop());
                }
            });
            opcode(0x54, 'stkcopy', 1, 0, function stkcopy(count) {
                var bytes = count * 4;
                if (bytes > this.SP - (this.FP + this.frameLen))
                    throw new Error("Stack underflow");
                var start = this.SP - bytes;
                while (count--) {
                    this.push(this.stack.readInt32(start));
                    start += 4;
                }
            });
            opcode(0x100, "gestalt", 2, 1, function gestalt(selector, arg) {
                switch (selector) {
                    case 0 /* GlulxVersion */: return 196866 /* glulx */;
                    case 1 /* TerpVersion */: return 1 /* terp */;
                    case 2 /* ResizeMem */:
                    case 5 /* Unicode */:
                    case 6 /* MemCopy */:
                    case 7 /* MAlloc */:
                    case 3 /* Undo */:
                    case 12 /* ExtUndo */:
                    case 9 /* Acceleration */:
                        return 1;
                    case 11 /* Float */:
                        return 0;
                    case 4 /* IOSystem */:
                        if (arg === 0)
                            return 1; // Null-IO
                        if (arg === 1)
                            return 1; // Filter
                        if (arg === 20 && this.enableFyreVM)
                            return 1; // Channel IO
                        if (arg == 2 && this.glkMode === 1 /* Wrapper */)
                            return 1; // Glk
                        return 0;
                    case 8 /* MAllocHeap */:
                        if (this.heap)
                            return this.heap.heapAddress;
                        return 0;
                    case 10 /* AccelFunc */:
                        return 0;
                    default:
                        return 0;
                }
            });
            opcode(0x120, 'quit', 0, 0, function quit() { this.running = false; });
            opcode(0x122, 'restart', 0, 0, FyreVM.Engine.prototype.restart);
            opcode(0x123, 'save', 1, 0, function save(X, destType, destAddr) {
                // TODO: find out what that one argument X does ...
                var engine = this;
                if (engine.saveRequested) {
                    var q = engine.saveToQuetzal(destType, destAddr);
                    var resume_1 = this.resumeAfterWait.bind(this);
                    var callback = function (success) {
                        if (success) {
                            engine['performDelayedStore'](destType, destAddr, 0);
                        }
                        else {
                            engine['performDelayedStore'](destType, destAddr, 1);
                        }
                        resume_1();
                    };
                    engine.saveRequested(q, callback);
                    var wait = 'wait';
                    return wait;
                }
                engine['performDelayedStore'](destType, destAddr, 1);
            }, 3 /* DelayedStore */);
            opcode(0x124, "restore", 1, 0, function restore(X, destType, destAddr) {
                // TODO: find out what that one argument X does ...
                var engine = this;
                if (engine.loadRequested) {
                    var resume_2 = this.resumeAfterWait.bind(this);
                    var callback = function (quetzal) {
                        if (quetzal) {
                            engine.loadFromQuetzal(quetzal);
                            resume_2();
                            return;
                        }
                        engine['performDelayedStore'](destType, destAddr, 1);
                        resume_2();
                    };
                    engine.loadRequested(callback);
                    var wait = 'wait';
                    return wait;
                }
                engine['performDelayedStore'](destType, destAddr, 1);
            }, 3 /* DelayedStore */);
            opcode(0x125, 'saveundo', 0, 0, function saveundo(destType, destAddr) {
                var q = this.saveToQuetzal(destType, destAddr);
                if (this.undoBuffers) {
                    // TODO make MAX_UNDO_LEVEL configurable
                    if (this.undoBuffers.length >= 3) {
                        this.undoBuffers.unshift();
                    }
                    this.undoBuffers.push(q);
                }
                else {
                    this.undoBuffers = [q];
                }
                this.performDelayedStore(destType, destAddr, 0);
            }, 3 /* DelayedStore */);
            opcode(0x126, 'restoreundo', 0, 0, function restoreundo(destType, destAddr) {
                if (this.undoBuffers && this.undoBuffers.length) {
                    var q = this.undoBuffers.pop();
                    this.loadFromQuetzal(q);
                }
                else {
                    this.performDelayedStore(destType, destAddr, 1);
                }
            }, 3 /* DelayedStore */);
            opcode(0x127, 'protect', 2, 0, function protect(start, length) {
                if (start < this.image.getEndMem()) {
                    this.protectionStart = start;
                    this.protectionLength = length;
                }
            });
            opcode(0x128, 'hasundo', 0, 1, 
            // Test whether a VM state is available in temporary storage. 
            // return 0 if a state is available, 1 if not. 
            // If this returns 0, then restoreundo is expected to succeed.
            function hasundo() {
                if (this.undoBuffers && this.undoBuffers.length)
                    return 0;
                return 1;
            });
            opcode(0x129, 'discardundo', 0, 0, 
            // Discard a VM state (the most recently saved) from temporary storage. If none is available, this does nothing.
            function discardundo() {
                if (this.undoBuffers) {
                    this.undoBuffers.pop();
                }
            });
            opcode(0x110, 'random', 1, 1, function random(max) {
                if (max === 1 || max === 0xFFFFFFFF)
                    return 0;
                var random = this.random;
                if (!random) {
                    random = this.random = new MersenneTwister();
                }
                if (max === 0) {
                    return random.genrand_int32();
                }
                max = int32(max);
                if (max < 0) {
                    return uint32(-(random.genrand_int31() % -max));
                }
                return random.genrand_int31() % max;
            });
            opcode(0x111, 'setrandom', 1, 0, function setrandom(seed) {
                if (!seed)
                    seed = undefined;
                this.random = new MersenneTwister(seed);
            });
            opcode(0x1000, 'fyrecall', 3, 1, FyreVM.Engine.prototype.fyreCall);
            return opcodes;
        }
        Opcodes.initOpcodes = initOpcodes;
    })(Opcodes = FyreVM.Opcodes || (FyreVM.Opcodes = {}));
    function PerformBinarySearch(key, keySize, start, structSize, numStructs, keyOffset, options) {
        if (options & 2 /* ZeroKeyTerminates */)
            throw new Error("ZeroKeyTerminated option may not be used with binary search");
        if (keySize > 4 && !(options & 1 /* KeyIndirect */))
            throw new Error("KeyIndirect option must be used when searching for a >4 byte key");
        var returnIndex = options & 4 /* ReturnIndex */;
        var low = 0, high = numStructs;
        key = key >>> 0;
        while (low < high) {
            var index = Math.floor((low + high) / 2);
            var cmp = compareKeys.call(this, key, start + index * structSize + keyOffset, keySize, options);
            if (cmp === 0) {
                // found it
                if (returnIndex)
                    return index;
                return start + index * structSize;
            }
            if (cmp < 0) {
                high = index;
            }
            else {
                low = index + 1;
            }
        }
        // did not find
        return returnIndex ? 0xFFFFFFFF : 0;
    }
    function PerformLinearSearch(key, keySize, start, structSize, numStructs, keyOffset, options) {
        if (keySize > 4 && !(options & 1 /* KeyIndirect */))
            throw new Error("KeyIndirect option must be used when searching for a >4 byte key");
        var returnIndex = options & 4 /* ReturnIndex */;
        key = key >>> 0;
        for (var i = 0; numStructs === -1 || i < numStructs; i++) {
            var cmp = compareKeys.call(this, key, start + i * structSize + keyOffset, keySize, options);
            if (cmp === 0) {
                // found it
                if (returnIndex)
                    return i;
                return start + i * structSize;
            }
            if (options & 2 /* ZeroKeyTerminates */) {
                if (keyIsZero.call(this, start + i * structSize + keyOffset, keySize)) {
                    break;
                }
            }
        }
        // did not find
        return returnIndex ? 0xFFFFFFFF : 0;
    }
    function PerformLinkedSearch(key, keySize, start, keyOffset, nextOffset, options) {
        if (options & 4 /* ReturnIndex */)
            throw new Error("ReturnIndex option may not be used with linked search");
        var node = start;
        key = key >>> 0;
        while (node) {
            var cmp = compareKeys.call(this, key, node + keyOffset, keySize, options);
            if (cmp === 0) {
                // found it
                return node;
            }
            if (options & 2 /* ZeroKeyTerminates */) {
                if (keyIsZero.call(this, node + keyOffset, keySize)) {
                    return 0;
                }
            }
            // advance the next item
            node = this.image.readInt32(node + nextOffset);
        }
    }
    function keyIsZero(address, size) {
        while (size--) {
            if (this.image.readByte(address + size) !== 0)
                return false;
        }
        return true;
    }
    function compareKeys(query, candidateAddr, keySize, options) {
        var image = this.image;
        if (options & 1 /* KeyIndirect */) {
            // KeyIndirect *is* set
            // compare the bytes stored at query vs. candidateAddr
            for (var i = 0; i < keySize; i++) {
                var b1 = image.readByte(query++);
                var b2 = image.readByte(candidateAddr++);
                if (b1 < b2)
                    return -1;
                if (b1 > b2)
                    return 1;
            }
            return 0;
        }
        // KeyIndirect is *not* set
        // mask query to the appropriate size and compare it against the value stored at candidateAddr
        var ckey;
        switch (keySize) {
            case 1:
                ckey = image.readByte(candidateAddr);
                query &= 0xFF;
                return query - ckey;
            case 2:
                ckey = image.readInt16(candidateAddr);
                query &= 0xFFFF;
                return query - ckey;
            case 3:
                ckey = image.readInt32(candidateAddr) & 0xFFFFFF;
                query &= 0xFFFFFF;
                return query - ckey;
            case 4:
                ckey = image.readInt32(candidateAddr);
                return query - ckey;
        }
    }
})(FyreVM || (FyreVM = {}));
// Written in 2015 by Thilo Planz 
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
/// <reference path='GlkWrapper.ts' />
var FyreVM;
// Written in 2015 by Thilo Planz 
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
/// <reference path='GlkWrapper.ts' />
(function (FyreVM) {
    function SendCharToOutput(x) {
        switch (this.outputSystem) {
            case 0 /* Null */: return;
            case 2 /* Channels */:
                // TODO? need to handle Unicode characters larger than 16 bits
                this.outputBuffer.write(String.fromCharCode(x));
                return;
            case 3 /* Glk */:
                if (this.glkMode === 1 /* Wrapper */)
                    FyreVM.GlkWrapperWrite.call(this, String.fromCharCode(x));
                return;
        }
        throw new Error("unsupported output system " + this.outputSystem);
    }
    FyreVM.SendCharToOutput = SendCharToOutput;
    function SendStringToOutput(x) {
        switch (this.outputSystem) {
            case 0 /* Null */: return;
            case 2 /* Channels */:
                this.outputBuffer.write(x);
                return;
            case 3 /* Glk */:
                if (this.glkMode === 1 /* Wrapper */)
                    FyreVM.GlkWrapperWrite.call(this, x);
                return;
        }
        throw new Error("unsupported output system " + this.outputSystem);
    }
    FyreVM.SendStringToOutput = SendStringToOutput;
    /**
     * Prints the next character of a compressed string, consuming one or more bits.
     *
     */
    function NextCompressedChar() {
        var engine = this;
        var image = engine.image;
        var node = image.readInt32(this.decodingTable + 8 /* ROOTNODE_OFFSET */);
        while (true) {
            var nodeType = image.readByte(node++);
            switch (nodeType) {
                case 0 /* NODE_BRANCH */:
                    if (nextCompressedStringBit(engine)) {
                        node = image.readInt32(node + 4); // go right
                    }
                    else {
                        node = image.readInt32(node); // go left
                    }
                    break;
                case 1 /* NODE_END */:
                    this.resumeFromCallStub(0);
                    return;
                case 2 /* NODE_CHAR */:
                case 4 /* NODE_UNICHAR */:
                    var c = (nodeType === 4 /* NODE_UNICHAR */) ? image.readInt32(node) : image.readByte(node);
                    if (this.outputSystem === 1 /* Filter */) {
                        this.performCall(this.filterAddress, [c], 10 /* RESUME_HUFFSTR */, this.printingDigit, this.PC);
                    }
                    else {
                        SendCharToOutput.call(this, c);
                    }
                    return;
                case 3 /* NODE_CSTR */:
                    if (this.outputSystem === 1 /* Filter */) {
                        this.pushCallStub(10 /* RESUME_HUFFSTR */, this.printingDigit, this.PC, this.FP);
                        this.PC = node;
                        this.execMode = 1 /* CString */;
                    }
                    else {
                        SendStringToOutput.call(this, this.image.readCString(node));
                    }
                    return;
                // TODO: the other node types
                default:
                    throw new Error("Unrecognized compressed string node type " + nodeType);
            }
        }
    }
    FyreVM.NextCompressedChar = NextCompressedChar;
    function nextCompressedStringBit(engine) {
        var result = ((engine.image.readByte(engine.PC) & (1 << engine.printingDigit)) !== 0);
        engine.printingDigit++;
        if (engine.printingDigit === 8) {
            engine.printingDigit = 0;
            engine.PC++;
        }
        return result;
    }
    function NextCStringChar() {
        var ch = this.image.readByte(this.PC++);
        if (ch === 0) {
            this.resumeFromCallStub(0);
            return;
        }
        if (this.outputSystem === 1 /* Filter */) {
            this.performCall(this.filterAddress, [ch], 13 /* RESUME_CSTR */, 0, this.PC);
        }
        else {
            SendCharToOutput(ch);
        }
    }
    FyreVM.NextCStringChar = NextCStringChar;
    function NextUniStringChar() {
        var ch = this.image.readInt32(this.PC);
        this.PC += 4;
        if (ch === 0) {
            this.resumeFromCallStub(0);
            return;
        }
        if (this.outputSystem === 1 /* Filter */) {
            this.performCall(this.filterAddress, [ch], 14 /* RESUME_UNISTR */, 0, this.PC);
        }
        else {
            SendCharToOutput(ch);
        }
    }
    FyreVM.NextUniStringChar = NextUniStringChar;
    function NextDigit() {
        var s = this.PC.toString();
        if (this.printingDigit < s.length) {
            var ch = s.charAt(this.printingDigit);
            if (this.outputSystem === 1 /* Filter */) {
                this.performCall(this.filterAddress, [ch.charCodeAt(0)], 12 /* RESUME_NUMBER */, this.printingDigit + 1, this.PC);
            }
            else {
                SendStringToOutput(ch);
                this.printingDigit++;
            }
        }
        else {
            this.resumeFromCallStub(0);
        }
    }
    FyreVM.NextDigit = NextDigit;
    var OutputBuffer = /** @class */ (function () {
        function OutputBuffer() {
            // No special "StringBuilder"
            // simple String concatenation is said to be fast on modern browsers
            // http://stackoverflow.com/a/27126355/14955
            this.channel = 'MAIN';
            this.channelData = {
                MAIN: ''
            };
        }
        OutputBuffer.prototype.getChannel = function () {
            return this.channel;
        };
        /**  If the output channel is changed to any channel other than
        * "MAIN", the channel's contents will be
        * cleared first.
        */
        OutputBuffer.prototype.setChannel = function (c) {
            if (c === this.channel)
                return;
            this.channel = c;
            if (c !== 'MAIN') {
                this.channelData[c] = '';
            }
        };
        /**
         * Writes a string to the buffer for the currently
         * selected output channel.
         */
        OutputBuffer.prototype.write = function (s) {
            this.channelData[this.channel] += s;
        };
        /**
         *  Packages all the output that has been stored so far, returns it,
         *  and empties the buffer.
         */
        OutputBuffer.prototype.flush = function () {
            var channelData = this.channelData;
            var r = {};
            for (var c in channelData) {
                var s = channelData[c];
                if (s) {
                    r[c] = s;
                    channelData[c] = '';
                }
            }
            return r;
        };
        return OutputBuffer;
    }());
    FyreVM.OutputBuffer = OutputBuffer;
})(FyreVM || (FyreVM = {}));
// Written in 2015 by Thilo Planz and Andrew Plotkin
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
var FyreVM;
// Written in 2015 by Thilo Planz and Andrew Plotkin
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
(function (FyreVM) {
    /**
     * a struct to keep track of heap fragments
     */
    var HeapEntry = /** @class */ (function () {
        function HeapEntry(offset, length) {
            this.offset = offset;
            this.length = length;
        }
        return HeapEntry;
    }());
    /**
     * Manages the heap size and block allocation for the malloc/mfree opcodes.
     *
     * If Inform ever starts using the malloc opcode directly, instead of
     * its own heap allocator, this should be made a little smarter.
     * Currently we make no attempt to avoid heap fragmentation.
     */
    var HeapAllocator = /** @class */ (function () {
        function HeapAllocator(heapAddress, memory) {
            this.heapExtent = 0;
            this.maxHeapExtent = 0;
            this.blocks = [];
            this.freeList = [];
            this.heapAddress = heapAddress;
            this.memory = memory;
            this.endMem = heapAddress;
        }
        /**
         * saves the heap state into a Uint8Array.
         * Does not include the memory itself, only the block allocation information.
         */
        HeapAllocator.prototype.save = function () {
            var count = this.blockCount();
            var result = new MemoryAccess(8 + count * 8);
            result.writeInt32(0, this.heapAddress);
            result.writeInt32(4, count);
            var blocks = this.blocks;
            for (var i = 0; i < count; i++) {
                result.writeInt32(8 * i + 8, blocks[i].offset);
                result.writeInt32(8 * i * 12, blocks[i].length);
            }
            return result.buffer;
        };
        /**
         * restores the heap state from an Uint8Array (as created by the "save" method)
         */
        HeapAllocator.restore = function (buffer, memory) {
            var m = new MemoryAccess(0);
            m.buffer = buffer;
            var count = m.readInt32(4);
            if (count === 0)
                return null;
            var heap = new HeapAllocator(m.readInt32(0), memory);
            var nextAddress = heap.heapAddress;
            for (var i = 0; i < count; i++) {
                var start = m.readInt32(8 * i + 8);
                var length_1 = m.readInt32(8 * i + 12);
                heap.blocks.push(new HeapEntry(start, length_1));
                if (nextAddress < start) {
                    heap.freeList.push(new HeapEntry(nextAddress, start - nextAddress));
                }
                nextAddress = start + length_1;
            }
            heap.endMem = nextAddress;
            heap.heapExtent = nextAddress - heap.heapAddress;
            if (!heap.memory.setEndMem(heap.endMem)) {
                throw new Error("Can't allocate VM memory to fit saved heap");
            }
            // TODO: sort blocklist and freelist
            return heap;
        };
        /**
         * allocates a new block on the heap
         * @return the address of the new block, or null if allocation failed
         */
        HeapAllocator.prototype.alloc = function (size) {
            var _a = this, blocks = _a.blocks, freeList = _a.freeList;
            var result = new HeapEntry(-1, size);
            // look for a free block
            for (var i = 0; i < freeList.length; i++) {
                var entry = freeList[i];
                if (entry && entry.length >= size) {
                    result.offset = entry.offset;
                    if (entry.length > size) {
                        // keep the rest in the free list
                        entry.offset += size;
                        entry.length -= size;
                    }
                    else {
                        freeList[i] = null;
                    }
                    break;
                }
            }
            if (result.offset === -1) {
                // enforce max heap size
                if (this.maxHeapExtent && this.heapExtent + size > this.maxHeapExtent) {
                    return null;
                }
                // add a new block
                result.offset = this.heapAddress + this.heapExtent;
                if (result.offset + size > this.endMem) {
                    // grow the heap
                    var newHeapAllocation = Math.max(this.heapExtent * 5 / 4, this.heapExtent + size);
                    if (this.maxHeapExtent) {
                        newHeapAllocation = Math.min(newHeapAllocation, this.maxHeapExtent);
                    }
                    if (!this.setEndMem(newHeapAllocation)) {
                        return null;
                    }
                }
                this.heapExtent += size;
            }
            // TODO: keep the list sorted
            blocks.push(result);
            return result.offset;
        };
        HeapAllocator.prototype.setEndMem = function (newHeapAllocation) {
            var newEndMem = this.heapAddress + newHeapAllocation;
            if (this.memory.setEndMem(newEndMem)) {
                this.endMem = newEndMem;
                return true;
            }
            return false;
        };
        HeapAllocator.prototype.blockCount = function () {
            return this.blocks.length;
        };
        /**
         * deallocates a previously allocated block
         */
        HeapAllocator.prototype.free = function (address) {
            var _a = this, blocks = _a.blocks, freeList = _a.freeList;
            // find the block
            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                if (block.offset === address) {
                    // remove it
                    blocks.splice(i, 1);
                    // shrink the heap if that was at the end
                    if (address + block.length - this.heapAddress === this.heapExtent) {
                        var newHeapExtent = this.heapAddress;
                        for (var j = 0; j < blocks.length; j++) {
                            var b = blocks[j];
                            newHeapExtent = Math.max(newHeapExtent, b.length + b.offset);
                        }
                        this.heapExtent = newHeapExtent - this.heapAddress;
                    }
                    else {
                        // add to the free list
                        freeList.push(block);
                        // TODO: keep sorted and coalesce free list
                    }
                    // shrink the heap
                    if (blocks.length > 0 && this.heapExtent <= (this.endMem - this.heapAddress) / 2) {
                        if (this.setEndMem(this.heapExtent)) {
                            var newEndMem = this.endMem;
                            for (var i_1 = 0; i_1 < freeList.length; i_1++) {
                                var entry = freeList[i_1];
                                if (entry && entry.offset >= newEndMem) {
                                    freeList[i_1] = null;
                                }
                            }
                        }
                    }
                    return;
                }
            }
        };
        return HeapAllocator;
    }());
    FyreVM.HeapAllocator = HeapAllocator;
    /**
     *  Wrapper around ECMAScript 6 standard Uint8Array.
     *  Provides access to a memory buffer.
     */
    var MemoryAccess = /** @class */ (function () {
        function MemoryAccess(size, maxSize) {
            if (maxSize === void 0) { maxSize = size; }
            this.buffer = new Uint8Array(size);
            this.maxSize = maxSize;
        }
        /**
         * Reads a single byte (unsigned)
         */
        MemoryAccess.prototype.readByte = function (offset) {
            return this.buffer[offset];
        };
        /**
        * Writes a single byte (unsigned).
        * Writes 0 when value is undefined or null.
        */
        MemoryAccess.prototype.writeByte = function (offset, value) {
            if (value < 0 || value > 255)
                throw new Error(value + " is out of range for a byte");
            this.buffer[offset] = value;
        };
        /**
         * Reads an unsigned, big-endian, 16-bit number
         */
        MemoryAccess.prototype.readInt16 = function (offset) {
            return (this.buffer[offset] * 256) + this.buffer[offset + 1];
        };
        // TypeScript does not like us calling "set" with an array directly
        MemoryAccess.prototype.set = function (offset, value) {
            this.buffer.set(value, offset);
        };
        /**
         * Writes an unsigned, big-endian, 16-bit number.
         * Writes 0 when value is undefined or null.
         */
        MemoryAccess.prototype.writeInt16 = function (offset, value) {
            if (value < 0 || value > 0xFFFF)
                throw new Error(value + " is out of range for uint16");
            this.set(offset, [value >> 8, value & 0xFF]);
        };
        /**
        * Reads an unsigned, big-endian, 32-bit number
        */
        MemoryAccess.prototype.readInt32 = function (offset) {
            return this.buffer[offset] * 0x1000000
                + this.buffer[offset + 1] * 0x10000
                + this.buffer[offset + 2] * 0x100
                + this.buffer[offset + 3];
        };
        /**
         * Writes an unsigned, big-endian, 32-bit number
         * Writes 0 when value is undefined or null.
         */
        MemoryAccess.prototype.writeInt32 = function (offset, value) {
            value = value >>> 0;
            this.set(offset, [value >> 24, value >> 16 & 0xFF, value >> 8 & 0xFF, value & 0xFF]);
        };
        /**
         * Converts part of the buffer into a String,
         * assumes that the data is valid ASCII
         */
        MemoryAccess.prototype.readASCII = function (offset, length) {
            var len = 0, buffer = this.buffer, d = [];
            while (len < length) {
                var x = buffer[offset + len];
                len++;
                d.push(x);
            }
            return String.fromCharCode.apply(String, d);
        };
        /**
         * reads a 0-terminated C-string
         */
        MemoryAccess.prototype.readCString = function (offset) {
            var len = 0, buffer = this.buffer, d = [];
            while (true) {
                var x = buffer[offset + len];
                if (x === 0)
                    break;
                len++;
                d.push(x);
            }
            return String.fromCharCode.apply(String, d);
        };
        /**
         * Writes an ASCII String
         */
        MemoryAccess.prototype.writeASCII = function (offset, value) {
            var codes = [];
            for (var i = 0; i < value.length; i++) {
                codes.push(value.charCodeAt(i));
            }
            this.set(offset, codes);
        };
        /**
        * Resizes the available memory
        */
        MemoryAccess.prototype.setEndMem = function (newEndMem) {
            if (newEndMem > this.maxSize)
                return false;
            return true;
        };
        /**
         * Copy a part of the memory into a new buffer.
         *
         * The length can be more than there is data
         * in the original buffer. In this case the
         * new buffer will contain unspecified data
         * at the end.
         */
        MemoryAccess.prototype.copy = function (offset, length) {
            // TODO: range check
            if (length > this.maxSize)
                throw new Error("Memory request for " + length + " bytes exceeds limit of " + this.maxSize);
            var result = new MemoryAccess(length);
            result.buffer.set(this.buffer.subarray(offset, offset + length));
            result.maxSize = this.maxSize;
            return result;
        };
        /**
          * returns the number of bytes available
          */
        MemoryAccess.prototype.size = function () {
            return this.buffer.length;
        };
        return MemoryAccess;
    }());
    FyreVM.MemoryAccess = MemoryAccess;
})(FyreVM || (FyreVM = {}));
// Written in 2015 by Thilo Planz 
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
/// <reference path='MemoryAccess.ts' />
/**
 * Represents the ROM and RAM of a Glulx game image.
 */
var FyreVM;
// Written in 2015 by Thilo Planz 
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
/// <reference path='MemoryAccess.ts' />
/**
 * Represents the ROM and RAM of a Glulx game image.
 */
(function (FyreVM) {
    ;
    var UlxImage = /** @class */ (function () {
        function UlxImage(original) {
            this.original = original;
            this.loadFromOriginal();
        }
        UlxImage.prototype.loadFromOriginal = function () {
            var stream = this.original;
            // read the header, to find out how much memory we need
            var header = stream.copy(0, 36 /* SIZE */);
            var magic = header.readASCII(0, 4);
            if (magic !== 'Glul') {
                throw new Error(".ulx file has wrong magic number " + magic);
            }
            var endmem = header.readInt32(16 /* ENDMEM_OFFSET */);
            if (endmem < 36 /* SIZE */) {
                throw new Error("invalid endMem " + endmem + " in .ulx file. Too small to even fit the header.");
            }
            // now read the whole thing
            this.memory = stream.copy(0, endmem);
            // TODO: verify checksum
            this.ramstart = header.readInt32(8 /* RAMSTART_OFFSET */);
            if (this.ramstart > endmem) {
                throw new Error("invalid ramStart " + this.ramstart + " beyond endMem " + endmem + ".");
            }
        };
        UlxImage.prototype.getMajorVersion = function () {
            return this.memory.readInt16(4 /* VERSION_OFFSET */);
        };
        UlxImage.prototype.getMinorVersion = function () {
            return this.memory.readInt16(4 /* VERSION_OFFSET */ + 2) >> 8;
        };
        UlxImage.prototype.getStackSize = function () {
            return this.memory.readInt32(20 /* STACKSIZE_OFFSET */);
        };
        UlxImage.prototype.getEndMem = function () {
            return this.memory.size();
        };
        UlxImage.prototype.getRamAddress = function (relativeAddress) {
            return this.ramstart + relativeAddress;
        };
        /**
         * sets the address at which memory ends.
         * This can be changed by the game with setmemsize,
         * or managed automatically be the heap allocator.
         */
        UlxImage.prototype.setEndMem = function (value) {
            // round up to the next multiple of 256
            if (value % 256 != 0) {
                value = (value + 255) & 0xFFFFFF00;
            }
            if (this.memory.size() != value) {
                this.memory = this.memory.copy(0, value);
            }
        };
        UlxImage.prototype.getStartFunc = function () {
            return this.memory.readInt32(24 /* STARTFUNC_OFFSET */);
        };
        UlxImage.prototype.getDecodingTable = function () {
            return this.memory.readInt32(28 /* DECODINGTBL_OFFSET */);
        };
        UlxImage.prototype.saveToQuetzal = function () {
            var quetzal = new FyreVM.Quetzal();
            // 'IFhd' identifies the first 128 bytes of the game file
            quetzal.setChunk('IFhd', this.original.copy(0, 128).buffer);
            // 'CMem' or 'UMem' are the compressed/uncompressed contents of RAM
            // TODO: implement compression
            var ramSize = this.getEndMem() - this.ramstart;
            var umem = new FyreVM.MemoryAccess(ramSize + 4);
            umem.writeInt32(0, ramSize);
            umem.buffer.set(new Uint8Array(this.memory.buffer).subarray(this.ramstart, this.ramstart + ramSize), 4);
            quetzal.setChunk("UMem", umem.buffer);
            return quetzal;
        };
        UlxImage.prototype.readByte = function (address) {
            return this.memory.readByte(address);
        };
        UlxImage.prototype.readInt16 = function (address) {
            return this.memory.readInt16(address);
        };
        UlxImage.prototype.readInt32 = function (address) {
            return this.memory.readInt32(address);
        };
        UlxImage.prototype.readCString = function (address) {
            return this.memory.readCString(address);
        };
        UlxImage.prototype.writeInt32 = function (address, value) {
            if (address < this.ramstart)
                throw new Error("Writing into ROM! offset: " + address);
            this.memory.writeInt32(address, value);
        };
        UlxImage.prototype.writeBytes = function (address) {
            var bytes = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                bytes[_i - 1] = arguments[_i];
            }
            if (address < this.ramstart)
                throw new Error("Writing into ROM! offset: " + address);
            for (var i = 0; i < bytes.length; i++) {
                this.memory.writeByte(address + i, bytes[i]);
            }
        };
        UlxImage.prototype.write = function (rule, address, value) {
            switch (rule) {
                case 1 /* Indirect8Bit */:
                    this.writeBytes(address, value);
                    return;
                case 2 /* Indirect16Bit */:
                    this.writeBytes(address, value >> 8, value & 0xFF);
                    return;
                default:
                    this.writeInt32(address, value);
            }
        };
        /**
         * @param limit: the maximum number of bytes to write
         * returns the number of bytes written
         */
        UlxImage.prototype.writeASCII = function (address, text, limit) {
            var bytes = [];
            for (var i = 0; i < text.length && i < limit; i++) {
                var c = text.charCodeAt(i);
                if (c > 255) {
                    c = 63; // '?'
                }
                bytes.push(c);
            }
            this.writeBytes.apply(this, __spreadArray([address], bytes));
            return bytes.length;
        };
        UlxImage.writeHeader = function (fields, m, offset) {
            if (offset === void 0) { offset = 0; }
            m.writeASCII(offset, fields.magic || 'Glul');
            m.writeInt32(offset + 4 /* VERSION_OFFSET */, fields.version);
            m.writeInt32(offset + 8 /* RAMSTART_OFFSET */, fields.ramStart);
            m.writeInt32(offset + 12 /* EXTSTART_OFFSET */, fields.extStart);
            m.writeInt32(offset + 16 /* ENDMEM_OFFSET */, fields.endMem);
            m.writeInt32(offset + 20 /* STACKSIZE_OFFSET */, fields.stackSize);
            m.writeInt32(offset + 24 /* STARTFUNC_OFFSET */, fields.startFunc);
            m.writeInt32(offset + 28 /* DECODINGTBL_OFFSET */, fields.decodingTbl);
            m.writeInt32(offset + 32 /* CHECKSUM_OFFSET */, fields.checksum);
        };
        /** Reloads the game file, discarding all changes that have been made
        * to RAM and restoring the memory map to its original size.
        *
        * Use the optional "protection" parameters to preserve a RAM region
        */
        UlxImage.prototype.revert = function (protectionStart, protectionLength) {
            if (protectionStart === void 0) { protectionStart = 0; }
            if (protectionLength === void 0) { protectionLength = 0; }
            var prot = this.copyProtectedRam(protectionStart, protectionLength);
            this.loadFromOriginal();
            if (prot) {
                var d = [];
                for (var i = 0; i < protectionLength; i++) {
                    d.push(prot.readByte(i));
                }
                this.writeBytes.apply(this, __spreadArray([protectionStart], d));
            }
        };
        UlxImage.prototype.copyProtectedRam = function (protectionStart, protectionLength) {
            var prot = null;
            if (protectionLength > 0) {
                if (protectionStart + protectionLength > this.getEndMem()) {
                    protectionLength = this.getEndMem() - protectionStart;
                }
                // can only protect RAM
                var start = protectionStart - this.ramstart;
                if (start < 0) {
                    protectionLength += start;
                    start = 0;
                }
                prot = this.memory.copy(start + this.ramstart, protectionLength);
            }
            return prot;
        };
        UlxImage.prototype.restoreFromQuetzal = function (quetzal, protectionStart, protectionLength) {
            if (protectionStart === void 0) { protectionStart = 0; }
            if (protectionLength === void 0) { protectionLength = 0; }
            // TODO: support compressed RAM
            var newRam = quetzal.getChunk('UMem');
            if (newRam) {
                var prot = this.copyProtectedRam(protectionStart, protectionLength);
                var r = new FyreVM.MemoryAccess(0);
                r.buffer = new Uint8Array(newRam);
                var length_2 = r.readInt32(0);
                this.setEndMem(length_2 + this.ramstart);
                var i = 4;
                var j = this.ramstart;
                while (i < newRam.byteLength) {
                    this.memory.writeByte(j++, r.readByte(i++));
                }
                if (prot) {
                    var d = [];
                    for (var i_2 = 0; i_2 < protectionLength; i_2++) {
                        d.push(prot.readByte(i_2));
                    }
                    this.writeBytes.apply(this, __spreadArray([protectionStart], d));
                }
            }
            else {
                throw new Error("Missing CMem/UMem blocks");
            }
        };
        return UlxImage;
    }());
    FyreVM.UlxImage = UlxImage;
})(FyreVM || (FyreVM = {}));
// slightly adapted from https://github.com/beatgammit/base64-js
var Base64;
// slightly adapted from https://github.com/beatgammit/base64-js
(function (Base64) {
    var lookup = [];
    var revLookup = [];
    function init() {
        var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        for (var i = 0, len = code.length; i < len; ++i) {
            lookup[i] = code[i];
            revLookup[code.charCodeAt(i)] = i;
        }
        revLookup['-'.charCodeAt(0)] = 62;
        revLookup['_'.charCodeAt(0)] = 63;
    }
    init();
    function toByteArray(b64) {
        var i, j, l, tmp, placeHolders, arr;
        var len = b64.length;
        if (len % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4');
        }
        // the number of equal signs (place holders)
        // if there are two placeholders, than the two characters before it
        // represent one byte
        // if there is only one, then the three characters before it represent 2 bytes
        // this is just a cheap hack to not do indexOf twice
        placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
        // base64 is 4/3 + up to two characters of the original data
        arr = new Uint8Array(len * 3 / 4 - placeHolders);
        // if there are placeholders, only get up to the last complete 4 chars
        l = placeHolders > 0 ? len - 4 : len;
        var L = 0;
        for (i = 0, j = 0; i < l; i += 4, j += 3) {
            tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
            arr[L++] = (tmp >> 16) & 0xFF;
            arr[L++] = (tmp >> 8) & 0xFF;
            arr[L++] = tmp & 0xFF;
        }
        if (placeHolders === 2) {
            tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
            arr[L++] = tmp & 0xFF;
        }
        else if (placeHolders === 1) {
            tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
            arr[L++] = (tmp >> 8) & 0xFF;
            arr[L++] = tmp & 0xFF;
        }
        return arr;
    }
    Base64.toByteArray = toByteArray;
    function tripletToBase64(num) {
        return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
    }
    function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i = start; i < end; i += 3) {
            tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
            output.push(tripletToBase64(tmp));
        }
        return output.join('');
    }
    function fromByteArray(uint8) {
        var tmp;
        var len = uint8.length;
        var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
        var output = '';
        var parts = [];
        var maxChunkLength = 16383; // must be multiple of 3
        // go through the array every three bytes, we'll deal with trailing stuff later
        for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
            parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
        }
        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
            tmp = uint8[len - 1];
            output += lookup[tmp >> 2];
            output += lookup[(tmp << 4) & 0x3F];
            output += '==';
        }
        else if (extraBytes === 2) {
            tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
            output += lookup[tmp >> 10];
            output += lookup[(tmp >> 4) & 0x3F];
            output += lookup[(tmp << 2) & 0x3F];
            output += '=';
        }
        parts.push(output);
        return parts.join('');
    }
    Base64.fromByteArray = fromByteArray;
})(Base64 || (Base64 = {}));
// Written in 2015 by Thilo Planz 
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
/// <reference path='MemoryAccess.ts' />
/// <reference path="../b64.ts" />
var FyreVM;
// Written in 2015 by Thilo Planz 
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
/// <reference path='MemoryAccess.ts' />
/// <reference path="../b64.ts" />
(function (FyreVM) {
    /// Implements the Quetzal saved-game file specification by holding a list of
    /// typed data chunks which can be read from or written to streams.
    /// http://www.ifarchive.org/if-archive/infocom/interpreters/specification/savefile_14.txt
    var Quetzal = /** @class */ (function () {
        function Quetzal() {
            this.chunks = {};
        }
        Quetzal.prototype.setChunk = function (name, value) {
            if (name.length != 4) {
                throw new Error("invalid chunk id " + name + ", must be four ASCII chars");
            }
            this.chunks[name] = value;
        };
        Quetzal.prototype.getChunk = function (name) {
            return this.chunks[name];
        };
        Quetzal.prototype.getIFhdChunk = function () {
            return this.getChunk('IFhd');
        };
        Quetzal.prototype.serialize = function () {
            // determine the buffer size
            var size = 12; // three int32 headers
            var chunks = this.chunks;
            for (var name_1 in chunks) {
                size += 4; // the key
                size += 4; // the value length
                size += chunks[name_1].byteLength;
            }
            var fileLength = size - 8;
            if (size % 2) {
                size++; // padding				
            }
            var m = new FyreVM.MemoryAccess(size);
            m.writeByte(size - 1, 0);
            m.writeASCII(0, 'FORM'); // IFF tag
            m.writeInt32(4, fileLength);
            m.writeASCII(8, 'IFZS'); // FORM sub-ID for Quetzal
            var pos = 12;
            for (var name_2 in chunks) {
                m.writeASCII(pos, name_2);
                var value = chunks[name_2];
                var len = value.byteLength;
                m.writeInt32(pos + 4, len);
                m.buffer.set(new Uint8Array(value), pos + 8);
                pos += 8 + len;
            }
            return m.buffer;
        };
        Quetzal.load = function (buffer) {
            var q = new Quetzal();
            var m = new FyreVM.MemoryAccess(0);
            m.buffer = buffer;
            var type = m.readASCII(0, 4);
            if (type !== 'FORM' && type !== 'LIST' && type !== 'CAT_') {
                throw new Error("invalid IFF type " + type);
            }
            var length = m.readInt32(4);
            if (buffer.byteLength < 8 + length) {
                throw new Error("Quetzal file is too short for ${length} bytes");
            }
            type = m.readASCII(8, 4);
            if (type !== 'IFZS') {
                throw new Error("invalid IFF sub-type " + type + ". Not a Quetzal file");
            }
            var pos = 12;
            var limit = 8 + length;
            while (pos < limit) {
                var name_3 = m.readASCII(pos, 4);
                length = m.readInt32(pos + 4);
                var value = m.buffer.subarray(pos + 8, pos + 8 + length);
                q.setChunk(name_3, value);
                pos += 8 + length;
            }
            return q;
        };
        /**
         * convenience method to encode a Quetzal file as Base64
         */
        Quetzal.prototype.base64Encode = function () {
            return Base64.fromByteArray(new Uint8Array(this.serialize()));
        };
        /**
         * convenience method to decode a Quetzal file from Base64
         */
        Quetzal.base64Decode = function (base64) {
            return Quetzal.load(Base64.toByteArray(base64));
        };
        return Quetzal;
    }());
    FyreVM.Quetzal = Quetzal;
})(FyreVM || (FyreVM = {}));
// Written from 2015 to 2016 by Thilo Planz and Andrew Plotkin
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
/// <reference path='Opcodes.ts' />
/// <reference path='Output.ts' />
/// <reference path='UlxImage.ts' />
/// <reference path='Quetzal.ts' />
var FyreVM;
// Written from 2015 to 2016 by Thilo Planz and Andrew Plotkin
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
/// <reference path='Opcodes.ts' />
/// <reference path='Output.ts' />
/// <reference path='UlxImage.ts' />
/// <reference path='Quetzal.ts' />
(function (FyreVM) {
    var CallStub = /** @class */ (function () {
        function CallStub() {
        }
        return CallStub;
    }());
    // coerce uint32 number into  (signed!) int32 range
    function int32(x) {
        if (x >= 0x80000000) {
            x = -(0xFFFFFFFF - x + 1);
        }
        return x;
    }
    function int16(x) {
        if (x >= 0x8000) {
            x = -(0xFFFF - x + 1);
        }
        return x;
    }
    function int8(x) {
        if (x >= 0x80) {
            x = -(0xFF - x + 1);
        }
        return x;
    }
    function uint8(x) {
        if (x < 0) {
            x = 255 + x + 1;
        }
        return x % 256;
    }
    function toASCII(x) {
        return String.fromCharCode(x >> 24, (x >> 16) & 0xFF, (x >> 8) & 0xFF, x & 0xFF);
    }
    var Engine = /** @class */ (function () {
        function Engine(gameFile) {
            this.outputBuffer = new FyreVM.OutputBuffer();
            // counters to measure performance
            this.cycle = 0;
            this.startTime = 0;
            this.printingDigit = 0; // bit number for compressed strings, digit for numbers
            this.protectionStart = 0;
            this.protectionLength = 0;
            this.veneer = {};
            // if turned off, no FyreVM functions are made available, just standard Glulx stuff
            this.enableFyreVM = true;
            this.glkMode = 0 /* None */;
            var major = gameFile.getMajorVersion();
            if (major < 2 || major > 3)
                throw new Error("Game version is out of the supported range");
            var minor = gameFile.getMinorVersion();
            if (major == 2 && minor < 0)
                throw new Error("Game version is out of the supported range");
            if (major == 3 && minor > 1)
                throw new Error("Game version is out of the supported range");
            this.image = gameFile;
            this.stack = new FyreVM.MemoryAccess(gameFile.getStackSize() * 4);
        }
        /**
         * clears the stack and initializes VM registers
         * from values found in RAM
         */
        Engine.prototype.bootstrap = function () {
            this.opcodes = FyreVM.Opcodes.initOpcodes();
            var mainfunc = this.image.getStartFunc();
            this.decodingTable = this.image.getDecodingTable();
            this.SP = this.FP = this.frameLen = this.localsPos = 0;
            this.outputSystem = 0 /* Null */;
            this.enterFunction(mainfunc);
        };
        /**
         *  Pushes a frame for a function call, updating FP, SP, and PC.
         *  (A call stub should have already been pushed.)
         */
        Engine.prototype.enterFunction = function (address) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a = this, image = _a.image, stack = _a.stack;
            this.execMode = 0 /* Code */;
            // push a call frame
            this.FP = this.SP;
            this.push(0); // temporary FrameLen
            this.push(0); // temporary LocalsPos
            // copy locals info into the frame
            var localSize = 0;
            for (var i = address + 1; true; i += 2) {
                var type = image.readByte(i);
                var count = image.readByte(i + 1);
                this.pushByte(type);
                this.pushByte(count);
                if (type === 0 || count === 0) {
                    this.PC = i + 2;
                    break;
                }
                if (localSize % type > 0) {
                    localSize += (type - (localSize % type));
                }
                localSize += type * count;
            }
            // padding
            while (this.SP % 4 > 0) {
                this.pushByte(0);
            }
            var sp = this.SP;
            var fp = this.FP;
            this.localsPos = sp - fp;
            // fill in localsPos
            stack.writeInt32(fp + 4, this.localsPos);
            var lastOffset = 0;
            if (args && args.length) {
                // copy initial values as appropriate
                var offset = 0;
                var size = 0;
                var count = 0;
                address++;
                for (var argnum = 0; argnum < args.length; argnum++) {
                    if (count === 0) {
                        size = image.readByte(address++);
                        count = image.readByte(address++);
                        if (size === 0 || count === 0)
                            break;
                        if (offset % size > 0) {
                            offset += (size - (offset % size));
                        }
                    }
                    // zero any padding space between locals
                    for (var i = lastOffset; i < offset; i++) {
                        stack.writeByte(sp + i, 0);
                    }
                    switch (size) {
                        case 1:
                            stack.writeByte(sp + offset, args[argnum]);
                            break;
                        case 2:
                            stack.writeInt16(sp + offset, args[argnum]);
                            break;
                        case 4:
                            stack.writeInt32(sp + offset, args[argnum]);
                            break;
                        default:
                            throw new Error("Illegal call param size " + size + " at position " + argnum);
                    }
                    offset += size;
                    lastOffset = offset;
                    count--;
                }
            }
            // zero any remaining local space
            for (var i = lastOffset; i < localSize; i++) {
                stack.writeByte(sp + i, 0);
            }
            sp += localSize;
            // padding
            while (sp % 4 > 0) {
                stack.writeByte(sp++, 0);
            }
            this.frameLen = sp - fp;
            stack.writeInt32(fp, sp - fp);
            this.SP = sp;
        };
        Engine.prototype.push = function (value) {
            this.stack.writeInt32(this.SP, value);
            this.SP += 4;
        };
        Engine.prototype.pop = function () {
            this.SP -= 4;
            return this.stack.readInt32(this.SP);
        };
        Engine.prototype.pushByte = function (value) {
            this.stack.writeByte(this.SP++, value);
        };
        Engine.prototype.pushCallStub = function (destType, destAddr, PC, framePtr) {
            this.push(destType);
            this.push(destAddr);
            this.push(PC);
            this.push(framePtr);
        };
        Engine.prototype.popCallStub = function () {
            var stub = new CallStub();
            stub.framePtr = this.pop();
            stub.PC = this.pop();
            stub.destAddr = this.pop();
            stub.destType = this.pop();
            return stub;
        };
        /**
         * executes a single cycle
         */
        Engine.prototype.step = function () {
            var image = this.image;
            this.cycle++;
            switch (this.execMode) {
                case 0 /* Code */:
                    // decode opcode number
                    var opnum = image.readByte(this.PC);
                    if (opnum >= 0xC0) {
                        opnum = image.readInt32(this.PC) - 0xC0000000;
                        this.PC += 4;
                    }
                    else if (opnum >= 0x80) {
                        opnum = image.readInt16(this.PC) - 0x8000;
                        this.PC += 2;
                    }
                    else {
                        this.PC++;
                    }
                    // look up opcode info
                    var opcode = this.opcodes[opnum];
                    if (!opcode) {
                        throw new Error("Unrecognized opcode " + opnum);
                    }
                    // decode load-operands
                    var opcount = opcode.loadArgs + opcode.storeArgs;
                    var operands = [];
                    if (opcode.rule === 3 /* DelayedStore */)
                        opcount++;
                    else if (opcode.rule === 4 /* Catch */)
                        opcount += 2;
                    var operandPos = Math.floor(this.PC + (opcount + 1) / 2);
                    for (var i = 0; i < opcode.loadArgs; i++) {
                        var type = void 0;
                        if (i % 2 === 0) {
                            type = image.readByte(this.PC) & 0xF;
                        }
                        else {
                            type = (image.readByte(this.PC++) >> 4) & 0xF;
                        }
                        operandPos += this.decodeLoadOperand(opcode, type, operands, operandPos);
                    }
                    // decode store-operands
                    var storePos = this.PC;
                    var resultTypes = [];
                    var resultAddrs = [];
                    for (var i = 0; i < opcode.storeArgs; i++) {
                        var type = i + opcode.loadArgs;
                        if (type % 2 === 0) {
                            type = image.readByte(this.PC) & 0xF;
                        }
                        else {
                            type = (image.readByte(this.PC++) >> 4) & 0xF;
                        }
                        resultTypes[i] = type;
                        operandPos += this.decodeStoreOperand(opcode, type, resultAddrs, operandPos);
                    }
                    if (opcode.rule === 3 /* DelayedStore */ || opcode.rule === 4 /* Catch */) {
                        var type = opcode.loadArgs + opcode.storeArgs;
                        if (type % 2 === 0) {
                            type = image.readByte(this.PC) & 0xF;
                        }
                        else {
                            type = (image.readByte(this.PC++) >> 4) & 0xF;
                        }
                        operandPos += this.decodeDelayedStoreOperand(opcode, type, operands, operandPos);
                    }
                    if (opcode.rule === 4 /* Catch */) {
                        // decode final load operand for @catch
                        var type = opcode.loadArgs + opcode.storeArgs + 1;
                        if (type % 2 === 0) {
                            type = image.readByte(this.PC) & 0xF;
                        }
                        else {
                            type = (image.readByte(this.PC++) >> 4) & 0xF;
                        }
                        operandPos += this.decodeLoadOperand(opcode, type, operands, operandPos);
                    }
                    //					console.info(opcode.name, operands, this.PC, operandPos);
                    // call opcode implementation
                    this.PC = operandPos; // after the last operanc				
                    var result = opcode.handler.apply(this, operands);
                    if (resultTypes.length === 1 || result === 'wait') {
                        result = [result];
                    }
                    // store results
                    if (result) {
                        // for asynchronous input, we need to stop right now
                        // until we are asked to resume
                        if ('wait' === result[0]) {
                            this.resumeAfterWait_resultTypes = resultTypes;
                            this.resumeAfterWait_resultAddrs = resultAddrs;
                            return 'wait';
                        }
                        this.storeResults(opcode.rule, resultTypes, resultAddrs, result);
                    }
                    break;
                case 2 /* CompressedString */:
                    // TODO: native decoding table
                    FyreVM.NextCompressedChar.call(this);
                    break;
                case 1 /* CString */:
                    FyreVM.NextCStringChar.call(this);
                    break;
                case 3 /* UnicodeString */:
                    FyreVM.NextUniStringChar.call(this);
                    break;
                case 4 /* Number */:
                    FyreVM.NextDigit.call(this);
                    break;
                default:
                    throw new Error("unsupported execution mode " + this.execMode);
            }
        };
        /**
         * Starts the interpreter.
         * This method does not return until the game finishes, either by
         * returning from the main function or with the quit opcode
         * (unless it is placed into "waiting" mode for asynchronous
         * user input. In this case, there will be a callback that resumes
         * execution)
         */
        Engine.prototype.run = function () {
            this.running = true;
            this.bootstrap();
            this.resumeAfterWait();
        };
        /**
         * @return how many extra bytes were read (so that operandPos can be advanced)
         */
        Engine.prototype.decodeLoadOperand = function (opcode, type, operands, operandPos) {
            var _a = this, image = _a.image, stack = _a.stack, FP = _a.FP, localsPos = _a.localsPos, frameLen = _a.frameLen;
            function loadLocal(address) {
                address += FP + localsPos;
                var maxAddress = FP + frameLen;
                switch (opcode.rule) {
                    case 1 /* Indirect8Bit */:
                        if (address > maxAddress)
                            throw new Error("Reading outside local storage bounds");
                        return stack.readByte(address);
                    case 2 /* Indirect16Bit */:
                        if (address + 1 > maxAddress)
                            throw new Error("Reading outside local storage bounds");
                        return stack.readInt16(address);
                    default:
                        if (address + 3 > maxAddress)
                            throw new Error("Reading outside local storage bounds");
                        return stack.readInt32(address);
                }
            }
            function loadIndirect(address) {
                switch (opcode.rule) {
                    case 1 /* Indirect8Bit */: return image.readByte(address);
                    case 2 /* Indirect16Bit */: return image.readInt16(address);
                    default: return image.readInt32(address);
                }
            }
            switch (type) {
                // immediates
                case 0 /* zero */:
                    operands.push(0);
                    return 0;
                case 1 /* byte */:
                    operands.push(int8(image.readByte(operandPos)));
                    return 1;
                case 2 /* int16 */:
                    operands.push(int16(image.readInt16(operandPos)));
                    return 2;
                case 3 /* int32 */:
                    operands.push(int32(image.readInt32(operandPos)));
                    return 4;
                // indirect
                case 5 /* ptr_8 */:
                    operands.push(loadIndirect(image.readByte(operandPos)));
                    return 1;
                case 6 /* ptr_16 */:
                    operands.push(loadIndirect(image.readInt16(operandPos)));
                    return 2;
                case 7 /* ptr_32 */:
                    operands.push(loadIndirect(image.readInt32(operandPos)));
                    return 4;
                // stack
                case 8 /* stack */:
                    if (this.SP <= this.FP + this.frameLen)
                        throw new Error("Stack underflow");
                    operands.push(this.pop());
                    return 0;
                // indirect from RAM
                case 13 /* ram_8 */:
                    operands.push(loadIndirect(image.getRamAddress(image.readByte(operandPos))));
                    return 1;
                case 14 /* ram_16 */:
                    operands.push(loadIndirect(image.getRamAddress(image.readInt16(operandPos))));
                    return 2;
                case 15 /* ram_32 */:
                    operands.push(loadIndirect(image.getRamAddress(image.readInt32(operandPos))));
                    return 4;
                // local storage
                case 9 /* local_8 */:
                    operands.push(loadLocal(image.readByte(operandPos)));
                    return 1;
                case 10 /* local_16 */:
                    operands.push(loadLocal(image.readInt16(operandPos)));
                    return 2;
                case 11 /* local_32 */:
                    operands.push(loadLocal(image.readInt32(operandPos)));
                    return 4;
                default: throw new Error("unsupported load operand type " + type);
            }
        };
        /**
         * @return how many extra bytes were read (so that operandPos can be advanced)
         */
        Engine.prototype.decodeStoreOperand = function (opcode, type, operands, operandPos) {
            switch (type) {
                case 0 /* discard */:
                case 8 /* stack */:
                    return 0;
                case 5 /* ptr_8 */:
                case 9 /* local_8 */:
                    operands.push(this.image.readByte(operandPos));
                    return 1;
                case 6 /* ptr_16 */:
                case 10 /* local_16 */:
                    operands.push(this.image.readInt16(operandPos));
                    return 2;
                case 7 /* ptr_32 */:
                case 11 /* local_32 */:
                    operands.push(this.image.readInt32(operandPos));
                    return 4;
                case 13 /* ram_8 */:
                    operands.push(this.image.getRamAddress(this.image.readByte(operandPos)));
                    return 1;
                case 14 /* ram_16 */:
                    operands.push(this.image.getRamAddress(this.image.readInt16(operandPos)));
                    return 2;
                case 15 /* ram_32 */:
                    operands.push(this.image.getRamAddress(this.image.readInt32(operandPos)));
                    return 4;
                default: throw new Error("unsupported store operand type " + type);
            }
        };
        /**
         * @return how many extra bytes were read (so that operandPos can be advanced)
         */
        Engine.prototype.decodeDelayedStoreOperand = function (opcode, type, operands, operandPos) {
            switch (type) {
                case 0 /* discard */:
                    operands.push(0 /* STORE_NULL */);
                    operands.push(0);
                    return 0;
                case 5 /* ptr_8 */:
                    operands.push(1 /* STORE_MEM */);
                    operands.push(this.image.readByte(operandPos));
                    return 1;
                case 6 /* ptr_16 */:
                    operands.push(1 /* STORE_MEM */);
                    operands.push(this.image.readInt16(operandPos));
                    return 2;
                case 7 /* ptr_32 */:
                    operands.push(1 /* STORE_MEM */);
                    operands.push(this.image.readInt32(operandPos));
                    return 4;
                case 8 /* stack */:
                    operands.push(3 /* STORE_STACK */);
                    operands.push(0);
                    return 0;
                case 9 /* local_8 */:
                    operands.push(2 /* STORE_LOCAL */);
                    operands.push(this.image.readByte(operandPos));
                    return 1;
                case 10 /* local_16 */:
                    operands.push(2 /* STORE_LOCAL */);
                    operands.push(this.image.readInt16(operandPos));
                    return 2;
                case 11 /* local_32 */:
                    operands.push(2 /* STORE_LOCAL */);
                    operands.push(this.image.readInt32(operandPos));
                    return 4;
                case 13 /* ram_8 */:
                    operands.push(1 /* STORE_MEM */);
                    operands.push(this.image.getRamAddress(this.image.readByte(operandPos)));
                    return 1;
                case 14 /* ram_16 */:
                    operands.push(1 /* STORE_MEM */);
                    operands.push(this.image.getRamAddress(this.image.readInt16(operandPos)));
                    return 2;
                case 15 /* ram_32 */:
                    operands.push(1 /* STORE_MEM */);
                    operands.push(this.image.getRamAddress(this.image.readInt32(operandPos)));
                    return 4;
                default: throw new Error("unsupported delayed store operand type " + type);
            }
        };
        Engine.prototype.performDelayedStore = function (type, address, value) {
            switch (type) {
                case 0 /* STORE_NULL */: return;
                case 1 /* STORE_MEM */:
                    this.image.writeInt32(address, value);
                    return;
                case 2 /* STORE_LOCAL */:
                    this.stack.writeInt32(this.FP + this.localsPos + address, value);
                    return;
                case 3 /* STORE_STACK */:
                    this.push(value);
                    return;
                default: throw new Error("unsupported delayed store mode " + type);
            }
        };
        Engine.prototype.storeResults = function (rule, resultTypes, resultAddrs, results) {
            for (var i = 0; i < results.length; i++) {
                var value = results[i];
                var type = resultTypes[i];
                switch (type) {
                    case 0 /* discard */: return;
                    case 5:
                    case 6:
                    case 7:
                    case 13:
                    case 14:
                    case 15:
                        // write to memory
                        this.image.write(rule, resultAddrs[i], value);
                        break;
                    case 8 /* stack */:
                        // push onto stack
                        this.push(value);
                        break;
                    case 9 /* local_8 */:
                    case 10 /* local_16 */:
                    case 11 /* local_32 */:
                        // write to local storage
                        var address = resultAddrs[i] + this.FP + this.localsPos;
                        var limit = this.FP + this.frameLen;
                        switch (rule) {
                            case 1 /* Indirect8Bit */:
                                if (address >= limit)
                                    throw new Error("writing outside local storage bounds");
                                this.stack.writeByte(address, value);
                                break;
                            case 2 /* Indirect16Bit */:
                                if (address + 1 >= limit)
                                    throw new Error("writing outside local storage bounds");
                                this.stack.writeInt16(address, value);
                                break;
                            default:
                                if (address + 3 >= limit)
                                    throw new Error("writing outside local storage bounds");
                                this.stack.writeInt32(address, value);
                                break;
                        }
                        break;
                    default: throw new Error("unsupported store result mode " + type + " for result " + i + " of " + results);
                }
            }
        };
        Engine.prototype.leaveFunction = function (retVal) {
            if (this.FP === 0) {
                // top-level function
                this.running = false;
                return;
            }
            this.SP = this.FP;
            this.resumeFromCallStub(retVal);
        };
        Engine.prototype.resumeFromCallStub = function (result) {
            var stub = this.popCallStub();
            this.PC = stub.PC;
            this.execMode = 0 /* Code */;
            var newFP = stub.framePtr;
            var newFrameLen = this.stack.readInt32(newFP);
            var newLocalsPos = this.stack.readInt32(newFP + 4);
            switch (stub.destType) {
                case 0 /* STORE_NULL */: break;
                case 1 /* STORE_MEM */:
                    this.image.writeInt32(stub.destAddr, result);
                    break;
                case 2 /* STORE_LOCAL */:
                    this.stack.writeInt32(newFP + newLocalsPos + stub.destAddr, result);
                    break;
                case 3 /* STORE_STACK */:
                    this.push(result);
                    break;
                case 11 /* RESUME_FUNC */:
                    // resume executing in the same call frame
                    // return to avoid changing FP
                    return;
                case 13 /* RESUME_CSTR */:
                    // resume printing a C-string
                    this.execMode = 1 /* CString */;
                    break;
                case 14 /* RESUME_UNISTR */:
                    // resume printing a Unicode string
                    this.execMode = 3 /* UnicodeString */;
                    break;
                case 12 /* RESUME_NUMBER */:
                    // resume printing a decimal number
                    this.execMode = 4 /* Number */;
                    this.printingDigit = stub.destAddr;
                    break;
                case 10 /* RESUME_HUFFSTR */:
                    // resume printing a compressed string
                    this.execMode = 2 /* CompressedString */;
                    this.printingDigit = stub.destAddr;
                    break;
                // TODO: the other return modes
                default:
                    throw new Error("unsupported return mode " + stub.destType);
            }
            this.FP = newFP;
            this.frameLen = newFrameLen;
            this.localsPos = newLocalsPos;
        };
        Engine.prototype.takeBranch = function (jumpVector) {
            if (jumpVector === 0 || jumpVector === 1) {
                this.leaveFunction(jumpVector);
            }
            else {
                this.PC += jumpVector - 2;
            }
        };
        Engine.prototype.performCall = function (address, args, destType, destAddr, stubPC, tailCall) {
            if (tailCall === void 0) { tailCall = false; }
            // intercept veneer calls
            var veneer = this.veneer[address];
            if (veneer) {
                this.performDelayedStore(destType, destAddr, veneer.apply(this, args));
                return;
            }
            if (tailCall) {
                // pop the current frame and use the call stub below it
                this.SP = this.FP;
            }
            else {
                // use a new call stub
                this.pushCallStub(destType, destAddr, stubPC, this.FP);
            }
            var type = this.image.readByte(address);
            if (type === 192 /* stack */) {
                this.enterFunction(address);
                if (!args) {
                    this.push(0);
                }
                else {
                    for (var i = args.length - 1; i >= 0; i--)
                        this.push(args[i]);
                    this.push(args.length);
                }
            }
            else if (type === 193 /* localStorage */) {
                if (!args) {
                    args = [];
                }
                this.enterFunction.apply(this, __spreadArray([address], args));
            }
            else {
                throw new Error("Invalid function call type " + type);
            }
        };
        Engine.prototype.streamCharCore = function (x) {
            this.streamUniCharCore(x & 0xFF);
        };
        Engine.prototype.streamUniCharCore = function (x) {
            if (this.outputSystem === 1 /* Filter */) {
                this.performCall(this.filterAddress, [x], 0 /* STORE_NULL */, 0, this.PC, false);
            }
            else {
                FyreVM.SendCharToOutput.call(this, x);
            }
        };
        Engine.prototype.streamNumCore = function (x) {
            x = x | 0;
            if (this.outputSystem === 1 /* Filter */) {
                this.pushCallStub(11 /* RESUME_FUNC */, 0, this.PC, this.FP);
                var num = x.toString();
                this.performCall(this.filterAddress, [num.charCodeAt(0)], 12 /* RESUME_NUMBER */, 1, x, false);
            }
            else {
                FyreVM.SendStringToOutput.call(this, x.toString());
            }
        };
        Engine.prototype.streamStrCore = function (address) {
            if (this.outputSystem == 0 /* Null */)
                return;
            var type = this.image.readByte(address);
            if (type === 0xE1 && !this.decodingTable)
                throw new Error("No string decoding table is set");
            // TODO: native decoding table
            // for now, just fall back to using ExecutionMode.CompressedString	  
            var fallbackEncoding = (type === 0xE1);
            if (this.outputSystem == 1 /* Filter */ || fallbackEncoding) {
                this.pushCallStub(11 /* RESUME_FUNC */, 0, this.PC, this.FP);
                switch (type) {
                    case 0xE0:
                        this.execMode = 1 /* CString */;
                        this.PC = address + 1;
                        return;
                    case 0xE1:
                        this.execMode = 2 /* CompressedString */;
                        this.PC = address + 1;
                        this.printingDigit = 0;
                        return;
                    case 0xE2:
                        this.execMode = 3 /* UnicodeString */;
                        this.PC = address + 4;
                        return;
                    default:
                        throw new Error("Invalid string type " + type + " at " + address);
                }
            }
            switch (type) {
                case 0xE0:
                    FyreVM.SendStringToOutput.call(this, this.image.readCString(address + 1));
                    return;
                default:
                    throw new Error("Invalid string type " + type + " at " + address);
            }
        };
        //  Sends the queued output to the OutputReady event handler.
        Engine.prototype.deliverOutput = function () {
            if (this.outputReady) {
                var pack = this.outputBuffer.flush();
                this.outputReady(pack);
            }
        };
        Engine.prototype.saveToQuetzal = function (destType, destAddr) {
            var quetzal = this.image.saveToQuetzal();
            // 'Stks' is the contents of the stack, with a stub on top
            // identifying the destination of the save opcode.
            this.pushCallStub(destType, destAddr, this.PC, this.FP);
            var trimmed = this.stack.copy(0, this.SP);
            quetzal.setChunk('Stks', trimmed.buffer);
            this.popCallStub();
            // 'MAll' is the list of heap blocks
            if (this.heap) {
                quetzal.setChunk('MAll', this.heap.save());
            }
            return quetzal;
        };
        Engine.prototype.loadFromQuetzal = function (quetzal) {
            // make sure the save file matches the game file
            var ifhd1 = new Uint8Array(quetzal.getIFhdChunk());
            if (ifhd1.byteLength !== 128) {
                throw new Error('Missing or invalid IFhd block');
            }
            var image = this.image;
            for (var i = 0; i < 128; i++) {
                if (ifhd1[i] !== image.readByte(i))
                    throw new Error("Saved game doesn't match this story file");
            }
            // load the stack
            var newStack = quetzal.getChunk("Stks");
            if (!newStack) {
                throw new Error("Missing Stks block");
            }
            this.stack.buffer.set(new Uint8Array(newStack));
            this.SP = newStack.byteLength;
            // restore RAM
            image.restoreFromQuetzal(quetzal);
            // pop a call stub to restore registers
            var stub = this.popCallStub();
            this.PC = stub.PC;
            this.FP = stub.framePtr;
            this.frameLen = this.stack.readInt32(this.FP);
            this.localsPos = this.stack.readInt32(this.FP + 4);
            this.execMode = 0 /* Code */;
            // restore the heap if available
            var heapChunk = quetzal.getChunk("MAll");
            if (heapChunk) {
                this.heap = FyreVM.HeapAllocator.restore(heapChunk, image['memory']);
            }
            // give the original save opcode a result of -1
            // to show that it's been restored
            this.performDelayedStore(stub.destType, stub.destAddr, 0xFFFFFFFF);
        };
        /**  Reloads the initial contents of memory (except the protected area)
        * and starts the game over from the top of the main function.
        */
        Engine.prototype.restart = function () {
            this.image.revert(this.protectionStart, this.protectionLength);
            this.bootstrap();
        };
        Engine.prototype.fyreCall = function (call, x, y) {
            if (!this.enableFyreVM)
                throw new Error("FyreVM functionality has been disabled");
            switch (call) {
                case 1 /* ReadLine */:
                    this.deliverOutput();
                    return this.inputLine(x, y);
                case 2 /* ReadKey */:
                    this.deliverOutput();
                    return this.inputChar();
                case 3 /* ToLower */:
                    return String.fromCharCode(uint8(x)).toLowerCase().charCodeAt(0);
                case 4 /* ToUpper */:
                    return String.fromCharCode(uint8(x)).toUpperCase().charCodeAt(0);
                case 5 /* Channel */:
                    x = toASCII(x);
                    this.outputBuffer.setChannel(x);
                    return;
                case 6 /* SetVeneer */:
                    return FyreVM.setSlotFyre.call(this, x, y) ? 1 : 0;
                case 8 /* SetStyle */:
                    // ignore
                    return 1;
                case 7 /* XMLFilter */:
                    // ignore
                    return 1;
                default:
                    throw new Error("Unrecognized FyreVM system call " + call + "(" + x + "," + y + ")");
            }
        };
        Engine.prototype.inputLine = function (address, bufSize) {
            // we need at least 4 bytes to do anything useful
            if (bufSize < 4) {
                console.warn("buffer size ${bufSize} to small to input line");
                return;
            }
            var image = this.image;
            var resume = this.resumeAfterWait.bind(this);
            // can't do anything without this event handler
            if (!this.lineWanted) {
                this.image.writeInt32(address, 0);
                return;
            }
            // ask the application to read a line
            var callback = function (line) {
                if (line && line.length) {
                    // TODO? handle Unicode
                    // write the length first
                    image.writeInt32(address, line.length);
                    // followed by the character data, truncated to fit the buffer
                    image.writeASCII(address + 4, line, bufSize - 4);
                }
                else {
                    image.writeInt32(address, 0);
                }
                resume();
            };
            this.lineWanted(callback);
            return 'wait';
        };
        Engine.prototype.inputChar = function () {
            // can't do anything without this event handler
            if (!this.keyWanted) {
                return 0;
            }
            var resume = this.resumeAfterWait.bind(this);
            // ask the application to read a character
            var callback = function (line) {
                if (line && line.length) {
                    resume([line.charCodeAt(0)]);
                }
                else {
                    resume([0]);
                }
            };
            this.keyWanted(callback);
            return 'wait';
        };
        Engine.prototype.resumeAfterWait = function (result) {
            this.cycle = 0;
            this.startTime = Date.now();
            if (result) {
                this.storeResults(null, this.resumeAfterWait_resultTypes, this.resumeAfterWait_resultAddrs, result);
                this.resumeAfterWait_resultAddrs = this.resumeAfterWait_resultTypes = null;
            }
            while (this.running) {
                if (this.step() === 'wait')
                    return;
            }
            // send any output that may be left
            this.deliverOutput();
        };
        return Engine;
    }());
    FyreVM.Engine = Engine;
})(FyreVM || (FyreVM = {}));
// Written in 2015 and 2016 by Thilo Planz 
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
/**
 * A wrapper around Engine that can be communicates
 * via simple JSON-serializable messages.
 *
 */
/// <reference path='Engine.ts' />
var FyreVM;
// Written in 2015 and 2016 by Thilo Planz 
// To the extent possible under law, I have dedicated all copyright and related and neighboring rights 
// to this software to the public domain worldwide. This software is distributed without any warranty. 
// http://creativecommons.org/publicdomain/zero/1.0/
/**
 * A wrapper around Engine that can be communicates
 * via simple JSON-serializable messages.
 *
 */
/// <reference path='Engine.ts' />
(function (FyreVM) {
    var EngineWrapper = /** @class */ (function () {
        function EngineWrapper(gameImage, canSaveGames) {
            var _this = this;
            if (canSaveGames === void 0) { canSaveGames = false; }
            this.canSaveGames = canSaveGames;
            var engine = this.engine = new FyreVM.Engine(new FyreVM.UlxImage(gameImage));
            // set up the callbacks
            engine.outputReady =
                function (channelData) {
                    _this.channelData = channelData;
                };
            engine.keyWanted =
                function (cb) { return _this.waitState(cb, 52 /* waitingForKeyInput */); };
            engine.lineWanted =
                function (cb) { return _this.waitState(cb, 51 /* waitingForLineInput */); };
            engine.saveRequested =
                function (quetzal, cb) {
                    if (!_this.canSaveGames) {
                        return cb(false);
                    }
                    _this.waitState(cb, 53 /* waitingForGameSavedConfirmation */);
                    _this.gameBeingSaved = quetzal;
                };
            engine.loadRequested =
                function (cb) {
                    if (!_this.canSaveGames) {
                        return cb(null);
                    }
                    _this.waitState(cb, 54 /* waitingForLoadSaveGame */);
                };
        }
        /**
         * convenience method to construct from an ArrayBuffer
         */
        EngineWrapper.loadFromArrayBuffer = function (arrayBuffer, canSaveGames) {
            if (canSaveGames === void 0) { canSaveGames = false; }
            var image = new FyreVM.MemoryAccess(0, 0);
            image.buffer = new Uint8Array(arrayBuffer);
            image['maxSize'] = arrayBuffer.byteLength;
            return new EngineWrapper(image, canSaveGames);
        };
        /**
         * convenience method to construct from a FileReaderEvent
         * (which is supposed to have been successful)
         */
        EngineWrapper.loadFromFileReaderEvent = function (ev, canSaveGames) {
            if (canSaveGames === void 0) { canSaveGames = false; }
            return EngineWrapper.loadFromArrayBuffer(ev.target['result'], canSaveGames);
        };
        /**
        * convenience method to construct from a Base64 encoded string containing the game image
        */
        EngineWrapper.loadFromBase64 = function (base64, canSaveGames) {
            if (canSaveGames === void 0) { canSaveGames = false; }
            return EngineWrapper.loadFromArrayBuffer(Base64.toByteArray(base64).buffer, canSaveGames);
        };
        EngineWrapper.prototype.waitState = function (resumeCallback, state) {
            this.resumeCallback = resumeCallback;
            this.engineState = state;
        };
        EngineWrapper.prototype.run = function () {
            this.engineState = 2 /* running */;
            this.engine.run();
            return this.currentState();
        };
        EngineWrapper.prototype.currentState = function () {
            // check if the game is over
            if (this.engineState === 2 /* running */
                && !this.engine['running']) {
                this.engineState = 100 /* completed */;
            }
            switch (this.engineState) {
                case 100 /* completed */:
                case 52 /* waitingForKeyInput */:
                case 51 /* waitingForLineInput */:
                    return {
                        state: this.engineState,
                        channelData: this.channelData,
                    };
                case 53 /* waitingForGameSavedConfirmation */:
                    return {
                        state: this.engineState,
                        gameBeingSaved: this.gameBeingSaved
                    };
                case 54 /* waitingForLoadSaveGame */:
                    return {
                        state: this.engineState
                    };
                default:
                    console.error("Unexpected engine state: " + this.engineState);
                    return {
                        state: this.engineState
                    };
            }
        };
        EngineWrapper.prototype.receiveLine = function (line) {
            if (this.engineState !== 51 /* waitingForLineInput */)
                throw new Error("Illegal state, engine is not waiting for line input");
            this.engineState = 2 /* running */;
            this.resumeCallback(line);
            return this.currentState();
        };
        EngineWrapper.prototype.receiveKey = function (line) {
            if (this.engineState !== 52 /* waitingForKeyInput */)
                throw new Error("Illegal state, engine is not waiting for key input");
            this.engineState = 2 /* running */;
            this.resumeCallback(line);
            return this.currentState();
        };
        EngineWrapper.prototype.receiveSavedGame = function (quetzal) {
            if (this.engineState !== 54 /* waitingForLoadSaveGame */)
                throw new Error("Illegal state, engine is not waiting for a saved game to be loaded");
            this.engineState = 2 /* running */;
            this.resumeCallback(quetzal);
            return this.currentState();
        };
        EngineWrapper.prototype.saveGameDone = function (success) {
            if (this.engineState !== 53 /* waitingForGameSavedConfirmation */)
                throw new Error("Illegal state, engine is not waiting for a game to be saved");
            this.gameBeingSaved = null;
            this.engineState = 2 /* running */;
            this.resumeCallback(success);
            return this.currentState();
        };
        EngineWrapper.prototype.getIFhd = function () {
            return this.engine['image']['memory'].copy(0, 128).buffer;
        };
        EngineWrapper.prototype.getUndoState = function () {
            var undoBuffers = this.engine['undoBuffers'];
            if (undoBuffers && undoBuffers[undoBuffers.length - 1]) {
                return undoBuffers[undoBuffers.length - 1];
            }
            return null;
        };
        /**
         * convenience method to run "restore" and then
         * feed it the given savegame
         */
        EngineWrapper.prototype.restoreSaveGame = function (quetzal) {
            var state = this.receiveLine("restore");
            if (state.state !== 54 /* waitingForLoadSaveGame */)
                throw new Error("Illegal state, engine did not respond to RESTORE command");
            return this.receiveSavedGame(quetzal);
        };
        /**
         * convenience method to run "save"
         */
        EngineWrapper.prototype.saveGame = function () {
            var state = this.receiveLine("save");
            if (state.state !== 53 /* waitingForGameSavedConfirmation */)
                throw new Error("Illegal state, engine did not respond to SAVE command");
            var game = state.gameBeingSaved;
            this.saveGameDone(true);
            return game;
        };
        return EngineWrapper;
    }());
    FyreVM.EngineWrapper = EngineWrapper;
})(FyreVM || (FyreVM = {}));
/*
 FyreVMWeb.ts

 Main Module to run FyreVM web engine (glulx-typescript).

 Exposes OutputReady event for web page to get data.
 Exposes sendCommand function for web pages to execute command.

 */
System.register("FyreVMWeb", [], function (exports_1, context_1) {
    "use strict";
    var fyrevm, FyreVMWeb;
    var __moduleName = context_1 && context_1.id;
    function isEnterKey(e) {
        return e.code == "Enter";
    }
    return {
        setters: [],
        execute: function () {/*
             FyreVMWeb.ts
            
             Main Module to run FyreVM web engine (glulx-typescript).
            
             Exposes OutputReady event for web page to get data.
             Exposes sendCommand function for web pages to execute command.
            
             */
            /// <reference path='glulx-typescript/core/EngineWrapper.ts' />
            fyrevm = {};
            (function (FyreVMWeb) {
                var States;
                (function (States) {
                    States[States["INIT"] = 0] = "INIT";
                    States[States["RESTORE_SESSION"] = 1] = "RESTORE_SESSION";
                    States[States["NEW_SESSION"] = 2] = "NEW_SESSION";
                    States[States["WAITING_FOR_KEY"] = 3] = "WAITING_FOR_KEY";
                    States[States["WAITING_FOR_LINE"] = 4] = "WAITING_FOR_LINE";
                    States[States["COMMAND"] = 5] = "COMMAND";
                    States[States["SAVE"] = 6] = "SAVE";
                    States[States["UPDATE_SESSION"] = 7] = "UPDATE_SESSION";
                })(States = FyreVMWeb.States || (FyreVMWeb.States = {}));
                var StoryStatus;
                (function (StoryStatus) {
                    StoryStatus[StoryStatus["CONTINUE"] = 0] = "CONTINUE";
                    StoryStatus[StoryStatus["ENDED"] = 1] = "ENDED";
                })(StoryStatus = FyreVMWeb.StoryStatus || (FyreVMWeb.StoryStatus = {}));
                var Manager = /** @class */ (function () {
                    function Manager() {
                    }
                    Manager.prototype.SetState = function (state) {
                        this.State = state;
                        switch (state) {
                            case States.INIT:
                                this.Init();
                                break;
                            case States.NEW_SESSION:
                                this.NewSession();
                                break;
                            case States.RESTORE_SESSION:
                                this.RestoreSession();
                                break;
                            case States.WAITING_FOR_LINE:
                                break;
                            case States.COMMAND:
                                this.SendCommand(this.InputElement.value);
                                break;
                            case States.SAVE:
                                this.SaveGame();
                                break;
                        }
                    };
                    Manager.prototype.LoadStory = function (url) {
                        var _this = this;
                        if (this.InputElement == undefined) {
                            throw "FyreVM.Manager.InputElement must be defined before loading a story.";
                        }
                        this.InputElement.onkeypress = function (e) {
                            if (_this.State == States.WAITING_FOR_KEY) {
                                _this.SetState(States.COMMAND);
                            }
                            else if (_this.State == States.WAITING_FOR_LINE) {
                                if (e.keyCode == 13 || isEnterKey(e)) {
                                    _this.SetState(States.COMMAND);
                                }
                            }
                        };
                        var reader = new XMLHttpRequest();
                        reader.open('GET', url);
                        reader.responseType = 'arraybuffer';
                        reader.onreadystatechange = function () {
                            if (reader.readyState === XMLHttpRequest.DONE) {
                                _this.wrapper = FyreVM.EngineWrapper.loadFromArrayBuffer(reader.response, true);
                                var run = _this.wrapper.run();
                                _this.ProcessResult(run);
                                _this.SetState(States.INIT);
                            }
                        };
                        reader.send();
                    };
                    Manager.prototype.GetSaveData = function () {
                        var saveKey = this.SaveKey();
                        var saveData = localStorage[saveKey];
                        if (saveData) {
                            saveData = JSON.parse(saveData);
                        }
                        return saveData;
                    };
                    Manager.prototype.Init = function () {
                        var saveData = this.GetSaveData();
                        if (!saveData) {
                            this.SetState(States.NEW_SESSION);
                        }
                        else {
                            this.SetState(States.RESTORE_SESSION);
                        }
                    };
                    Manager.prototype.NewSession = function () {
                        var saveKey = this.SaveKey();
                        localStorage[saveKey] = JSON.stringify(this.NewSaveGame());
                        this.UpdateTurnData();
                        this.OutputReady();
                        this.SetState(States.WAITING_FOR_LINE);
                    };
                    Manager.prototype.RestoreSession = function () {
                        var result = this.wrapper.receiveLine('restore');
                        if (result.state != 54 /* waitingForLoadSaveGame */) {
                            console.error('Error restoring saved game', result);
                        }
                        result = this.LoadSavedGame();
                        if (result.state != 51 /* waitingForLineInput */) {
                            console.error('Error restoring saved game', result);
                        }
                        this.SetState(States.WAITING_FOR_LINE);
                        this.UpdateTurnData();
                        this.OutputReady();
                    };
                    Manager.prototype.ProcessResult = function (result) {
                        if (result.channelData) {
                            this.ChannelData = result.channelData;
                        }
                        this.UpdateContent();
                    };
                    Manager.prototype.SendCommand = function (command) {
                        this.UpdateCommand(command);
                        console.log(command);
                        var result = this.wrapper.receiveLine(command);
                        this.ProcessCommand(result);
                    };
                    Manager.prototype.ProcessCommand = function (result) {
                        this.Status = FyreVMWeb.StoryStatus.CONTINUE;
                        this.ProcessResult(result);
                        if (this.State == States.COMMAND) {
                            this.UpdateStory(result);
                            this.UpdateTurnData();
                            this.OutputReady();
                        }
                        switch (result.state) {
                            case 52 /* waitingForKeyInput */:
                                if (this.State == States.COMMAND) {
                                    this.SetState(States.SAVE);
                                }
                                else {
                                    this.SetState(States.WAITING_FOR_KEY);
                                }
                                break;
                            case 51 /* waitingForLineInput */:
                                if (this.State == States.COMMAND) {
                                    this.SetState(States.SAVE);
                                }
                                else {
                                    this.SetState(States.WAITING_FOR_LINE);
                                }
                                break;
                            case 100 /* completed */:
                                this.Status = FyreVMWeb.StoryStatus.ENDED;
                                break;
                            case 54 /* waitingForLoadSaveGame */:
                                this.LoadSavedGame();
                                break;
                            case 53 /* waitingForGameSavedConfirmation */:
                                this.UpdateSavedGame(result);
                                break;
                        }
                    };
                    Manager.prototype.NewSaveGame = function () {
                        var storyInfo = JSON.parse(this.ChannelData['INFO']);
                        var ifid = this.GetIFID();
                        var content = "<b>Title: </b>" + storyInfo['storyTitle'] + "<br/>\n                <b>Headline: </b>" + storyInfo['storyHeadline'];
                        return {
                            story: {
                                'ifid': ifid,
                                'title': storyInfo['storyTitle'],
                                'storyInfo': storyInfo,
                                'storyFile': ''
                            },
                            'sessions': [
                                {
                                    'session': 1,
                                    'turns': 1,
                                    'content': [
                                        { 'turn': 1, 'command': '', 'content': content }
                                    ],
                                    'data': []
                                }
                            ]
                        };
                    };
                    Manager.prototype.SaveGame = function () {
                        this.ProcessCommand(this.wrapper.receiveLine('save'));
                    };
                    Manager.prototype.LoadSavedGame = function () {
                        var saveData = this.GetSaveData();
                        var turns = saveData['sessions'][0]['turns'];
                        var saveGameData = saveData['sessions'][0]['data'][turns]['data'];
                        var quetzalData = FyreVM.Quetzal.load(Base64.toByteArray(saveGameData));
                        return this.wrapper.receiveSavedGame(quetzalData);
                    };
                    Manager.prototype.UpdateSavedGame = function (result) {
                        var saveKey = this.SaveKey();
                        var saveDataStr = localStorage[saveKey];
                        var saveData = null;
                        if (!saveDataStr) {
                            saveData = this.NewSaveGame();
                        }
                        else {
                            saveData = JSON.parse(saveDataStr);
                        }
                        var turns = saveData['sessions'][0]['turns'];
                        saveData['sessions'][0]['data'][turns] = {
                            'turn': turns, 'data': result.gameBeingSaved.base64Encode()
                        };
                        localStorage[saveKey] = JSON.stringify(saveData);
                        this.ProcessCommand(this.wrapper.saveGameDone(true));
                    };
                    Manager.prototype.LoadSession = function () {
                        var saveKey = this.SaveKey();
                        var saveData = localStorage[saveKey];
                        saveData = JSON.parse(saveData);
                        var session = saveData['sessions'][0];
                        return session;
                    };
                    Manager.prototype.SaveSession = function (session) {
                        var saveKey = this.SaveKey();
                        var saveData = localStorage[saveKey];
                        saveData = JSON.parse(saveData);
                        saveData['sessions'][0] = session;
                        localStorage[saveKey] = JSON.stringify(saveData);
                    };
                    Manager.prototype.UpdateCommand = function (command) {
                        var session = this.LoadSession();
                        session['turns']++;
                        session['content'].push({
                            turn: session['turns'],
                            command: command,
                            content: ''
                        });
                        this.SaveSession(session);
                    };
                    Manager.prototype.UpdateStory = function (result) {
                        if (result.channelData && result.channelData['MAIN']) {
                            var content = result.channelData['MAIN'];
                            var session = this.LoadSession();
                            var turn = session['turns'];
                            session['content'][turn - 1]['content'] = content;
                            this.SaveSession(session);
                        }
                    };
                    Manager.prototype.UpdateTurnData = function () {
                        var saveKey = this.SaveKey();
                        var saveData = localStorage[saveKey];
                        if (!saveData) {
                            return;
                        }
                        saveData = JSON.parse(saveData);
                        var content = saveData['sessions'][0]['content'];
                        fyrevm['content'] = content;
                    };
                    Manager.prototype.SaveKey = function () {
                        return this.GetIFID();
                    };
                    Manager.prototype.GetIFID = function () {
                        if (!this.ifid) {
                            this.ifid = this.ChannelData['IFID'].replace(/\//g, '');
                        }
                        return this.ifid;
                    };
                    Manager.prototype.GetChannelName = function (x) {
                        return String.fromCharCode(x >> 24, (x >> 16) & 0xFF, (x >> 8) & 0xFF, x & 0xFF);
                    };
                    Manager.prototype.UpdateContent = function () {
                        if (this.ChannelData["CMGT"] != undefined || this.contentDefinition != undefined) {
                            //
                            // We only get the content definition on first turn... (may need to revisit this)
                            //
                            if (this.contentDefinition == undefined) {
                                this.contentDefinition = JSON.parse(this.ChannelData["CMGT"]);
                            }
                            for (var channelName in this.ChannelData) {
                                for (var ch = 0; ch < this.contentDefinition.length; ch++) {
                                    var channelDef = this.contentDefinition[ch];
                                    var chanName = this.GetChannelName(channelDef['id']);
                                    if (chanName == channelName) {
                                        switch (channelDef['contentType']) {
                                            case "text":
                                                fyrevm[channelDef['contentName']] = this.ChannelData[channelName];
                                                break;
                                            case "number":
                                                fyrevm[channelDef['contentName']] = Number(this.ChannelData[channelName]);
                                                break;
                                            case "json":
                                                fyrevm[channelDef['contentName']] = JSON.parse(this.ChannelData[channelName]);
                                                break;
                                            case "css":
                                                fyrevm[channelDef['contentName']] = this.ChannelData[channelName];
                                                break;
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    };
                    return Manager;
                }());
                FyreVMWeb.Manager = Manager;
            })(FyreVMWeb || (FyreVMWeb = {}));
            exports_1("FyreVMWeb", FyreVMWeb);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnlyZVZNV2ViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vZ2x1bHgtdHlwZXNjcmlwdC9tZXJzZW5uZS10d2lzdGVyLnRzIiwiLi4vZ2x1bHgtdHlwZXNjcmlwdC9jb3JlL0dsa1dyYXBwZXIudHMiLCIuLi9nbHVseC10eXBlc2NyaXB0L2NvcmUvVmVuZWVyLnRzIiwiLi4vZ2x1bHgtdHlwZXNjcmlwdC9jb3JlL09wY29kZXMudHMiLCIuLi9nbHVseC10eXBlc2NyaXB0L2NvcmUvT3V0cHV0LnRzIiwiLi4vZ2x1bHgtdHlwZXNjcmlwdC9jb3JlL01lbW9yeUFjY2Vzcy50cyIsIi4uL2dsdWx4LXR5cGVzY3JpcHQvY29yZS9VbHhJbWFnZS50cyIsIi4uL2dsdWx4LXR5cGVzY3JpcHQvYjY0LnRzIiwiLi4vZ2x1bHgtdHlwZXNjcmlwdC9jb3JlL1F1ZXR6YWwudHMiLCIuLi9nbHVseC10eXBlc2NyaXB0L2NvcmUvRW5naW5lLnRzIiwiLi4vZ2x1bHgtdHlwZXNjcmlwdC9jb3JlL0VuZ2luZVdyYXBwZXIudHMiLCIuLi9GeXJlVk1XZWIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQTs7OztHQUlHO0FBRUg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQXFCRTtBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQXlDRTtBQUVGO0lBWUMseUJBQVksSUFBWTtRQVZ4Qix1QkFBdUI7UUFDZixNQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ1IsTUFBQyxHQUFHLEdBQUcsQ0FBQztRQUNSLGFBQVEsR0FBRyxVQUFVLENBQUMsQ0FBRyx1QkFBdUI7UUFDaEQsZUFBVSxHQUFHLFVBQVUsQ0FBQyxDQUFDLCtCQUErQjtRQUN4RCxlQUFVLEdBQUcsVUFBVSxDQUFDLENBQUMsOEJBQThCO1FBRXZELE9BQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQ0FBb0M7UUFDNUQs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QUFJLENBQUMsQ0FBQyxFQUFFO2dCQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7YUFBRTtZQUN2RCxJQUFJLENBQUMsSUFBRSxVQUFVO2dCQUFFLENBQUMsR0FBQyxDQUFDLENBQUM7U0FDeEI7UUFDRCxLQUFLLENBQUMsR0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDO2tCQUMxRyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0I7WUFDdkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxnQ0FBZ0M7WUFDbkQsQ0FBQyxFQUFFLENBQUM7WUFDSixJQUFJLENBQUMsSUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFO2dCQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUFDLENBQUMsR0FBQyxDQUFD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QUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3ZCLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLElBQUcsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLENBQUEsQ0FBQyxDQUFDLENBQUM7WUFFekQsd0JBQXdCO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3ZCLFNBQVMsR0FBRyxDQUFDLENBQUM7Z0JBQ2QsT0FBTyxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUFBLENBQUMsQ0FBQyxDQUFDO1lBRXJDLDREQUE0RDtZQUM1RCxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUMxQixTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFHLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFDO1lBRTlELDREQUE0RDtZQUM1RCxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN6QixTQUFTLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFHLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFDO1lBRTdELDREQUE0RDtZQUM1RCxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUMxQixTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFHLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFB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QyxFQUFFLENBQUMsRUFBRSxVQUFVO2dCQUM1QixJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDeEIsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVO2dCQUM1QixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDeEIsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVO2dCQUM1QixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDeEIsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVO2dCQUM1QixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDeEIsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVO2dCQUM1QixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBRUYsNERBQTREO1lBQzVELE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3pCLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVTtnQkFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQztvQkFDUixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBRUYsNERBQTREO1lBQzVELE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3pCLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVTtnQkFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBRUYsNERBQTREO1lBQzVELE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3pCLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVTtnQkFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQztvQkFDUixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBRUYsNERBQTREO1lBQzVELE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3pCLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVTtnQkFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBR0YsTUFBTSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDN0IsU0FBUyxPQUFPLENBQUMsT0FBTztnQkFDdkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUM7WUFDbkIsQ0FBQyxDQUNELENBQUM7WUFFRixNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN4QixTQUFTLElBQUksQ0FBQyxPQUFjLEVBQUUsSUFBVyxFQUFFLFFBQWUsRUFBRSxRQUFlO2dCQUMxRSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ2QsT0FBTSxJQUFJLEVBQUUsRUFBQztvQkFDWixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO2lCQUNyQjtnQkFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDOUQsQ0FBQyx1QkFFRCxDQUFBO1lBRUQsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDMUIsU0FBUyxLQUFLLENBQUMsT0FBYyxFQUFFLFFBQWUsRUFBRSxRQUFlO2dCQUM5RCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDOUQsQ0FBQyx1QkFFRCxDQUFBO1lBRUQsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDM0IsU0FBUyxNQUFNLENBQUMsT0FBYyxFQUFFLEdBQVcsRUFBRSxRQUFlLEVBQUUsUUFBZTtnQkFDNUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN2RSxDQUFDLHVCQUVELENBQUE7WUFFRCxNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUM1QixTQUFTLE9BQU8sQ0FBQyxPQUFjLEVBQUUsSUFBWSxFQUFFLElBQVksRUFBRSxRQUFlLEVBQUUsUUFBZTtnQkFDNUYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEYsQ0FBQyx1QkFFRCxDQUFBO1lBRUQsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDN0IsU0FBUyxRQUFRLENBQUMsT0FBYyxFQUFFLElBQVksRUFBRSxJQUFZLEVBQUUsSUFBWSxFQUFFLFFBQWUsRUFBRSxRQUFlO2dCQUMzRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEcsQ0FBQyx1QkFFRCxDQUFBO1lBRUQsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDMUIsU0FBUyxPQUFPLENBQUMsTUFBYTtnQkFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNwQyxDQUFDLENBQUMsQ0FBQTtZQUVILE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3pCLFNBQVMsTUFBTSxDQUFDLFFBQWUsRUFBRSxRQUFlLEVBQUUsT0FBYztnQkFDL0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN2RCw2REFBNkQ7Z0JBQ3JELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDL0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUN6QixDQUFDLGdCQUVELENBQUE7WUFFRCxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN6QixTQUFTLE1BQU0sQ0FBQyxFQUFFLEVBQUUsVUFBVTtnQkFDN0IsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEVBQUU7b0JBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztnQkFDdEQsc0RBQXNEO2dCQUN0RCxJQUFJLENBQUMsRUFBRSxHQUFHLFVBQVUsQ0FBQztnQkFFckIsd0JBQXdCO2dCQUN4QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQzlCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUVuRCwyREFBMkQ7Z0JBQzNELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFNUQsQ0FBQyxDQUNELENBQUE7WUFFRCxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUM1QixTQUFTLFFBQVEsQ0FBQyxPQUFlLEVBQUUsSUFBWTtnQkFDOUMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNkLE9BQU0sSUFBSSxFQUFFLEVBQUM7b0JBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztpQkFDdEI7Z0JBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hELENBQUMsQ0FBQyxDQUFDO1lBRUosTUFBTSxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDOUIsVUFBUyxJQUFJLEVBQUUsS0FBSztnQkFDbkIsT0FBQSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQyxDQUFDO1lBRUosTUFBTSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDL0IsVUFBUyxJQUFJLEVBQUUsS0FBSztnQkFDbkIsT0FBQSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVDLENBQUMsQ0FBQyxDQUFDO1lBRUosTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDeEIsU0FBUyxJQUFJLENBQUMsQ0FBUTtnQkFDckIsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsQ0FBQyxDQUFDLENBQUM7WUFFSixNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN6QixTQUFTLEtBQUssQ0FBQyxDQUFRO2dCQUN0QixPQUFPLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDbkIsQ0FBQyx3QkFBMkIsQ0FBQztZQUU5QixNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN6QixTQUFTLEtBQUssQ0FBQyxDQUFRO2dCQUN0QixPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDakIsQ0FBQyx1QkFBMEIsQ0FBQztZQUU3QixNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN4QixTQUFTLElBQUksQ0FBQyxDQUFRO2dCQUNyQixPQUFPLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUM7WUFDN0QsQ0FBQyxDQUFDLENBQUM7WUFFSixNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN4QixTQUFTLElBQUksQ0FBQyxDQUFRO2dCQUNyQixPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUM7WUFDM0QsQ0FBQyxDQUFDLENBQUM7WUFFSixNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN6QixTQUFTLEtBQUssQ0FBQyxLQUFhLEVBQUUsS0FBYTtnQkFDMUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFDLENBQUMsR0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1lBRUosTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDMUIsU0FBUyxNQUFNLENBQUMsS0FBYSxFQUFFLEtBQWE7Z0JBQzNDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBQyxDQUFDLEdBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNwRCxDQUFDLENBQUMsQ0FBQztZQUVKLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQzFCLFNBQVMsTUFBTSxDQUFDLEtBQWEsRUFBRSxLQUFhO2dCQUMzQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNqRCxDQUFDLENBQUMsQ0FBQztZQUVKLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQzVCLFNBQVMsUUFBUSxDQUFDLEtBQWEsRUFBRSxLQUFhO2dCQUM3QyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNyQixJQUFJLElBQUksR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7Z0JBQ3BCLElBQUksS0FBSyxJQUFJLENBQUMsRUFBQztvQkFDZCxPQUFPLElBQUksQ0FBQyxLQUFLLElBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3RCO3FCQUFJO29CQUNKLE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsS0FBSyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDL0I7Z0JBQ0QsSUFBSSxJQUFJLEdBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUMsQ0FBQztZQUVKLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQzFCLFNBQVMsTUFBTSxDQUFDLEtBQWEsRUFBRSxLQUFhLEVBQUUsS0FBYTtnQkFDMUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFDLENBQUMsR0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDNUQsQ0FBQyxDQUNELENBQUM7WUFFRixNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUMzQixTQUFTLE9BQU8sQ0FBQyxLQUFhLEVBQUUsS0FBYSxFQUFFLEtBQWE7Z0JBQzNELEtBQUssR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDO2dCQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxHQUFDLEtBQUssRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUUsQ0FBQztZQUNqRSxDQUFDLENBQ0QsQ0FBQztZQUVGLE1BQU0sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQzNCLFNBQVMsT0FBTyxDQUFDLEtBQWEsRUFBRSxLQUFhLEVBQUUsS0FBYTtnQkFDM0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFFLENBQUM7WUFDbkQsQ0FBQyxDQUNELENBQUM7WUFFRixNQUFNLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUM3QixTQUFTLFNBQVMsQ0FBQyxLQUFhLEVBQUUsS0FBYSxFQUFFLEtBQWE7Z0JBQzdELEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksSUFBSSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztnQkFDcEIsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFDO29CQUNkLE9BQU8sSUFBSSxDQUFDLEtBQUssSUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDdEI7cUJBQUk7b0JBQ0osT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxLQUFLLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUMvQjtnQkFDRCxJQUFJLElBQUksR0FBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDekMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFDO29CQUNmLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO2lCQUNyQjtxQkFBSTtvQkFDSixJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7aUJBQ3BCO2dCQUNELElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQ0QsQ0FBQztZQUVGLE1BQU0sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBQSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRWxFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBQSxNQUFNLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFFeEUsTUFBTSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFaEUsTUFBTSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFaEUsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDeEIsU0FBUyxHQUFHLENBQUMsSUFBVyxFQUFFLElBQVk7Z0JBQ3JDLFFBQU8sSUFBSSxDQUFDLE9BQU8sRUFBQztvQkFDbkI7d0JBQ0MsNkNBQTZDO3dCQUM3QyxPQUFNLElBQUksRUFBRSxFQUFDOzRCQUNaLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzt5QkFDWDt3QkFDRCxPQUFPLENBQUMsQ0FBQztvQkFDVjt3QkFDRyxPQUFPLE9BQUEsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNoRDt3QkFDQyxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF1QixJQUFJLENBQUMsT0FBUyxDQUFDLENBQUM7aUJBQ3hEO1lBQ0YsQ0FBQyxDQUNELENBQUM7WUFFRixNQUFNLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUNqQyxTQUFTLFlBQVk7Z0JBQ3BCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUMzQixDQUFDLENBQ0QsQ0FBQztZQUVGLE1BQU0sQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ2pDLFNBQVMsWUFBWSxDQUFDLElBQUk7Z0JBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQzNCLENBQUMsQ0FDRCxDQUFDO1lBSUYsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDN0IsU0FBUyxRQUFRO2dCQUNoQixRQUFPLElBQUksQ0FBQyxZQUFZLEVBQUM7b0JBQ3hCLGlCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztvQkFDakMsbUJBQW9CLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDckQscUJBQXNCLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxnQkFBaUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ2pDO1lBQ0YsQ0FBQyxDQUNELENBQUM7WUFFRixNQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUM3QixTQUFTLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSTtnQkFDN0IsUUFBTyxNQUFNLEVBQUM7b0JBQ2IsS0FBSyxDQUFDO3dCQUNMLElBQUksQ0FBQyxZQUFZLGVBQWdCLENBQUM7d0JBQ2xDLE9BQU87b0JBQ1IsS0FBSyxDQUFDO3dCQUNMLElBQUksQ0FBQyxZQUFZLGlCQUFrQixDQUFDO3dCQUNwQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzt3QkFDMUIsT0FBTztvQkFDUixLQUFLLENBQUM7d0JBQ0wsSUFBSSxJQUFJLENBQUMsT0FBTyxvQkFBb0I7NEJBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQzt3QkFDN0QsSUFBSSxDQUFDLFlBQVksY0FBZSxDQUFDO3dCQUNqQyxPQUFPO29CQUNSLEtBQUssRUFBRTt3QkFDTixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVk7NEJBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQzt3QkFDckQsSUFBSSxDQUFDLFlBQVksbUJBQW9CLENBQUM7d0JBQ3RDLE9BQU87b0JBQ1I7d0JBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBOEIsTUFBUSxDQUFDLENBQUM7aUJBQ3pEO1lBQ0YsQ0FBQyxDQUNELENBQUM7WUFFRixNQUFNLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUMvQixTQUFTLFVBQVU7Z0JBQ2xCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUMvQixDQUFDLENBQ0QsQ0FBQztZQUVGLE1BQU0sQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQy9CLFNBQVMsVUFBVSxDQUFDLElBQUk7Z0JBQ3ZCLElBQUksSUFBSSxDQUFDLElBQUk7b0JBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO2dCQUN2RSxJQUFHO29CQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMzQixPQUFPLENBQUMsQ0FBQztpQkFDVDtnQkFDRCxPQUFPLENBQUMsRUFBQztvQkFDUixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQixPQUFPLENBQUMsQ0FBQztpQkFDVDtZQUVGLENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDMUIsU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU87O2dCQUM1QixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ2YsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdEIsT0FBTSxLQUFLLEVBQUUsRUFBQztvQkFDYixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNkO2dCQUNELENBQUEsS0FBQSxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsVUFBVSwwQkFBQyxPQUFPLEdBQUssS0FBSyxHQUFFO1lBQzFDLENBQUMsQ0FDRCxDQUFDO1lBR0YsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDMUIsU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFOztnQkFDN0IsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNkLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBQyxJQUFJLEdBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFDO29CQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2xDO2dCQUNELENBQUEsS0FBQSxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsVUFBVSwwQkFBQyxFQUFFLEdBQUssSUFBSSxHQUFFO1lBQ3BDLENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDM0IsU0FBUyxNQUFNLENBQUMsSUFBSTtnQkFDbkIsSUFBSSxJQUFJLElBQUksQ0FBQztvQkFDWixPQUFPLENBQUMsQ0FBQztnQkFDVixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUM7b0JBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDN0I7Z0JBQ0QsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLE9BQUEsYUFBYSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFDO29CQUNYLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDaEM7Z0JBQ0QsT0FBTyxDQUFDLENBQUM7WUFDVixDQUFDLENBQ0QsQ0FBQztZQUVGLE1BQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQzFCLFNBQVMsS0FBSyxDQUFDLE9BQU87Z0JBQ3JCLElBQUksSUFBSSxDQUFDLElBQUksRUFBQztvQkFDYixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDeEIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBQzt3QkFDaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7d0JBQzFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO3FCQUNqQjtpQkFDRDtZQUVILENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBRXpELE1BQU0sQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUV6RCxNQUFNLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFFekQsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDNUIsU0FBUyxRQUFRO2dCQUNoQixPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xELENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDM0IsU0FBUyxPQUFPLENBQUMsR0FBRztnQkFDbkIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUE7Z0JBQ3JDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVE7b0JBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDcEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQ0QsQ0FBQztZQUVGLE1BQU0sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQzNCLFNBQVMsT0FBTyxDQUFDLEdBQUc7Z0JBQ25CLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7b0JBQzFDLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNuQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNkLENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDM0IsU0FBUyxPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVE7Z0JBQy9CLHVDQUF1QztnQkFDdkMsSUFBSSxLQUFLLEtBQUssQ0FBQztvQkFDZCxPQUFPO2dCQUNSLFFBQVEsSUFBSSxLQUFLLENBQUM7Z0JBQ2xCLElBQUksUUFBUSxLQUFLLENBQUM7b0JBQ2pCLE9BQU87Z0JBQ1IsK0RBQStEO2dCQUNyRCxJQUFJLFFBQVEsR0FBRyxDQUFDO29CQUN4QixRQUFRLElBQUksS0FBSyxDQUFDO2dCQUNwQixJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUUsS0FBSztvQkFDakQsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUNmLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUM7b0JBQzdCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7aUJBQ3ZCO2dCQUNELEtBQUssSUFBSSxDQUFDLEdBQUMsUUFBUSxFQUFFLENBQUMsR0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUM7b0JBQ2pDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7aUJBQ3ZCO2dCQUNELE9BQU0sS0FBSyxDQUFDLE1BQU0sRUFBQztvQkFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztpQkFDdkI7Z0JBQ0QsT0FBTSxLQUFLLENBQUMsTUFBTSxFQUFDO29CQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2lCQUN2QjtZQUNGLENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFDMUIsU0FBUyxPQUFPLENBQUMsS0FBSztnQkFDckIsSUFBSSxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDOUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztnQkFDNUIsT0FBTSxLQUFLLEVBQUUsRUFBQztvQkFDYixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7b0JBQ3RDLEtBQUssSUFBRyxDQUFDLENBQUM7aUJBQ1Y7WUFDRixDQUFDLENBQUMsQ0FBQztZQUVKLE1BQU0sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQzVCLFNBQVMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHO2dCQUM3QixRQUFPLFFBQVEsRUFBQztvQkFDZix5QkFBeUIsQ0FBQyxDQUFDLDBCQUFzQjtvQkFDakQsd0JBQXdCLENBQUMsQ0FBQyxvQkFBcUI7b0JBQy9DLHVCQUF1QjtvQkFDdkIscUJBQXFCO29CQUNyQixxQkFBcUI7b0JBQ3JCLG9CQUFvQjtvQkFDbkIsa0JBQWtCO29CQUNuQixzQkFBcUI7b0JBQ3JCO3dCQUNFLE9BQU8sQ0FBQyxDQUFDO29CQUNYO3dCQUNDLE9BQU8sQ0FBQyxDQUFDO29CQUNWO3dCQUNDLElBQUksR0FBRyxLQUFLLENBQUM7NEJBQUUsT0FBTyxDQUFDLENBQUMsQ0FBRSxVQUFVO3dCQUNwQyxJQUFJLEdBQUcsS0FBSyxDQUFDOzRCQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUUsU0FBUzt3QkFDbkMsSUFBSSxHQUFHLEtBQUssRUFBRSxJQUFJLElBQUksQ0FBQyxZQUFZOzRCQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsYUFBYTt3QkFDNUQsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLG9CQUFvQjs0QkFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU07d0JBQ2xFLE9BQU8sQ0FBQyxDQUFDO29CQUNWO3dCQUNDLElBQUksSUFBSSxDQUFDLElBQUk7NEJBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzt3QkFDNUMsT0FBTyxDQUFDLENBQUM7b0JBQ1Y7d0JBQ0MsT0FBTyxDQUFDLENBQUM7b0JBQ1Y7d0JBQ0MsT0FBTyxDQUFDLENBQUM7aUJBQ1Y7WUFDRixDQUFDLENBQ0QsQ0FBQztZQUdGLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3pCLFNBQVMsSUFBSSxLQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFM0MsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFekQsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDekIsU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLFFBQWUsRUFBRSxRQUFlO2dCQUNoRCxtREFBbUQ7Z0JBQ25ELElBQUksTUFBTSxHQUFXLElBQUksQ0FBQztnQkFDMUIsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFDO29CQUN4QixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDakQsSUFBSSxRQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRTdDLElBQUksUUFBUSxHQUFHLFVBQVMsT0FBZTt3QkFDdEMsSUFBSSxPQUFPLEVBQUM7NEJBQ1gsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDckQ7NkJBQUk7NEJBQ0osTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDckQ7d0JBQ0QsUUFBTSxFQUFFLENBQUM7b0JBQ1YsQ0FBQyxDQUFBO29CQUNELE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUNsQyxJQUFJLElBQUksR0FBUSxNQUFNLENBQUM7b0JBQ3ZCLE9BQU8sSUFBSSxDQUFDO2lCQUNaO2dCQUNELE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEQsQ0FBQyx1QkFFRCxDQUFBO1lBRUQsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDNUIsU0FBUyxPQUFPLENBQUMsQ0FBQyxFQUFFLFFBQWUsRUFBRSxRQUFlO2dCQUNuRCxtREFBbUQ7Z0JBQ25ELElBQUksTUFBTSxHQUFXLElBQUksQ0FBQztnQkFDMUIsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFDO29CQUN4QixJQUFJLFFBQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDN0MsSUFBSSxRQUFRLEdBQUcsVUFBUyxPQUFlO3dCQUN0QyxJQUFJLE9BQU8sRUFBQzs0QkFDWCxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUNoQyxRQUFNLEVBQUUsQ0FBQzs0QkFDVCxPQUFPO3lCQUNQO3dCQUNELE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3JELFFBQU0sRUFBRSxDQUFDO29CQUNWLENBQUMsQ0FBQTtvQkFDRCxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMvQixJQUFJLElBQUksR0FBUSxNQUFNLENBQUM7b0JBQ3ZCLE9BQU8sSUFBSSxDQUFDO2lCQUNaO2dCQUNELE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEQsQ0FBQyx1QkFFRCxDQUFBO1lBRUQsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDN0IsU0FBUyxRQUFRLENBQUMsUUFBZSxFQUFFLFFBQWU7Z0JBQ2pELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUUvQyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUM7b0JBQ3BCLHdDQUF3QztvQkFDeEMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUM7d0JBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7cUJBQzNCO29CQUNELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6QjtxQkFBSTtvQkFDSixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUUsQ0FBQyxDQUFFLENBQUM7aUJBQ3pCO2dCQUNELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xELENBQUMsdUJBQTBCLENBQUM7WUFFNUIsTUFBTSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDaEMsU0FBUyxXQUFXLENBQUMsUUFBZSxFQUFFLFFBQWU7Z0JBQ3BELElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBQztvQkFDL0MsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDL0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDeEI7cUJBQUk7b0JBQ0osSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ2hEO1lBRUYsQ0FBQyx1QkFBMEIsQ0FBQztZQUc3QixNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUM1QixTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTTtnQkFDN0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBQztvQkFDbEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7b0JBQzdCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7aUJBQy9CO1lBQ0YsQ0FBQyxDQUNELENBQUE7WUFFRCxNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUM1Qiw4REFBOEQ7WUFDOUQsK0NBQStDO1lBQy9DLDhEQUE4RDtZQUM5RCxTQUFTLE9BQU87Z0JBQ2YsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTTtvQkFBRSxPQUFPLENBQUMsQ0FBQztnQkFDMUQsT0FBTyxDQUFDLENBQUM7WUFDVixDQUFDLENBQ0QsQ0FBQTtZQUVELE1BQU0sQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2hDLGdIQUFnSDtZQUNoSCxTQUFTLFdBQVc7Z0JBQ25CLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBQztvQkFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztpQkFDdkI7WUFDRixDQUFDLENBQ0QsQ0FBQTtZQUdELE1BQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQzNCLFNBQVMsTUFBTSxDQUFDLEdBQUc7Z0JBQ2xCLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssVUFBVTtvQkFDbEMsT0FBTyxDQUFDLENBQUM7Z0JBRVYsSUFBSSxNQUFNLEdBQW9CLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQzFDLElBQUksQ0FBQyxNQUFNLEVBQUM7b0JBQ1gsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztpQkFDN0M7Z0JBQ0QsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFDO29CQUNiLE9BQU8sTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUM5QjtnQkFFRCxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUM7b0JBQ1gsT0FBUSxNQUFNLENBQUUsQ0FBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ25EO2dCQUNELE9BQU8sTUFBTSxDQUFDLGFBQWEsRUFBRSxHQUFHLEdBQUcsQ0FBQztZQUNyQyxDQUFDLENBQ0QsQ0FBQztZQUVGLE1BQU0sQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQzdCLFNBQVMsU0FBUyxDQUFDLElBQUk7Z0JBQ3RCLElBQUksQ0FBQyxJQUFJO29CQUFFLElBQUksR0FBRyxTQUFTLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUNELENBQUM7WUFFRixNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU1RCxPQUFPLE9BQU8sQ0FBQztRQUNoQixDQUFDO1FBL3VCZSxtQkFBVyxjQSt1QjFCLENBQUE7SUFDRixDQUFDLEVBanZCYSxPQUFPLEdBQVAsY0FBTyxLQUFQLGNBQU8sUUFpdkJwQjtJQVFELFNBQVMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsT0FBTztRQUMzRixJQUFJLE9BQU8sNEJBQWtDO1lBQzVDLE1BQU0sSUFBSSxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQztRQUNoRixJQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sc0JBQTRCLENBQUM7WUFDeEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO1FBQ3JGLElBQUksV0FBVyxHQUFHLE9BQU8sc0JBQTRCLENBQUM7UUFDdEQsSUFBSSxHQUFHLEdBQUUsQ0FBQyxFQUFFLElBQUksR0FBRyxVQUFVLENBQUM7UUFDOUIsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFDaEIsT0FBTyxHQUFHLEdBQUcsSUFBSSxFQUFDO1lBQ2pCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdkMsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssR0FBRyxLQUFLLEdBQUMsVUFBVSxHQUFHLFNBQVMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDOUYsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFDO2dCQUNiLFdBQVc7Z0JBQ1gsSUFBSSxXQUFXO29CQUFFLE9BQU8sS0FBSyxDQUFDO2dCQUM5QixPQUFPLEtBQUssR0FBQyxLQUFLLEdBQUMsVUFBVSxDQUFDO2FBQzlCO1lBQ0QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFDO2dCQUNYLElBQUksR0FBRyxLQUFLLENBQUM7YUFDYjtpQkFBSTtnQkFDSixHQUFHLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQzthQUNoQjtTQUNEO1FBQ0QsZUFBZTtRQUNmLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBR0QsU0FBUyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPO1FBQzNGLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxzQkFBNEIsQ0FBQztZQUN4RCxNQUFNLElBQUksS0FBSyxDQUFDLGtFQUFrRSxDQUFDLENBQUM7UUFDckYsSUFBSSxXQUFXLEdBQUcsT0FBTyxzQkFBNEIsQ0FBQztRQUN0RCxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBQztZQUN0RCxJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxHQUFHLENBQUMsR0FBQyxVQUFVLEdBQUcsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMxRixJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUM7Z0JBQ2IsV0FBVztnQkFDWCxJQUFJLFdBQVc7b0JBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQzFCLE9BQU8sS0FBSyxHQUFDLENBQUMsR0FBQyxVQUFVLENBQUM7YUFDMUI7WUFDRCxJQUFJLE9BQU8sNEJBQWtDLEVBQUM7Z0JBQzdDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxHQUFHLENBQUMsR0FBQyxVQUFVLEdBQUcsU0FBUyxFQUFFLE9BQU8sQ0FBQyxFQUFDO29CQUNuRSxNQUFNO2lCQUNOO2FBQ0Q7U0FDRDtRQUNELGVBQWU7UUFDZixPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELFNBQVMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxPQUFPO1FBQy9FLElBQUksT0FBTyxzQkFBNEI7WUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO1FBQzFFLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNqQixHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUNoQixPQUFPLElBQUksRUFBQztZQUNYLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEdBQUcsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMxRSxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUM7Z0JBQ2IsV0FBVztnQkFDWCxPQUFPLElBQUksQ0FBQzthQUNaO1lBQ0QsSUFBSSxPQUFPLDRCQUFrQyxFQUFDO2dCQUM3QyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksR0FBRyxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQUM7b0JBQ25ELE9BQU8sQ0FBQyxDQUFDO2lCQUNUO2FBQ0Q7WUFDRCx3QkFBd0I7WUFDeEIsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBQyxVQUFVLENBQUMsQ0FBQztTQUM3QztJQUNGLENBQUM7SUFFRCxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSTtRQUMvQixPQUFNLElBQUksRUFBRSxFQUFDO1lBQ1osSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDMUMsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELFNBQVMsV0FBVyxDQUFDLEtBQVksRUFBRSxhQUFxQixFQUFFLE9BQWUsRUFBRSxPQUFlO1FBQ25GLElBQUEsS0FBSyxHQUFLLElBQUksTUFBVCxDQUFVO1FBQ3JCLElBQUksT0FBTyxzQkFBNEIsRUFBQztZQUN2Qyx1QkFBdUI7WUFDZCxzREFBc0Q7WUFDOUQsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBQztnQkFDN0IsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7Z0JBQ3pDLElBQUksRUFBRSxHQUFHLEVBQUU7b0JBQ1YsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLEVBQUUsR0FBRyxFQUFFO29CQUNWLE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7WUFDRCxPQUFPLENBQUMsQ0FBQztTQUNUO1FBRUQsMkJBQTJCO1FBQ3JCLDhGQUE4RjtRQUNwRyxJQUFJLElBQUksQ0FBQztRQUNULFFBQU8sT0FBTyxFQUFDO1lBQ2QsS0FBSyxDQUFDO2dCQUNMLElBQUksR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNyQyxLQUFLLElBQUksSUFBSSxDQUFDO2dCQUNkLE9BQU8sS0FBSyxHQUFHLElBQUksQ0FBQztZQUNyQixLQUFLLENBQUM7Z0JBQ0wsSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3RDLEtBQUssSUFBSSxNQUFNLENBQUM7Z0JBQ2hCLE9BQU8sS0FBSyxHQUFHLElBQUksQ0FBQztZQUNyQixLQUFLLENBQUM7Z0JBQ0wsSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsUUFBUSxDQUFDO2dCQUNqRCxLQUFLLElBQUksUUFBUSxDQUFDO2dCQUNsQixPQUFPLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDckIsS0FBSyxDQUFDO2dCQUNMLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUN0QyxPQUFPLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDckI7SUFFRixDQUFDO0FBQ0YsQ0FBQyxFQW45Qk0sTUFBTSxLQUFOLE1BQU0sUUFtOUJaO0FDNTlCRCxrQ0FBa0M7QUFDbEMsdUdBQXVHO0FBQ3ZHLHVHQUF1RztBQUN2RyxvREFBb0Q7QUFFcEQsc0NBQXNDO0FBR3RDLElBQU8sTUFBTSxDQTRPWjtBQXBQRCxrQ0FBa0M7QUFDbEMsdUdBQXVHO0FBQ3ZHLHVHQUF1RztBQUN2RyxvREFBb0Q7QUFFcEQsc0NBQXNDO0FBR3RDLFdBQU8sTUFBTTtJQWNaLFNBQWdCLGdCQUFnQixDQUFDLENBQVM7UUFDekMsUUFBTyxJQUFJLENBQUMsWUFBWSxFQUFDO1lBQ3hCLGlCQUFrQixDQUFDLENBQUMsT0FBTztZQUMzQjtnQkFDQyw4REFBOEQ7Z0JBQzlELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsT0FBTztZQUNSO2dCQUNDLElBQUksSUFBSSxDQUFDLE9BQU8sb0JBQW9CO29CQUNuQyxPQUFBLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsT0FBTztTQUVSO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBNkIsSUFBSSxDQUFDLFlBQWMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFkZSx1QkFBZ0IsbUJBYy9CLENBQUE7SUFFRCxTQUFnQixrQkFBa0IsQ0FBQyxDQUFTO1FBQzNDLFFBQU8sSUFBSSxDQUFDLFlBQVksRUFBQztZQUN4QixpQkFBa0IsQ0FBQyxDQUFDLE9BQU87WUFDM0I7Z0JBQ0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLE9BQU87WUFDUjtnQkFDQyxJQUFJLElBQUksQ0FBQyxPQUFPLG9CQUFvQjtvQkFDbkMsT0FBQSxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDL0IsT0FBTztTQUNSO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBNkIsSUFBSSxDQUFDLFlBQWMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFaZSx5QkFBa0IscUJBWWpDLENBQUE7SUFzQkQ7OztPQUdHO0lBQ0gsU0FBZ0Isa0JBQWtCO1FBQ2pDLElBQUksTUFBTSxHQUFXLElBQUksQ0FBQztRQUNyQixJQUFBLEtBQUssR0FBSSxNQUFNLE1BQVYsQ0FBVztRQUNyQixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLDBCQUE2QixDQUFDLENBQUM7UUFFNUUsT0FBTyxJQUFJLEVBQUM7WUFDWCxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDdEMsUUFBTyxRQUFRLEVBQUM7Z0JBQ2Y7b0JBQ0MsSUFBSSx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsRUFBQzt3QkFDbkMsSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVztxQkFDM0M7eUJBQUk7d0JBQ0osSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVO3FCQUN4QztvQkFDRCxNQUFNO2dCQUNQO29CQUNDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0IsT0FBTztnQkFDUix1QkFBMEI7Z0JBQzFCO29CQUNDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSx5QkFBNEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM5RixJQUFJLElBQUksQ0FBQyxZQUFZLG1CQUFvQixFQUFDO3dCQUN6QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBRSxDQUFDLENBQUUsMkJBQTZCLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUNwRzt5QkFBSTt3QkFDSixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUMvQjtvQkFDRCxPQUFPO2dCQUNSO29CQUNDLElBQUksSUFBSSxDQUFDLFlBQVksbUJBQW9CLEVBQUM7d0JBQ3pDLElBQUksQ0FBQyxZQUFZLDBCQUE0QixJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNuRixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQzt3QkFDZixJQUFJLENBQUMsUUFBUSxrQkFBd0IsQ0FBQztxQkFDdEM7eUJBQUk7d0JBQ0osa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3FCQUM1RDtvQkFDRCxPQUFPO2dCQUNSLDZCQUE2QjtnQkFDN0I7b0JBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBNEMsUUFBVSxDQUFDLENBQUM7YUFDekU7U0FDRDtJQUNGLENBQUM7SUF6Q2UseUJBQWtCLHFCQXlDakMsQ0FBQTtJQUdELFNBQVMsdUJBQXVCLENBQUMsTUFBTTtRQUN0QyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO1FBQ3RGLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN2QixJQUFJLE1BQU0sQ0FBQyxhQUFhLEtBQUssQ0FBQyxFQUFDO1lBQzlCLE1BQU0sQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQztTQUNaO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDZixDQUFDO0lBRUQsU0FBZ0IsZUFBZTtRQUM5QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN4QyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUM7WUFDWixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsT0FBTztTQUNQO1FBQ0QsSUFBSSxJQUFJLENBQUMsWUFBWSxtQkFBb0IsRUFBQztZQUN6QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUMsd0JBQTJCLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDaEY7YUFBSTtZQUNKLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3JCO0lBQ0YsQ0FBQztJQVhlLHNCQUFlLGtCQVc5QixDQUFBO0lBRUQsU0FBZ0IsaUJBQWlCO1FBQ2hDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLElBQUksRUFBRSxLQUFLLENBQUMsRUFBQztZQUNaLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixPQUFPO1NBQ1A7UUFDRCxJQUFJLElBQUksQ0FBQyxZQUFZLG1CQUFvQixFQUFDO1lBQ3pDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsQ0FBQywwQkFBNkIsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNsRjthQUFJO1lBQ0osZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDckI7SUFDRixDQUFDO0lBWmUsd0JBQWlCLG9CQVloQyxDQUFBO0lBRUQsU0FBZ0IsU0FBUztRQUN4QixJQUFJLENBQUMsR0FBVSxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2xDLElBQUksSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFDO1lBQ2pDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3RDLElBQUksSUFBSSxDQUFDLFlBQVksbUJBQW9CLEVBQUM7Z0JBQ3pDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsMEJBQTZCLElBQUksQ0FBQyxhQUFhLEdBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNuSDtpQkFBSTtnQkFDSixrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2FBQ3JCO1NBQ0Q7YUFBSTtZQUNKLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMzQjtJQUNGLENBQUM7SUFiZSxnQkFBUyxZQWF4QixDQUFBO0lBa0JEO1FBQUE7WUFFQyw2QkFBNkI7WUFDN0Isb0VBQW9FO1lBQ3BFLDRDQUE0QztZQUVwQyxZQUFPLEdBQUcsTUFBTSxDQUFDO1lBRWpCLGdCQUFXLEdBQWlCO2dCQUNsQyxJQUFJLEVBQUUsRUFBRTthQUNULENBQUE7UUE0Q0YsQ0FBQztRQTFDQSxpQ0FBVSxHQUFWO1lBQ0MsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3JCLENBQUM7UUFFRDs7O1VBR0U7UUFDRixpQ0FBVSxHQUFWLFVBQVcsQ0FBUztZQUNuQixJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsT0FBTztnQkFBRSxPQUFPO1lBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxLQUFLLE1BQU0sRUFBQztnQkFDaEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDekI7UUFDRixDQUFDO1FBRUQ7OztXQUdHO1FBQ0gsNEJBQUssR0FBTCxVQUFNLENBQVM7WUFDZCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUVEOzs7V0FHRztRQUNILDRCQUFLLEdBQUw7WUFDTSxJQUFBLFdBQVcsR0FBSSxJQUFJLFlBQVIsQ0FBUztZQUN6QixJQUFJLENBQUMsR0FBZ0IsRUFBRSxDQUFDO1lBQ3hCLEtBQUssSUFBSSxDQUFDLElBQUksV0FBVyxFQUFFO2dCQUMxQixJQUFJLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxFQUFDO29CQUNMLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ1QsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztpQkFDcEI7YUFDRDtZQUNELE9BQU8sQ0FBQyxDQUFDO1FBQ1YsQ0FBQztRQUdGLG1CQUFDO0lBQUQsQ0FBQyxBQXRERCxJQXNEQztJQXREWSxtQkFBWSxlQXNEeEIsQ0FBQTtBQUVGLENBQUMsRUE1T00sTUFBTSxLQUFOLE1BQU0sUUE0T1o7QUNwUEQsb0RBQW9EO0FBQ3BELHVHQUF1RztBQUN2Ryx1R0FBdUc7QUFDdkcsb0RBQW9EO0FBRXBELElBQU8sTUFBTSxDQTRWWjtBQWpXRCxvREFBb0Q7QUFDcEQsdUdBQXVHO0FBQ3ZHLHVHQUF1RztBQUN2RyxvREFBb0Q7QUFFcEQsV0FBTyxNQUFNO0lBRVo7O09BRUc7SUFFSDtRQUdDLG1CQUFZLE1BQWMsRUFBRSxNQUFjO1lBQ3pDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLENBQUM7UUFDRixnQkFBQztJQUFELENBQUMsQUFQRCxJQU9DO0lBRUQ7Ozs7OztPQU1HO0lBRUg7UUFVQyx1QkFBWSxXQUFtQixFQUFFLE1BQW9CO1lBUDdDLGVBQVUsR0FBRyxDQUFDLENBQUM7WUFDdEIsa0JBQWEsR0FBRyxDQUFDLENBQUE7WUFFVixXQUFNLEdBQWdCLEVBQUUsQ0FBQztZQUN6QixhQUFRLEdBQWdCLEVBQUUsQ0FBQztZQUlsQyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztZQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQztRQUMzQixDQUFDO1FBRUQ7OztXQUdHO1FBQ0YsNEJBQUksR0FBSjtZQUNDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBRTtZQUMvQixJQUFJLE1BQU0sR0FBRyxJQUFJLFlBQVksQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN2QyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN2QixJQUFBLE1BQU0sR0FBSSxJQUFJLE9BQVIsQ0FBUztZQUNwQixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFDO2dCQUN6QixNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDNUM7WUFDRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDdEIsQ0FBQztRQUVEOztXQUVHO1FBQ0cscUJBQU8sR0FBZCxVQUFlLE1BQWtCLEVBQUUsTUFBb0I7WUFDdEQsSUFBSSxDQUFDLEdBQUcsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDbEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUzQixJQUFJLEtBQUssS0FBSyxDQUFDO2dCQUNkLE9BQU8sSUFBSSxDQUFDO1lBRWIsSUFBSSxJQUFJLEdBQUcsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNyRCxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUM7Z0JBQzFCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxRQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxXQUFXLEdBQUcsS0FBSyxFQUFDO29CQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxHQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ2xFO2dCQUNELFdBQVcsR0FBRyxLQUFLLEdBQUMsUUFBTSxDQUFDO2FBQzNCO1lBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7WUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFDO2dCQUN2QyxNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUE7YUFDN0Q7WUFDRCxvQ0FBb0M7WUFDcEMsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBR0Q7OztXQUdHO1FBQ0gsNkJBQUssR0FBTCxVQUFNLElBQVk7WUFDWixJQUFBLEtBQXFCLElBQUksRUFBeEIsTUFBTSxZQUFBLEVBQUUsUUFBUSxjQUFRLENBQUM7WUFFOUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckMsd0JBQXdCO1lBQ3hCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO2dCQUNuQyxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLElBQUcsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFDO29CQUNoQyxNQUFNLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7b0JBQzdCLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUM7d0JBQ3ZCLGlDQUFpQzt3QkFDakMsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUM7d0JBQ3JCLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO3FCQUNyQjt5QkFBSTt3QkFDSixRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO3FCQUNuQjtvQkFDRCxNQUFNO2lCQUNOO2FBQ0Q7WUFDRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEVBQUM7Z0JBQ3hCLHdCQUF3QjtnQkFDeEIsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUM7b0JBQ3JFLE9BQU8sSUFBSSxDQUFDO2lCQUNaO2dCQUNELGtCQUFrQjtnQkFDbEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ25ELElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBQztvQkFDdEMsZ0JBQWdCO29CQUNoQixJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUNsRCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUM7d0JBQ3RCLGlCQUFpQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3FCQUNwRTtvQkFFRCxJQUFJLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDO3dCQUN2QyxPQUFPLElBQUksQ0FBQztxQkFDWjtpQkFDRDtnQkFFRCxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQzthQUN4QjtZQUVELDZCQUE2QjtZQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXBCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUN2QixDQUFDO1FBRU8saUNBQVMsR0FBakIsVUFBa0IsaUJBQXlCO1lBQzFDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsaUJBQWlCLENBQUM7WUFDckQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBQztnQkFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7Z0JBQ3hCLE9BQU8sSUFBSSxDQUFDO2FBQ1o7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNkLENBQUM7UUFFRCxrQ0FBVSxHQUFWO1lBQ0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUMzQixDQUFDO1FBRUQ7O1dBRUc7UUFDSCw0QkFBSSxHQUFKLFVBQUssT0FBZTtZQUNmLElBQUEsS0FBcUIsSUFBSSxFQUF4QixNQUFNLFlBQUEsRUFBRSxRQUFRLGNBQVEsQ0FBQztZQUM5QixpQkFBaUI7WUFDakIsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7Z0JBQ2pDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLE9BQU8sRUFBQztvQkFDNUIsWUFBWTtvQkFDWixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDcEIseUNBQXlDO29CQUN6QyxJQUFJLE9BQU8sR0FBQyxLQUFLLENBQUMsTUFBTSxHQUFDLElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLFVBQVUsRUFBQzt3QkFDN0QsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQzt3QkFDckMsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7NEJBQ2pDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbEIsYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3lCQUM3RDt3QkFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO3FCQUNuRDt5QkFBTTt3QkFDTix1QkFBdUI7d0JBQ3ZCLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ3JCLDJDQUEyQztxQkFDM0M7b0JBRUQsa0JBQWtCO29CQUNsQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUM7d0JBQ2hGLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUM7NEJBQ25DLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7NEJBQzVCLEtBQUksSUFBSSxHQUFDLEdBQUMsQ0FBQyxFQUFFLEdBQUMsR0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUMsRUFBRSxFQUFDO2dDQUNuQyxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBQyxDQUFDLENBQUM7Z0NBQ3hCLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksU0FBUyxFQUFDO29DQUN0QyxRQUFRLENBQUMsR0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2lDQUNuQjs2QkFDRDt5QkFDRDtxQkFDRDtvQkFFRCxPQUFPO2lCQUNQO2FBQ0Q7UUFDRixDQUFDO1FBQ0Ysb0JBQUM7SUFBRCxDQUFDLEFBN0tELElBNktDO0lBN0tZLG9CQUFhLGdCQTZLekIsQ0FBQTtJQUVEOzs7T0FHRztJQUNIO1FBTUMsc0JBQVksSUFBWSxFQUFFLE9BQVk7WUFBWix3QkFBQSxFQUFBLGNBQVk7WUFDckMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN4QixDQUFDO1FBRUQ7O1dBRUc7UUFDSCwrQkFBUSxHQUFSLFVBQVMsTUFBYztZQUN0QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUVBOzs7VUFHRTtRQUNILGdDQUFTLEdBQVQsVUFBVSxNQUFjLEVBQUUsS0FBWTtZQUNyQyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksS0FBSyxHQUFHLEdBQUc7Z0JBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUksS0FBSyxnQ0FBNkIsQ0FBQyxDQUFDO1lBQ3hELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQzdCLENBQUM7UUFFRDs7V0FFRztRQUNILGdDQUFTLEdBQVQsVUFBVSxNQUFjO1lBQ3ZCLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFFRCxtRUFBbUU7UUFDM0QsMEJBQUcsR0FBWCxVQUFZLE1BQWMsRUFBRSxLQUFVO1lBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBRUQ7OztXQUdHO1FBQ0gsaUNBQVUsR0FBVixVQUFXLE1BQWMsRUFBRSxLQUFhO1lBQ3ZDLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsTUFBTTtnQkFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBSSxLQUFLLGdDQUE2QixDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFFQTs7VUFFRTtRQUNILGdDQUFTLEdBQVQsVUFBVSxNQUFjO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxTQUFTO2tCQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPO2tCQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLO2tCQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBRUQ7OztXQUdHO1FBQ0gsaUNBQVUsR0FBVixVQUFXLE1BQWMsRUFBRSxLQUFhO1lBQ3ZDLEtBQUssR0FBRyxLQUFLLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUUsS0FBSyxJQUFJLEVBQUUsRUFBRSxLQUFLLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUN0RixDQUFDO1FBRUE7OztXQUdHO1FBQ0osZ0NBQVMsR0FBVCxVQUFVLE1BQWMsRUFBRSxNQUFjO1lBQ3ZDLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRyxNQUFNLEdBQUksSUFBSSxPQUFSLEVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNyQyxPQUFNLEdBQUcsR0FBRyxNQUFNLEVBQUM7Z0JBQ2xCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzNCLEdBQUcsRUFBRSxDQUFDO2dCQUNOLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDVjtZQUNELE9BQU8sTUFBTSxDQUFDLFlBQVksT0FBbkIsTUFBTSxFQUFpQixDQUFDLEVBQUU7UUFDbEMsQ0FBQztRQUVBOztXQUVHO1FBQ0osa0NBQVcsR0FBWCxVQUFZLE1BQWE7WUFDeEIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFHLE1BQU0sR0FBSSxJQUFJLE9BQVIsRUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3JDLE9BQU0sSUFBSSxFQUFDO2dCQUNWLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ1YsTUFBTTtnQkFDUCxHQUFHLEVBQUUsQ0FBQztnQkFDTixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ1Y7WUFDRCxPQUFPLE1BQU0sQ0FBQyxZQUFZLE9BQW5CLE1BQU0sRUFBaUIsQ0FBQyxFQUFFO1FBQ2xDLENBQUM7UUFFQTs7V0FFRztRQUNKLGlDQUFVLEdBQVYsVUFBVyxNQUFjLEVBQUUsS0FBYTtZQUN2QyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDZixLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztnQkFDakMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7YUFDL0I7WUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBRUM7O1VBRUU7UUFDSixnQ0FBUyxHQUFULFVBQVUsU0FBaUI7WUFDMUIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU87Z0JBQzNCLE9BQU8sS0FBSyxDQUFDO1lBQ2QsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBRUE7Ozs7Ozs7V0FPRztRQUNKLDJCQUFJLEdBQUosVUFBSyxNQUFjLEVBQUUsTUFBYztZQUNsQyxvQkFBb0I7WUFDcEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU87Z0JBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXNCLE1BQU0sZ0NBQTJCLElBQUksQ0FBQyxPQUFTLENBQUMsQ0FBQztZQUN4RixJQUFJLE1BQU0sR0FBRyxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxHQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0QsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQzlCLE9BQU8sTUFBTSxDQUFDO1FBQ2YsQ0FBQztRQUVBOztZQUVJO1FBQ0wsMkJBQUksR0FBSjtZQUNDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDM0IsQ0FBQztRQUVGLG1CQUFDO0lBQUQsQ0FBQyxBQS9JRCxJQStJQztJQS9JWSxtQkFBWSxlQStJeEIsQ0FBQTtBQUdGLENBQUMsRUE1Vk0sTUFBTSxLQUFOLE1BQU0sUUE0Vlo7QUNqV0Qsa0NBQWtDO0FBQ2xDLHVHQUF1RztBQUN2Ryx1R0FBdUc7QUFDdkcsb0RBQW9EO0FBRXBELHdDQUF3QztBQUV4Qzs7R0FFRztBQUVILElBQU8sTUFBTSxDQWtRWjtBQTdRRCxrQ0FBa0M7QUFDbEMsdUdBQXVHO0FBQ3ZHLHVHQUF1RztBQUN2RyxvREFBb0Q7QUFFcEQsd0NBQXdDO0FBRXhDOztHQUVHO0FBRUgsV0FBTyxNQUFNO0lBY1gsQ0FBQztJQWdCRjtRQU1DLGtCQUFZLFFBQXNCO1lBQ2pDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3pCLENBQUM7UUFFTyxtQ0FBZ0IsR0FBeEI7WUFDQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzNCLHVEQUF1RDtZQUN2RCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWlCLENBQUM7WUFDNUMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkMsSUFBSSxLQUFLLEtBQUssTUFBTSxFQUFDO2dCQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFvQyxLQUFPLENBQUMsQ0FBQzthQUM3RDtZQUVELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLHdCQUF5QixDQUFDO1lBQ3ZELElBQUksTUFBTSxnQkFBaUIsRUFBQztnQkFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBa0IsTUFBTSxxREFBa0QsQ0FBQyxDQUFDO2FBQzVGO1lBQ0QsMkJBQTJCO1lBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDckMsd0JBQXdCO1lBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMseUJBQTJCLENBQUM7WUFDNUQsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sRUFBQztnQkFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBb0IsSUFBSSxDQUFDLFFBQVEsdUJBQWtCLE1BQU0sTUFBRyxDQUFDLENBQUM7YUFDOUU7UUFDRixDQUFDO1FBRUQsa0NBQWUsR0FBZjtZQUNDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLHdCQUEwQixDQUFDO1FBQ3hELENBQUM7UUFFRCxrQ0FBZSxHQUFmO1lBQ0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFFRCwrQkFBWSxHQUFaO1lBQ0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsMkJBQTRCLENBQUM7UUFDMUQsQ0FBQztRQUVELDRCQUFTLEdBQVQ7WUFDQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0IsQ0FBQztRQUVELGdDQUFhLEdBQWIsVUFBYyxlQUF1QjtZQUNwQyxPQUFPLElBQUksQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDO1FBQ3hDLENBQUM7UUFFRDs7OztXQUlHO1FBQ0gsNEJBQVMsR0FBVCxVQUFVLEtBQWE7WUFDdEIsdUNBQXVDO1lBQ3ZDLElBQUksS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUM7Z0JBQ3BCLEtBQUssR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7YUFDbkM7WUFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksS0FBSyxFQUFDO2dCQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN6QztRQUNGLENBQUM7UUFFRCwrQkFBWSxHQUFaO1lBQ0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsMkJBQTRCLENBQUM7UUFDMUQsQ0FBQztRQUVELG1DQUFnQixHQUFoQjtZQUNDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLDZCQUE4QixDQUFDO1FBQzVELENBQUM7UUFFRCxnQ0FBYSxHQUFiO1lBQ0MsSUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFBLE9BQU8sRUFBRSxDQUFDO1lBQzVCLHlEQUF5RDtZQUN6RCxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUQsbUVBQW1FO1lBQzFELDhCQUE4QjtZQUN2QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUMvQyxJQUFJLElBQUksR0FBRyxJQUFJLE9BQUEsWUFBWSxDQUFDLE9BQU8sR0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RDLE9BQU8sT0FBTyxDQUFDO1FBQ2hCLENBQUM7UUFFRCwyQkFBUSxHQUFSLFVBQVMsT0FBZTtZQUN2QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFFRCw0QkFBUyxHQUFULFVBQVUsT0FBZTtZQUN4QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFFRCw0QkFBUyxHQUFULFVBQVUsT0FBZTtZQUN4QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFFRCw4QkFBVyxHQUFYLFVBQVksT0FBZTtZQUMxQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFFRCw2QkFBVSxHQUFWLFVBQVcsT0FBZSxFQUFFLEtBQWE7WUFDeEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVE7Z0JBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQTZCLE9BQVMsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBRUQsNkJBQVUsR0FBVixVQUFXLE9BQWU7WUFBRSxlQUFrQjtpQkFBbEIsVUFBa0IsRUFBbEIscUJBQWtCLEVBQWxCLElBQWtCO2dCQUFsQiw4QkFBa0I7O1lBQzdDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRO2dCQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLCtCQUE2QixPQUFTLENBQUMsQ0FBQztZQUN6RCxLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztnQkFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMzQztRQUNGLENBQUM7UUFFRCx3QkFBSyxHQUFMLFVBQU0sSUFBZSxFQUFFLE9BQWMsRUFBRSxLQUFZO1lBQ2xELFFBQU8sSUFBSSxFQUFDO2dCQUNYO29CQUNDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNoQyxPQUFPO2dCQUNSO29CQUNDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssSUFBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUNsRCxPQUFPO2dCQUNSO29CQUNDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ2pDO1FBQ0YsQ0FBQztRQUVEOzs7V0FHRztRQUNILDZCQUFVLEdBQVYsVUFBVyxPQUFlLEVBQUUsSUFBWSxFQUFFLEtBQWE7WUFDdEQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2YsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBQztnQkFDNUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFDO29CQUNYLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNO2lCQUNkO2dCQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDZDtZQUNELElBQUksQ0FBQyxVQUFVLE9BQWYsSUFBSSxpQkFBWSxPQUFPLEdBQUssS0FBSyxHQUFFO1lBQ25DLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNyQixDQUFDO1FBRU0sb0JBQVcsR0FBbEIsVUFBbUIsTUFBbUIsRUFBRSxDQUFlLEVBQUUsTUFBUTtZQUFSLHVCQUFBLEVBQUEsVUFBUTtZQUNoRSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSx5QkFBMkIsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDaEUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLDBCQUE0QixFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsRSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sMkJBQTRCLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSx5QkFBMEIsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUQsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLDRCQUE2QixFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwRSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sNEJBQTZCLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSw4QkFBK0IsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDeEUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLDJCQUE0QixFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRSxDQUFDO1FBR0U7Ozs7VUFJRDtRQUNGLHlCQUFNLEdBQU4sVUFBTyxlQUFpQixFQUFFLGdCQUFrQjtZQUFyQyxnQ0FBQSxFQUFBLG1CQUFpQjtZQUFFLGlDQUFBLEVBQUEsb0JBQWtCO1lBQzNDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUNwRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN4QixJQUFJLElBQUksRUFBQztnQkFDUixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ1gsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLGdCQUFnQixFQUFFLENBQUMsRUFBRSxFQUFDO29CQUNwQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDekI7Z0JBQ0QsSUFBSSxDQUFDLFVBQVUsT0FBZixJQUFJLGlCQUFZLGVBQWUsR0FBSyxDQUFDLEdBQUU7YUFDdkM7UUFDRixDQUFDO1FBRU8sbUNBQWdCLEdBQXhCLFVBQXlCLGVBQWUsRUFBRSxnQkFBZ0I7WUFDekQsSUFBSSxJQUFJLEdBQWlCLElBQUksQ0FBQztZQUM5QixJQUFJLGdCQUFnQixHQUFHLENBQUMsRUFBQztnQkFDeEIsSUFBSSxlQUFlLEdBQUcsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFDO29CQUN6RCxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsZUFBZSxDQUFDO2lCQUN0RDtnQkFDRCx1QkFBdUI7Z0JBQ3ZCLElBQUksS0FBSyxHQUFHLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUM1QyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUM7b0JBQ2IsZ0JBQWdCLElBQUksS0FBSyxDQUFDO29CQUMxQixLQUFLLEdBQUcsQ0FBQyxDQUFDO2lCQUNWO2dCQUNELElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO2FBQ2pFO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBRUQscUNBQWtCLEdBQWxCLFVBQW1CLE9BQWdCLEVBQUUsZUFBaUIsRUFBRSxnQkFBa0I7WUFBckMsZ0NBQUEsRUFBQSxtQkFBaUI7WUFBRSxpQ0FBQSxFQUFBLG9CQUFrQjtZQUN6RSwrQkFBK0I7WUFDL0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QyxJQUFJLE1BQU0sRUFBQztnQkFDVixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLGdCQUFnQixDQUFDLENBQUM7Z0JBRXBFLElBQUksQ0FBQyxHQUFHLElBQUksT0FBQSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLENBQUMsQ0FBQyxNQUFNLEdBQUUsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2pDLElBQUksUUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxDQUFDO2dCQUNSLElBQUksQ0FBQyxHQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ3BCLE9BQU0sQ0FBQyxHQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUM7b0JBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUM1QztnQkFFRCxJQUFJLElBQUksRUFBQztvQkFDUixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ1gsS0FBSSxJQUFJLEdBQUMsR0FBQyxDQUFDLEVBQUUsR0FBQyxHQUFDLGdCQUFnQixFQUFFLEdBQUMsRUFBRSxFQUFDO3dCQUNwQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDekI7b0JBQ0QsSUFBSSxDQUFDLFVBQVUsT0FBZixJQUFJLGlCQUFZLGVBQWUsR0FBSyxDQUFDLEdBQUU7aUJBQ3ZDO2FBRUQ7aUJBQUk7Z0JBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO2FBQzVDO1FBQ0YsQ0FBQztRQUVGLGVBQUM7SUFBRCxDQUFDLEFBbE9ELElBa09DO0lBbE9ZLGVBQVEsV0FrT3BCLENBQUE7QUFFRixDQUFDLEVBbFFNLE1BQU0sS0FBTixNQUFNLFFBa1FaO0FDN1FELGdFQUFnRTtBQUVoRSxJQUFPLE1BQU0sQ0EwR1o7QUE1R0QsZ0VBQWdFO0FBRWhFLFdBQU8sTUFBTTtJQUVYLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQTtJQUNmLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQTtJQUVsQixTQUFTLElBQUk7UUFDWCxJQUFJLElBQUksR0FBRyxrRUFBa0UsQ0FBQTtRQUM3RSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQy9DLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDbkIsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDbEM7UUFFRCxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUNqQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtJQUNuQyxDQUFDO0lBRUQsSUFBSSxFQUFFLENBQUE7SUFFTixTQUFnQixXQUFXLENBQUMsR0FBRztRQUM3QixJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsR0FBRyxDQUFBO1FBQ25DLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUE7UUFFcEIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQTtTQUNsRTtRQUVELDRDQUE0QztRQUM1QyxtRUFBbUU7UUFDbkUscUJBQXFCO1FBQ3JCLDhFQUE4RTtRQUM5RSxvREFBb0Q7UUFDcEQsWUFBWSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUV0RSw0REFBNEQ7UUFDNUQsR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFBO1FBRWhELHNFQUFzRTtRQUN0RSxDQUFDLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFBO1FBRXBDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUVULEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3hDLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2xLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQTtZQUM3QixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUE7WUFDNUIsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQTtTQUN0QjtRQUVELElBQUksWUFBWSxLQUFLLENBQUMsRUFBRTtZQUN0QixHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7WUFDbkYsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQTtTQUN0QjthQUFNLElBQUksWUFBWSxLQUFLLENBQUMsRUFBRTtZQUM3QixHQUFHLEdBQUcsQ0FBQyxTQUFTLENB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QUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnREFDOUUsTUFBTTs0Q0FDVixLQUFLLEtBQUs7Z0RBQ04sTUFBTSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7Z0RBQ2xFLE1BQU07eUNBQ2I7d0NBRUQsTUFBTTtxQ0FDVDtpQ0FDSjs2QkFDSjt5QkFDSjtvQkFDTCxDQUFDO29CQUNMLGNBQUM7Z0JBQUQsQ0FBQyxBQWhVRCxJQWdVQztnQkFoVVksaUJBQU8sVUFnVW5CLENBQUE7WUFDTCxDQUFDLEVBblZhLFNBQVMsS0FBVCxTQUFTLFFBbVZ0Qjs7UUFDRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qXHJcbiAqIFR5cGVTY3JpcHQgcG9ydCBieSBUaGlsbyBQbGFuelxyXG4gKlxyXG4gKiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS90aGlsb3BsYW56LzZhYmYwNGY5NTcxOTdlOWUzOTEyXHJcbiAqL1xyXG5cclxuLypcclxuICBJJ3ZlIHdyYXBwZWQgTWFrb3RvIE1hdHN1bW90byBhbmQgVGFrdWppIE5pc2hpbXVyYSdzIGNvZGUgaW4gYSBuYW1lc3BhY2VcclxuICBzbyBpdCdzIGJldHRlciBlbmNhcHN1bGF0ZWQuIE5vdyB5b3UgY2FuIGhhdmUgbXVsdGlwbGUgcmFuZG9tIG51bWJlciBnZW5lcmF0b3JzXHJcbiAgYW5kIHRoZXkgd29uJ3Qgc3RvbXAgYWxsIG92ZXIgZWFjaG90aGVyJ3Mgc3RhdGUuXHJcbiAgXHJcbiAgSWYgeW91IHdhbnQgdG8gdXNlIHRoaXMgYXMgYSBzdWJzdGl0dXRlIGZvciBNYXRoLnJhbmRvbSgpLCB1c2UgdGhlIHJhbmRvbSgpXHJcbiAgbWV0aG9kIGxpa2Ugc286XHJcbiAgXHJcbiAgdmFyIG0gPSBuZXcgTWVyc2VubmVUd2lzdGVyKCk7XHJcbiAgdmFyIHJhbmRvbU51bWJlciA9IG0ucmFuZG9tKCk7XHJcbiAgXHJcbiAgWW91IGNhbiBhbHNvIGNhbGwgdGhlIG90aGVyIGdlbnJhbmRfe2Zvb30oKSBtZXRob2RzIG9uIHRoZSBpbnN0YW5jZS5cclxuXHJcbiAgSWYgeW91IHdhbnQgdG8gdXNlIGEgc3BlY2lmaWMgc2VlZCBpbiBvcmRlciB0byBnZXQgYSByZXBlYXRhYmxlIHJhbmRvbVxyXG4gIHNlcXVlbmNlLCBwYXNzIGFuIGludGVnZXIgaW50byB0aGUgY29uc3RydWN0b3I6XHJcblxyXG4gIHZhciBtID0gbmV3IE1lcnNlbm5lVHdpc3RlcigxMjMpO1xyXG5cclxuICBhbmQgdGhhdCB3aWxsIGFsd2F5cyBwcm9kdWNlIHRoZSBzYW1lIHJhbmRvbSBzZXF1ZW5jZS5cclxuXHJcbiAgU2VhbiBNY0N1bGxvdWdoIChiYW5rc2VhbkBnbWFpbC5jb20pXHJcbiovXHJcblxyXG4vKiBcclxuICAgQSBDLXByb2dyYW0gZm9yIE1UMTk5MzcsIHdpdGggaW5pdGlhbGl6YXRpb24gaW1wcm92ZWQgMjAwMi8xLzI2LlxyXG4gICBDb2RlZCBieSBUYWt1amkgTmlzaGltdXJhIGFuZCBNYWtvdG8gTWF0c3Vtb3RvLlxyXG4gXHJcbiAgIEJlZm9yZSB1c2luZywgaW5pdGlhbGl6ZSB0aGUgc3RhdGUgYnkgdXNpbmcgaW5pdF9nZW5yYW5kKHNlZWQpICBcclxuICAgb3IgaW5pdF9ieV9hcnJheShpbml0X2tleSwga2V5X2xlbmd0aCkuXHJcbiBcclxuICAgQ29weXJpZ2h0IChDKSAxOTk3IC0gMjAwMiwgTWFrb3RvIE1hdHN1bW90byBhbmQgVGFrdWppIE5pc2hpbXVyYSxcclxuICAgQWxsIHJpZ2h0cyByZXNlcnZlZC4gICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gXHJcbiAgIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxyXG4gICBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnNcclxuICAgYXJlIG1ldDpcclxuIFxyXG4gICAgIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XHJcbiAgICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxyXG4gXHJcbiAgICAgMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcclxuICAgICAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlXHJcbiAgICAgICAgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cclxuIFxyXG4gICAgIDMuIFRoZSBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heSBub3QgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgXHJcbiAgICAgICAgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIFxyXG4gICAgICAgIHBlcm1pc3Npb24uXHJcbiBcclxuICAgVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SU1xyXG4gICBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UXHJcbiAgIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUlxyXG4gICBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgT1dORVIgT1JcclxuICAgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsXHJcbiAgIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTyxcclxuICAgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SXHJcbiAgIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0ZcclxuICAgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcclxuICAgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTXHJcbiAgIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxyXG4gXHJcbiBcclxuICAgQW55IGZlZWRiYWNrIGlzIHZlcnkgd2VsY29tZS5cclxuICAgaHR0cDovL3d3dy5tYXRoLnNjaS5oaXJvc2hpbWEtdS5hYy5qcC9+bS1tYXQvTVQvZW10Lmh0bWxcclxuICAgZW1haWw6IG0tbWF0IEAgbWF0aC5zY2kuaGlyb3NoaW1hLXUuYWMuanAgKHJlbW92ZSBzcGFjZSlcclxuKi9cclxuXHJcbmNsYXNzIE1lcnNlbm5lVHdpc3RlcntcclxuIFxyXG4gLyogUGVyaW9kIHBhcmFtZXRlcnMgKi8gIFxyXG4gcHJpdmF0ZSBOID0gNjI0O1xyXG4gcHJpdmF0ZSBNID0gMzk3O1xyXG4gcHJpdmF0ZSBNQVRSSVhfQSA9IDB4OTkwOGIwZGY7ICAgLyogY29uc3RhbnQgdmVjdG9yIGEgKi9cclxuIHByaXZhdGUgVVBQRVJfTUFTSyA9IDB4ODAwMDAwMDA7IC8qIG1vc3Qgc2lnbmlmaWNhbnQgdy1yIGJpdHMgKi9cclxuIHByaXZhdGUgTE9XRVJfTUFTSyA9IDB4N2ZmZmZmZmY7IC8qIGxlYXN0IHNpZ25pZmljYW50IHIgYml0cyAqL1xyXG4gXHJcbiBwcml2YXRlIG10ID0gbmV3IEFycmF5KHRoaXMuTik7IC8qIHRoZSBhcnJheSBmb3IgdGhlIHN0YXRlIHZlY3RvciAqL1xyXG4gcHJpdmF0ZSBtdGkgPSB0aGlzLk4gKyAxOyAgLyogbXRpPT1OKzEgbWVhbnMgbXRbTl0gaXMgbm90IGluaXRpYWxpemVkICovXHJcbiAgXHJcbiBjb25zdHJ1Y3RvcihzZWVkPzpudW1iZXIpIHtcclxuICAgIGlmIChzZWVkID09IHVuZGVmaW5lZCkge1xyXG4gICAgICBzZWVkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICB9ICAgXHJcbiAgICB0aGlzLmluaXRfZ2VucmFuZChzZWVkKTtcclxuICB9ICBcclxuIFxyXG4gIC8qIGluaXRpYWxpemVzIG10W05dIHdpdGggYSBzZWVkICovXHJcbiAgcHJpdmF0ZSBpbml0X2dlbnJhbmQoczpudW1iZXIpIHtcclxuICAgIHRoaXMubXRbMF0gPSBzID4+PiAwO1xyXG4gICAgZm9yICh0aGlzLm10aT0xOyB0aGlzLm10aTx0aGlzLk47IHRoaXMubXRpKyspIHtcclxuICAgICAgICBzID0gdGhpcy5tdFt0aGlzLm10aS0xXSBeICh0aGlzLm10W3RoaXMubXRpLTFdID4+PiAzMCk7XHJcbiAgICAgdGhpcy5tdFt0aGlzLm10aV0gPSAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTgxMjQzMzI1MykgPDwgMTYpICsgKHMgJiAweDAwMDBmZmZmKSAqIDE4MTI0MzMyNTMpXHJcbiAgICArIHRoaXMubXRpO1xyXG4gICAgICAgIC8qIFNlZSBLbnV0aCBUQU9DUCBWb2wyLiAzcmQgRWQuIFAuMTA2IGZvciBtdWx0aXBsaWVyLiAqL1xyXG4gICAgICAgIC8qIEluIHRoZSBwcmV2aW91cyB2ZXJzaW9ucywgTVNCcyBvZiB0aGUgc2VlZCBhZmZlY3QgICAqL1xyXG4gICAgICAgIC8qIG9ubHkgTVNCcyBvZiB0aGUgYXJyYXkgbXRbXS4gICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgIC8qIDIwMDIvMDEvMDkgbW9kaWZpZWQgYnkgTWFrb3RvIE1hdHN1bW90byAgICAgICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMubXRbdGhpcy5tdGldID4+Pj0gMDtcclxuICAgICAgICAvKiBmb3IgPjMyIGJpdCBtYWNoaW5lcyAqL1xyXG4gICAgfVxyXG4gIH1cclxuICAgXHJcbiAgLyogaW5pdGlhbGl6ZSBieSBhbiBhcnJheSB3aXRoIGFycmF5LWxlbmd0aCAqL1xyXG4gIC8qIGluaXRfa2V5IGlzIHRoZSBhcnJheSBmb3IgaW5pdGlhbGl6aW5nIGtleXMgKi9cclxuICAvKiBrZXlfbGVuZ3RoIGlzIGl0cyBsZW5ndGggKi9cclxuICAvKiBzbGlnaHQgY2hhbmdlIGZvciBDKyssIDIwMDQvMi8yNiAqL1xyXG4gIGluaXRfYnlfYXJyYXkoaW5pdF9rZXksIGtleV9sZW5ndGgpIHtcclxuICAgIHZhciBpLCBqLCBrO1xyXG4gICAgdGhpcy5pbml0X2dlbnJhbmQoMTk2NTAyMTgpO1xyXG4gICAgaT0xOyBqPTA7XHJcbiAgICBrID0gKHRoaXMuTj5rZXlfbGVuZ3RoID8gdGhpcy5OIDoga2V5X2xlbmd0aCk7XHJcbiAgICBmb3IgKDsgazsgay0tKSB7XHJcbiAgICAgIHZhciBzID0gdGhpcy5tdFtpLTFdIF4gKHRoaXMubXRbaS0xXSA+Pj4gMzApXHJcbiAgICAgIHRoaXMubXRbaV0gPSAodGhpcy5tdFtpXSBeICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxNjY0NTI1KSA8PCAxNikgKyAoKHMgJiAweDAwMDBmZmZmKSAqIDE2NjQ1MjUpKSlcclxuICAgICAgICArIGluaXRfa2V5W2pdICsgajsgLyogbm9uIGxpbmVhciAqL1xyXG4gICAgICB0aGlzLm10W2ldID4+Pj0gMDsgLyogZm9yIFdPUkRTSVpFID4gMzIgbWFjaGluZXMgKi9cclxuICAgICAgaSsrOyBqKys7XHJcbiAgICAgIGlmIChpPj10aGlzLk4pIHsgdGhpcy5tdFswXSA9IHRoaXMubXRbdGhpcy5OLTFdOyBpPTE7IH1cclxuICAgICAgaWYgKGo+PWtleV9sZW5ndGgpIGo9MDtcclxuICAgIH1cclxuICAgIGZvciAoaz10aGlzLk4tMTsgazsgay0tKSB7XHJcbiAgICAgIHZhciBzID0gdGhpcy5tdFtpLTFdIF4gKHRoaXMubXRbaS0xXSA+Pj4gMzApO1xyXG4gICAgICB0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTU2NjA4Mzk0MSkgPDwgMTYpICsgKHMgJiAweDAwMDBmZmZmKSAqIDE1NjYwODM5NDEpKVxyXG4gICAgICAgIC0gaTsgLyogbm9uIGxpbmVhciAqL1xyXG4gICAgICB0aGlzLm10W2ldID4+Pj0gMDsgLyogZm9yIFdPUkRTSVpFID4gMzIgbWFjaGluZXMgKi9cclxuICAgICAgaSsrO1xyXG4gICAgICBpZiAoaT49dGhpcy5OKSB7IHRoaXMubXRbMF0gPSB0aGlzLm10W3RoaXMuTi0xXTsgaT0xOyB9XHJcbiAgICB9XHJcbiAgXHJcbiAgICB0aGlzLm10WzBdID0gMHg4MDAwMDAwMDsgLyogTVNCIGlzIDE7IGFzc3VyaW5nIG5vbi16ZXJvIGluaXRpYWwgYXJyYXkgKi8gXHJcbiAgfVxyXG4gICBcclxuICAvKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDB4ZmZmZmZmZmZdLWludGVydmFsICovXHJcbiAgZ2VucmFuZF9pbnQzMigpIHtcclxuICAgIHZhciB5O1xyXG4gICAgdmFyIG1hZzAxID0gbmV3IEFycmF5KDB4MCwgdGhpcy5NQVRSSVhfQSk7XHJcbiAgICAvKiBtYWcwMVt4XSA9IHggKiBNQVRSSVhfQSAgZm9yIHg9MCwxICovXHJcbiAgXHJcbiAgICBpZiAodGhpcy5tdGkgPj0gdGhpcy5OKSB7IC8qIGdlbmVyYXRlIE4gd29yZHMgYXQgb25lIHRpbWUgKi9cclxuICAgICAgdmFyIGtrO1xyXG4gIFxyXG4gICAgICBpZiAodGhpcy5tdGkgPT0gdGhpcy5OKzEpICAgLyogaWYgaW5pdF9nZW5yYW5kKCkgaGFzIG5vdCBiZWVuIGNhbGxlZCwgKi9cclxuICAgICAgICB0aGlzLmluaXRfZ2VucmFuZCg1NDg5KTsgLyogYSBkZWZhdWx0IGluaXRpYWwgc2VlZCBpcyB1c2VkICovXHJcbiAgXHJcbiAgICAgIGZvciAoa2s9MDtrazx0aGlzLk4tdGhpcy5NO2trKyspIHtcclxuICAgICAgICB5ID0gKHRoaXMubXRba2tdJnRoaXMuVVBQRVJfTUFTSyl8KHRoaXMubXRba2srMV0mdGhpcy5MT1dFUl9NQVNLKTtcclxuICAgICAgICB0aGlzLm10W2trXSA9IHRoaXMubXRba2srdGhpcy5NXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAoO2trPHRoaXMuTi0xO2trKyspIHtcclxuICAgICAgICB5ID0gKHRoaXMubXRba2tdJnRoaXMuVVBQRVJfTUFTSyl8KHRoaXMubXRba2srMV0mdGhpcy5MT1dFUl9NQVNLKTtcclxuICAgICAgICB0aGlzLm10W2trXSA9IHRoaXMubXRba2srKHRoaXMuTS10aGlzLk4pXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xyXG4gICAgICB9XHJcbiAgICAgIHkgPSAodGhpcy5tdFt0aGlzLk4tMV0mdGhpcy5VUFBFUl9NQVNLKXwodGhpcy5tdFswXSZ0aGlzLkxPV0VSX01BU0spO1xyXG4gICAgICB0aGlzLm10W3RoaXMuTi0xXSA9IHRoaXMubXRbdGhpcy5NLTFdIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XHJcbiAgXHJcbiAgICAgIHRoaXMubXRpID0gMDtcclxuICAgIH1cclxuICBcclxuICAgIHkgPSB0aGlzLm10W3RoaXMubXRpKytdO1xyXG4gIFxyXG4gICAgLyogVGVtcGVyaW5nICovXHJcbiAgICB5IF49ICh5ID4+PiAxMSk7XHJcbiAgICB5IF49ICh5IDw8IDcpICYgMHg5ZDJjNTY4MDtcclxuICAgIHkgXj0gKHkgPDwgMTUpICYgMHhlZmM2MDAwMDtcclxuICAgIHkgXj0gKHkgPj4+IDE4KTtcclxuICBcclxuICAgIHJldHVybiB5ID4+PiAwO1xyXG4gIH1cclxuICAgXHJcbiAgLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiBbMCwweDdmZmZmZmZmXS1pbnRlcnZhbCAqL1xyXG4gIGdlbnJhbmRfaW50MzEoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMuZ2VucmFuZF9pbnQzMigpPj4+MSk7XHJcbiAgfVxyXG4gICBcclxuICAvKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDFdLXJlYWwtaW50ZXJ2YWwgKi9cclxuICBnZW5yYW5kX3JlYWwxKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2VucmFuZF9pbnQzMigpKigxLjAvNDI5NDk2NzI5NS4wKTsgXHJcbiAgICAvKiBkaXZpZGVkIGJ5IDJeMzItMSAqLyBcclxuICB9XHJcbiAgXHJcbiAgLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiBbMCwxKS1yZWFsLWludGVydmFsICovXHJcbiAgcmFuZG9tKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2VucmFuZF9pbnQzMigpKigxLjAvNDI5NDk2NzI5Ni4wKTsgXHJcbiAgICAvKiBkaXZpZGVkIGJ5IDJeMzIgKi9cclxuICB9XHJcbiAgIFxyXG4gIC8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gKDAsMSktcmVhbC1pbnRlcnZhbCAqL1xyXG4gIGdlbnJhbmRfcmVhbDMoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMuZ2VucmFuZF9pbnQzMigpICsgMC41KSooMS4wLzQyOTQ5NjcyOTYuMCk7IFxyXG4gICAgLyogZGl2aWRlZCBieSAyXjMyICovXHJcbiAgfVxyXG4gICBcclxuICAvKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDEpIHdpdGggNTMtYml0IHJlc29sdXRpb24qL1xyXG4gIGdlbnJhbmRfcmVzNTMoKSB7IFxyXG4gICAgdmFyIGE9dGhpcy5nZW5yYW5kX2ludDMyKCk+Pj41LCBiPXRoaXMuZ2VucmFuZF9pbnQzMigpPj4+NjsgXHJcbiAgICByZXR1cm4oYSo2NzEwODg2NC4wK2IpKigxLjAvOTAwNzE5OTI1NDc0MDk5Mi4wKTsgXHJcbiAgfSBcclxuICBcclxuICAvKiBUaGVzZSByZWFsIHZlcnNpb25zIGFyZSBkdWUgdG8gSXNha3UgV2FkYSwgMjAwMi8wMS8wOSBhZGRlZCAqL1xyXG59IiwiLy8gV3JpdHRlbiBpbiAyMDE1IGJ5IFRoaWxvIFBsYW56IFxyXG4vLyBUbyB0aGUgZXh0ZW50IHBvc3NpYmxlIHVuZGVyIGxhdywgSSBoYXZlIGRlZGljYXRlZCBhbGwgY29weXJpZ2h0IGFuZCByZWxhdGVkIGFuZCBuZWlnaGJvcmluZyByaWdodHMgXHJcbi8vIHRvIHRoaXMgc29mdHdhcmUgdG8gdGhlIHB1YmxpYyBkb21haW4gd29ybGR3aWRlLiBUaGlzIHNvZnR3YXJlIGlzIGRpc3RyaWJ1dGVkIHdpdGhvdXQgYW55IHdhcnJhbnR5LiBcclxuLy8gaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvcHVibGljZG9tYWluL3plcm8vMS4wL1xyXG5cclxuXHJcbi8qKlxyXG4gKiBBIHdyYXBwZXIgdG8gZW11bGF0ZSBtaW5pbWFsIEdsayBmdW5jdGlvbmFsaXR5LlxyXG4gKi9cclxuXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9J0VuZ2luZS50cycgLz5cclxuXHJcbm1vZHVsZSBGeXJlVk0ge1xyXG5cdFxyXG5cdGNvbnN0IGVudW0gR2xrQ29uc3Qge1xyXG5cdFx0IHdpbnR5cGVfVGV4dEJ1ZmZlciA9IDMsXHJcblxyXG4gICAgICAgICBldnR5cGVfTm9uZSA9IDAsXHJcbiAgICAgICAgIGV2dHlwZV9DaGFySW5wdXQgPSAyLFxyXG4gICAgICAgICBldnR5cGVfTGluZUlucHV0ID0gMyxcclxuXHJcbiAgICAgICAgIGdlc3RhbHRfQ2hhcklucHV0ID0gMSxcclxuICAgICAgICAgZ2VzdGFsdF9DaGFyT3V0cHV0ID0gMyxcclxuICAgICAgICAgZ2VzdGFsdF9DaGFyT3V0cHV0X0FwcHJveFByaW50ID0gMSxcclxuICAgICAgICAgZ2VzdGFsdF9DaGFyT3V0cHV0X0Nhbm5vdFByaW50ID0gMCxcclxuICAgICAgICAgZ2VzdGFsdF9DaGFyT3V0cHV0X0V4YWN0UHJpbnQgPSAyLFxyXG4gICAgICAgICBnZXN0YWx0X0xpbmVJbnB1dCA9IDIsXHJcbiAgICAgICAgIGdlc3RhbHRfVmVyc2lvbiA9IDBcclxuICAgICAgIFxyXG5cdH1cclxuXHRcclxuXHRpbnRlcmZhY2UgU3RyZWFtQ2xvc2VSZXN1bHQge1xyXG5cdFx0b2s6IGJvb2xlYW47XHJcblx0XHRyZWFkOiBudW1iZXI7XHJcblx0XHR3cml0dGVuOiBudW1iZXI7XHJcblx0fVxyXG5cdFxyXG5cdGludGVyZmFjZSBHbGtTdHJlYW0ge1xyXG5cdFx0Z2V0SWQoKTogbnVtYmVyO1xyXG5cdFx0cHV0KHM6IHN0cmluZyk6IHZvaWQ7XHJcblx0XHRjbG9zZSgpOiBTdHJlYW1DbG9zZVJlc3VsdDtcclxuXHR9XHJcblx0XHJcblx0Y2xhc3MgR2xrV2luZG93U3RyZWFtIGltcGxlbWVudHMgR2xrU3RyZWFtIHtcclxuXHRcdGlkIDogbnVtYmVyO1xyXG5cdFx0ZW5naW5lOiBFbmdpbmU7XHJcblx0XHRcclxuXHRcdGNvbnN0cnVjdG9yKGlkOm51bWJlciwgZW5naW5lOiBFbmdpbmUpe1xyXG5cdFx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHRcdHRoaXMuZW5naW5lID0gZW5naW5lO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRnZXRJZCgpe1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5pZDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cHV0KHM6IHN0cmluZyl7XHJcblx0XHRcdHRoaXMuZW5naW5lWydvdXRwdXRCdWZmZXInXS53cml0ZShzKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Y2xvc2UoKXtcclxuXHRcdFx0cmV0dXJuIHsgb2s6IGZhbHNlLCB3cml0dGVuOiAwLCByZWFkOiAwfTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdH1cclxuXHRcclxuXHRleHBvcnQgZnVuY3Rpb24gR2xrV3JhcHBlckNhbGwoY29kZTogbnVtYmVyLCBhcmdjOiBudW1iZXIpe1xyXG5cdFx0XHJcblx0XHRpZiAoIXRoaXMuZ2xrSGFuZGxlcnMpe1xyXG5cdFx0XHR0aGlzLmdsa0hhbmRsZXJzID0gaW5pdEdsa0hhbmRsZXJzKCk7XHJcblx0XHRcdHRoaXMuZ2xrU3RyZWFtcyA9IFtdO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZiAoYXJnYyA+IDgpe1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFRvbyBtYW55IHN0YWNrIGFyZ3VtZW50cyBmb3IgZ2xrIGNhbGwgJHtjb2RlfTogJHthcmdjfWApO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGdsa0FyZ3MgPSBbXTtcclxuXHRcdHdoaWxlKGFyZ2MtLSl7XHJcblx0XHRcdGdsa0FyZ3MucHVzaCh0aGlzLnBvcCgpKTtcclxuXHRcdH1cclxuXHRcdGxldCBoYW5kbGVyID0gdGhpcy5nbGtIYW5kbGVyc1tjb2RlXTtcclxuXHRcdGlmIChoYW5kbGVyKXtcclxuXHRcdFx0cmV0dXJuIGhhbmRsZXIuYXBwbHkodGhpcywgZ2xrQXJncyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihgdW5pbXBsZW1lbnRlZCBnbGsgY2FsbCAke2NvZGV9YCk7XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRleHBvcnQgZnVuY3Rpb24gR2xrV3JhcHBlcldyaXRlKHM6IHN0cmluZyl7XHJcblx0XHRpZiAodGhpcy5nbGtDdXJyZW50U3RyZWFtKXtcclxuXHRcdFx0dGhpcy5nbGtDdXJyZW50U3RyZWFtLnB1dChzKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0ZnVuY3Rpb24gc3R1YigpIHsgcmV0dXJuIDB9O1xyXG5cdFxyXG5cdGZ1bmN0aW9uIGluaXRHbGtIYW5kbGVycygpe1xyXG5cdFx0bGV0IGhhbmRsZXJzID0gW107XHJcblx0XHRcclxuXHRcdC8vIGdsa19zdHJlYW1faXRlcmF0ZVxyXG5cdFx0aGFuZGxlcnNbMHg0MF0gPSBzdHViO1xyXG5cdFx0XHJcblx0XHQvLyBnbGtfd2luZG93X2l0ZXJhdGVcclxuXHRcdGhhbmRsZXJzWzB4MjBdID0gZnVuY3Rpb24od2luX2lkKXtcclxuXHRcdFx0aWYgKHRoaXMuZ2xrV2luZG93T3BlbiAmJiB3aW5faWQgPT09IDApXHJcblx0XHRcdFx0cmV0dXJuIDE7XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBnbGtfZmlsZXJlZl9pdGVyYXRlIFxyXG5cdFx0aGFuZGxlcnNbMHg2NF0gPSBzdHViO1xyXG5cdFx0XHJcblx0XHQvLyBnbGtfd2luZG93X29wZW5cclxuXHRcdGhhbmRsZXJzWzB4MjNdID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYgKHRoaXMuZ2xrV2luZG93T3BlbilcclxuXHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0dGhpcy5nbGtXaW5kb3dPcGVuID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5nbGtTdHJlYW1zWzFdID0gbmV3IEdsa1dpbmRvd1N0cmVhbSgxLCB0aGlzKTtcclxuXHRcdFx0cmV0dXJuIDE7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIGdsa19zZXRfd2luZG93XHJcblx0XHRoYW5kbGVyc1sweDJGXSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmICh0aGlzLmdsa1dpbmRvd09wZW4pe1xyXG5cdFx0XHRcdHRoaXMuZ2xrQ3VycmVudFN0cmVhbSA9IHRoaXMuZ2xrU3RyZWFtc1sxXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gZ2xrX3NldF9zdHlsZVxyXG5cdFx0aGFuZGxlcnNbMHg4Nl0gPSBzdHViO1xyXG5cdFx0XHJcblx0XHQvL2dsa19zdHlsZWhpbnRfc2V0IFxyXG5cdFx0aGFuZGxlcnNbMHhCMF0gPSBzdHViO1xyXG5cdFx0XHJcblx0XHQvLyBnbGtfc3R5bGVfZGlzdGluZ3Vpc2hcclxuXHRcdGhhbmRsZXJzWzB4QjJdID0gc3R1YjtcclxuXHRcdFxyXG5cdFx0Ly8gZ2xrX3N0eWxlX21lYXN1cmVcclxuXHRcdGhhbmRsZXJzWzB4QjNdID0gc3R1YjtcclxuXHRcdFxyXG5cdFx0Ly8gZ2xrX2NoYXJfdG9fbG93ZXJcclxuXHRcdGhhbmRsZXJzWzB4QTBdID0gZnVuY3Rpb24oY2gpe1xyXG5cdFx0XHRyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjaCkudG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KDApO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBnbGtfY2hhcl90b191cHBlclxyXG5cdFx0aGFuZGxlcnNbMHhBMV0gPSBmdW5jdGlvbihjaCl7XHJcblx0XHRcdHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoKS50b1VwcGVyQ2FzZSgpLmNoYXJDb2RlQXQoMCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIGdsa19yZXF1ZXN0X2xpbmVfZXZlbnRcclxuXHRcdGhhbmRsZXJzWzB4RDBdID0gZnVuY3Rpb24od2luSWQsIGJ1ZmZlciwgYnVmZmVyU2l6ZSl7XHJcblx0XHRcdHRoaXMuZ2xrV2FudExpbmVJbnB1dCA9IHRydWU7XHJcblx0XHRcdHRoaXMuZ2xrTGluZUlucHV0QnVmU2l6ZSA9IGJ1ZmZlclNpemU7XHJcblx0XHRcdHRoaXMuZ2xrTGluZUlucHV0QnVmZmVyID0gYnVmZmVyO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBnbGtfcmVxdWVzdF9jaGFyX2V2ZW50XHJcblx0XHRoYW5kbGVyc1sweEQyXSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHRoaXMuZ2xrV2FudENoYXJJbnB1dCA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIGdsa19wdXRfY2hhclxyXG5cdFx0aGFuZGxlcnNbMHg4MF0gPSBmdW5jdGlvbihjKXtcclxuXHRcdFx0R2xrV3JhcHBlcldyaXRlLmNhbGwodGhpcywgU3RyaW5nLmZyb21DaGFyQ29kZShjKSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIGdsa19zZWxlY3QgXHJcblx0XHRoYW5kbGVyc1sweEMwXSA9IGZ1bmN0aW9uKHJlZmVyZW5jZSkgOiBhbnl7XHJcblx0XHRcdHRoaXMuZGVsaXZlck91dHB1dCgpO1xyXG5cdFx0XHRcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5nbGtXYW50TGluZUlucHV0KXtcclxuXHRcdFx0XHR0aGlzLmdsa1dhbnRMaW5lSW5wdXQgPSBmYWxzZTtcclxuXHRcdFx0XHRpZiAoIXRoaXMubGluZVdhbnRlZCl7XHJcblx0XHRcdFx0XHRHbGtXcml0ZVJlZmVyZW5jZS5jYWxsKHRoaXMsIHJlZmVyZW5jZSwgR2xrQ29uc3QuZXZ0eXBlX0xpbmVJbnB1dCwgMSwgMSwgMCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGV0IGNhbGxiYWNrID0gZnVuY3Rpb24obGluZSA9ICcnKXtcclxuXHRcdFx0XHRcdGxldCBtYXggPSB0aGlzLmltYWdlLndyaXRlQVNDSUkodGhpcy5nbGtMaW5lSW5wdXRCdWZmZXIsIGxpbmUsIHRoaXMuZ2xrTGluZUlucHV0QnVmU2l6ZSk7XHJcblx0XHRcdFx0XHRHbGtXcml0ZVJlZmVyZW5jZS5jYWxsKHRoaXMsIHJlZmVyZW5jZSwgR2xrQ29uc3QuZXZ0eXBlX0xpbmVJbnB1dCwgMSwgbWF4LCAwKTtcclxuXHRcdFx0XHRcdHRoaXMucmVzdW1lQWZ0ZXJXYWl0KFswXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHRoaXMubGluZVdhbnRlZChjYWxsYmFjay5iaW5kKHRoaXMpKTtcclxuXHRcdFx0XHRyZXR1cm4gJ3dhaXQnO1xyXG5cdFx0XHR9ZWxzZSBpZiAodGhpcy5nbGtXYW50Q2hhcklucHV0KXtcclxuXHRcdFx0XHR0aGlzLmdsa1dhbnRDaGFySW5wdXQgPSBmYWxzZTtcclxuXHRcdFx0XHRpZiAoIXRoaXMua2V5V2FudGVkKXtcclxuXHRcdFx0XHRcdEdsa1dyaXRlUmVmZXJlbmNlLmNhbGwodGhpcywgcmVmZXJlbmNlLCBHbGtDb25zdC5ldnR5cGVfQ2hhcklucHV0LCAxLCAwLCAwKTtcclxuXHRcdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgY2FsbGJhY2sgPSBmdW5jdGlvbihsaW5lKXtcclxuXHRcdFx0XHRcdEdsa1dyaXRlUmVmZXJlbmNlLmNhbGwodGhpcywgcmVmZXJlbmNlLCBHbGtDb25zdC5ldnR5cGVfQ2hhcklucHV0LCAxLCBsaW5lLmNoYXJDb2RlQXQoMCksIDApO1xyXG5cdFx0XHRcdFx0dGhpcy5yZXN1bWVBZnRlcldhaXQoWzBdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dGhpcy5saW5lV2FudGVkKGNhbGxiYWNrLmJpbmQodGhpcykpO1xyXG5cdFx0XHRcdHJldHVybiAnd2FpdCc7XHJcblx0XHRcdFx0XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdC8vIG5vIGV2ZW50XHJcblx0XHRcdFx0R2xrV3JpdGVSZWZlcmVuY2UuY2FsbCh0aGlzLCByZWZlcmVuY2UsIEdsa0NvbnN0LmV2dHlwZV9Ob25lLCAwLCAwLCAwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIGhhbmRsZXJzO1xyXG5cdH1cclxuXHRcclxuXHRcclxuXHRmdW5jdGlvbiBHbGtXcml0ZVJlZmVyZW5jZShyZWZlcmVuY2U6IG51bWJlciwgLi4udmFsdWVzOiBudW1iZXJbXSlcclxuICAgICAgICB7XHJcblx0XHRcdGlmIChyZWZlcmVuY2UgPT0gMHhmZmZmZmZmZil7XHJcbiAgICAgICAgICAgICBcdGZvciAobGV0IGk9MDsgaTx2YWx1ZXMubGVuZ3RoOyBpKyspXHJcblx0XHRcdCAgICBcdHRoaXMucHVzaCh2YWx1ZXNbaV0pO1xyXG5cdFx0XHR9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcblx0XHRcdFx0Zm9yIChsZXQgaT0wOyBpPHZhbHVlcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBcdHRoaXMuaW1hZ2Uud3JpdGVJbnQzMihyZWZlcmVuY2UsIHZhbHVlc1tpXSk7XHJcblx0XHRcdFx0XHRyZWZlcmVuY2UgKz0gNDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuICAgICAgICB9XHJcbn0iLCIvLyBXcml0dGVuIGZyb20gMjAxNSB0byAyMDE2IGJ5IFRoaWxvIFBsYW56IGFuZCBBbmRyZXcgUGxvdGtpblxyXG4vLyBUbyB0aGUgZXh0ZW50IHBvc3NpYmxlIHVuZGVyIGxhdywgSSBoYXZlIGRlZGljYXRlZCBhbGwgY29weXJpZ2h0IGFuZCByZWxhdGVkIGFuZCBuZWlnaGJvcmluZyByaWdodHMgXHJcbi8vIHRvIHRoaXMgc29mdHdhcmUgdG8gdGhlIHB1YmxpYyBkb21haW4gd29ybGR3aWRlLiBUaGlzIHNvZnR3YXJlIGlzIGRpc3RyaWJ1dGVkIHdpdGhvdXQgYW55IHdhcnJhbnR5LiBcclxuLy8gaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvcHVibGljZG9tYWluL3plcm8vMS4wL1xyXG5cclxuLyoqXHJcbiAqIFByb3ZpZGVzIGhhcmRjb2RlZCB2ZXJzaW9ucyBvZiBzb21lIGNvbW1vbmx5IHVzZWQgdmVuZWVyIHJvdXRpbmVzIChsb3ctbGV2ZWxcclxuICogIGZ1bmN0aW9ucyB0aGF0IGFyZSBhdXRvbWF0aWNhbGx5IGNvbXBpbGVkIGludG8gZXZlcnkgSW5mb3JtIGdhbWUpLlxyXG4gKiBJbmZvcm0gZ2FtZXMgcmVseSBoZWF2aWx5IG9uIHRoZXNlIHJvdXRpbmVzLCBhbmQgc3Vic3RpdHV0aW5nIG91ciBcIm5hdGl2ZVwiIHZlcnNpb25zXHJcbiAqIGZvciB0aGUgR2x1bHggdmVyc2lvbnMgaW4gdGhlIHN0b3J5IGZpbGUgY2FuIGluY3JlYXNlIHBlcmZvcm1hbmNlIHNpZ25pZmljYW50bHkuICAgXHJcbiAqL1xyXG5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD0nRW5naW5lLnRzJyAvPlxyXG5cclxubW9kdWxlIEZ5cmVWTSB7XHJcblx0XHJcblx0ICAgIC8vLyBJZGVudGlmaWVzIGEgdmVuZWVyIHJvdXRpbmUgdGhhdCBpcyBpbnRlcmNlcHRlZCwgb3IgYSBjb25zdGFudCB0aGF0XHJcbiAgICAgICAgLy8vIHRoZSByZXBsYWNlbWVudCByb3V0aW5lIG5lZWRzIHRvIHVzZS5cclxuICAgICAgICBleHBvcnQgY29uc3QgZW51bSBWZW5lZXJTbG90XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyByb3V0aW5lIGFkZHJlc3Nlc1xyXG4gICAgICAgICAgICBaX19SZWdpb24gPSAxLFxyXG4gICAgICAgICAgICBDUF9fVGFiID0gMixcclxuICAgICAgICAgICAgT0NfX0NsID0gMyxcclxuICAgICAgICAgICAgUkFfX1ByID0gNCxcclxuICAgICAgICAgICAgUlRfX0NoTERXID0gNSxcclxuICAgICAgICAgICAgVW5zaWduZWRfX0NvbXBhcmUgPSA2LFxyXG4gICAgICAgICAgICBSTF9fUHIgPSA3LFxyXG4gICAgICAgICAgICBSVl9fUHIgPSA4LFxyXG4gICAgICAgICAgICBPUF9fUHIgPSA5LFxyXG4gICAgICAgICAgICBSVF9fQ2hTVFcgPSAxMCxcclxuICAgICAgICAgICAgUlRfX0NoTERCID0gMTEsXHJcbiAgICAgICAgICAgIE1ldGFfX2NsYXNzID0gMTIsXHJcblxyXG4gICAgICAgICAgICAvLyBvYmplY3QgbnVtYmVycyBhbmQgY29tcGlsZXIgY29uc3RhbnRzXHJcbiAgICAgICAgICAgIFN0cmluZyA9IDEwMDEsXHJcbiAgICAgICAgICAgIFJvdXRpbmUgPSAxMDAyLFxyXG4gICAgICAgICAgICBDbGFzcyA9IDEwMDMsXHJcbiAgICAgICAgICAgIE9iamVjdCA9IDEwMDQsXHJcbiAgICAgICAgICAgIFJUX19FcnIgPSAxMDA1LFxyXG4gICAgICAgICAgICBOVU1fQVRUUl9CWVRFUyA9IDEwMDYsXHJcbiAgICAgICAgICAgIGNsYXNzZXNfdGFibGUgPSAxMDA3LFxyXG4gICAgICAgICAgICBJTkRJVl9QUk9QX1NUQVJUID0gMTAwOCxcclxuICAgICAgICAgICAgY3B2X19zdGFydCA9IDEwMDksXHJcbiAgICAgICAgICAgIG9mY2xhc3NfZXJyID0gMTAxMCxcclxuICAgICAgICAgICAgcmVhZHByb3BfZXJyID0gMTAxMSxcclxuICAgICAgICB9XHJcblx0XHJcbiAgICBcclxuICAgICAvLyBSQU0gYWRkcmVzc2VzIG9mIGNvbXBpbGVyLWdlbmVyYXRlZCBnbG9iYWwgdmFyaWFibGVzXHJcbiAgICAgbGV0IFNFTEZfT0ZGU0VUID0gMTY7XHJcbiAgICAgbGV0IFNFTkRFUl9PRkZTRVQgPSAyMDtcclxuICAgICBcclxuICAgICAvLyBvZmZzZXRzIG9mIGNvbXBpbGVyLWdlbmVyYXRlZCBwcm9wZXJ0eSBudW1iZXJzIGZyb20gSU5ESVZfUFJPUF9TVEFSVFxyXG4gICAgIGxldCBDQUxMX1BST1AgPSA1O1xyXG4gICAgIGxldCBQUklOVF9QUk9QID0gNjtcclxuICAgICBsZXQgUFJJTlRfVE9fQVJSQVlfUFJPUCA9IDc7XHJcblxyXG4gICAgICAgICAgXHJcbiAgICBcclxuICAgICBpbnRlcmZhY2UgVmVuZWVyIHtcclxuICAgICAgICAgc3RyaW5nX21jIDogbnVtYmVyLFxyXG4gICAgICAgICByb3V0aW5lX21jIDogbnVtYmVyLFxyXG4gICAgICAgICBjbGFzc19tYyA6IG51bWJlcixcclxuICAgICAgICAgb2JqZWN0X21jIDogbnVtYmVyLFxyXG4gICAgICAgICBudW1fYXR0cl9ieXRlcyA6IG51bWJlcixcclxuICAgICAgICAgY2xhc3Nlc190YWJsZTogbnVtYmVyLFxyXG4gICAgICAgICBpbmRpdl9wcm9wX3N0YXJ0IDogbnVtYmVyLFxyXG4gICAgICAgICBjcHZfc3RhcnQgOiBudW1iZXJcclxuICAgICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWdpc3RlcnMgYSByb3V0aW5lIGFkZHJlc3Mgb3IgY29uc3RhbnQgdmFsdWUsIHVzaW5nIHRoZSBhY2NlbGVyYXRpb25cclxuICAgICAqIGNvZGVzIGRlZmluZWQgaW4gdGhlIEdsdWx4IHNwZWNpZmljYXRpb24uXHJcbiAgICAgKi9cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHNldFNsb3RHbHVseChpc1BhcmFtOiBib29sZWFuLCBzbG90OiBudW1iZXIsIHZhbHVlKSA6IGJvb2xlYW4ge1xyXG4gICAgICAgaWYgKGlzUGFyYW0gJiYgc2xvdCA9PT0gNil7XHJcbiAgICAgICAgICAgbGV0IGltYWdlOiBVbHhJbWFnZSA9IHRoaXMuaW1hZ2U7XHJcbiAgICAgICAgICAgaWYgKHZhbHVlICE9IGltYWdlLmdldFJhbUFkZHJlc3MoU0VMRl9PRkZTRVQpKXtcclxuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCB2YWx1ZSBmb3IgYWNjZWxlcmF0aW9uIHBhcmFtZXRlciA2XCIpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgIH0gXHJcbiAgICAgICBpZiAoaXNQYXJhbSl7XHJcbiAgICAgICAgICAgc3dpdGNoKHNsb3Qpe1xyXG4gICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBzZXRTbG90RnlyZS5jYWxsKHRoaXMsIFZlbmVlclNsb3QuY2xhc3Nlc190YWJsZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICBjYXNlIDE6IHJldHVybiBzZXRTbG90RnlyZS5jYWxsKHRoaXMsIFZlbmVlclNsb3QuSU5ESVZfUFJPUF9TVEFSVCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICBjYXNlIDI6IHJldHVybiBzZXRTbG90RnlyZS5jYWxsKHRoaXMsIFZlbmVlclNsb3QuQ2xhc3MsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gc2V0U2xvdEZ5cmUuY2FsbCh0aGlzLCBWZW5lZXJTbG90Lk9iamVjdCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBzZXRTbG90RnlyZS5jYWxsKHRoaXMsIFZlbmVlclNsb3QuUm91dGluZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICBjYXNlIDU6IHJldHVybiBzZXRTbG90RnlyZS5jYWxsKHRoaXMsIFZlbmVlclNsb3QuU3RyaW5nLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgIGNhc2UgNzogcmV0dXJuIHNldFNsb3RGeXJlLmNhbGwodGhpcywgVmVuZWVyU2xvdC5OVU1fQVRUUl9CWVRFUywgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICBjYXNlIDg6IHJldHVybiBzZXRTbG90RnlyZS5jYWxsKHRoaXMsIFZlbmVlclNsb3QuY3B2X19zdGFydCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gZmFsc2U7IFxyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHN3aXRjaChzbG90KXtcclxuICAgICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gc2V0U2xvdEZ5cmUuY2FsbCh0aGlzLCBWZW5lZXJTbG90LlpfX1JlZ2lvbiwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICBjYXNlIDI6IHJldHVybiBzZXRTbG90RnlyZS5jYWxsKHRoaXMsIFZlbmVlclNsb3QuQ1BfX1RhYiwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICBjYXNlIDM6IHJldHVybiBzZXRTbG90RnlyZS5jYWxsKHRoaXMsIFZlbmVlclNsb3QuUkFfX1ByLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIHNldFNsb3RGeXJlLmNhbGwodGhpcywgVmVuZWVyU2xvdC5STF9fUHIsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgY2FzZSA1OiByZXR1cm4gc2V0U2xvdEZ5cmUuY2FsbCh0aGlzLCBWZW5lZXJTbG90Lk9DX19DbCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICBjYXNlIDY6IHJldHVybiBzZXRTbG90RnlyZS5jYWxsKHRoaXMsIFZlbmVlclNsb3QuUlZfX1ByLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgIGNhc2UgNzogcmV0dXJuIHNldFNsb3RGeXJlLmNhbGwodGhpcywgVmVuZWVyU2xvdC5PUF9fUHIsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIGZhbHNlOyBcclxuICAgICAgICAgICBcclxuICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqICBSZWdpc3RlcnMgYSByb3V0aW5lIGFkZHJlc3Mgb3IgY29uc3RhbnQgdmFsdWUsIHVzaW5nIHRoZSB0cmFkaXRpb25hbFxyXG4gICAgICogIEZ5cmVWTSBzbG90IGNvZGVzLlxyXG4gICAgICovXHJcblx0XHJcblx0IGV4cG9ydCBmdW5jdGlvbiBzZXRTbG90RnlyZShzbG90OlZlbmVlclNsb3QsIHZhbHVlKSA6IGJvb2xlYW57XHJcblx0XHQgbGV0IHYgOiBWZW5lZXIgPSB0aGlzLnZlbmVlcjtcclxuICAgICAgICAgc3dpdGNoKHNsb3Qpe1xyXG5cdFx0XHQgY2FzZSBWZW5lZXJTbG90LlpfX1JlZ2lvbjogdGhpcy52ZW5lZXJbdmFsdWVdID0gWl9fUmVnaW9uOyByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0IGNhc2UgVmVuZWVyU2xvdC5DUF9fVGFiOiB0aGlzLnZlbmVlclt2YWx1ZV0gPSBDUF9fVGFiOyByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgIGNhc2UgVmVuZWVyU2xvdC5PQ19fQ2w6IHRoaXMudmVuZWVyW3ZhbHVlXSA9IE9DX19DbDsgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICBjYXNlIFZlbmVlclNsb3QuUkFfX1ByOiB0aGlzLnZlbmVlclt2YWx1ZV0gPSBSQV9fUHI7IHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgY2FzZSBWZW5lZXJTbG90LlJUX19DaExEVzogdGhpcy52ZW5lZXJbdmFsdWVdID0gUlRfX0NoTERXOyByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgIGNhc2UgVmVuZWVyU2xvdC5VbnNpZ25lZF9fQ29tcGFyZTogdGhpcy52ZW5lZXJbdmFsdWVdID0gVW5zaWduZWRfX0NvbXBhcmU7IHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgY2FzZSBWZW5lZXJTbG90LlJMX19QcjogdGhpcy52ZW5lZXJbdmFsdWVdID0gUkxfX1ByOyByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgIGNhc2UgVmVuZWVyU2xvdC5SVl9fUHI6IHRoaXMudmVuZWVyW3ZhbHVlXSA9IFJWX19QcjsgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICBjYXNlIFZlbmVlclNsb3QuT1BfX1ByOiB0aGlzLnZlbmVlclt2YWx1ZV0gPSBPUF9fUHI7IHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgY2FzZSBWZW5lZXJTbG90LlJUX19DaFNUVzogdGhpcy52ZW5lZXJbdmFsdWVdID0gUlRfX0NoU1RXOyByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgIGNhc2UgVmVuZWVyU2xvdC5SVF9fQ2hMREI6IHRoaXMudmVuZWVyW3ZhbHVlXSA9IFJUX19DaExEQjsgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICBjYXNlIFZlbmVlclNsb3QuTWV0YV9fY2xhc3M6IHRoaXMudmVuZWVyW3ZhbHVlXSA9IE1ldGFfX2NsYXNzOyByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgY2FzZSBWZW5lZXJTbG90LlN0cmluZzogdi5zdHJpbmdfbWMgPSB2YWx1ZTsgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICBjYXNlIFZlbmVlclNsb3QuUm91dGluZTogdi5yb3V0aW5lX21jID0gdmFsdWU7IHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgY2FzZSBWZW5lZXJTbG90LkNsYXNzOiB2LmNsYXNzX21jID0gdmFsdWU7IHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgY2FzZSBWZW5lZXJTbG90Lk9iamVjdDogdi5vYmplY3RfbWMgPSB2YWx1ZTsgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICBjYXNlIFZlbmVlclNsb3QuTlVNX0FUVFJfQllURVM6IHYubnVtX2F0dHJfYnl0ZXMgPSB2YWx1ZTsgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICBjYXNlIFZlbmVlclNsb3QuY2xhc3Nlc190YWJsZTogdi5jbGFzc2VzX3RhYmxlID0gdmFsdWU7IHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgY2FzZSBWZW5lZXJTbG90LklORElWX1BST1BfU1RBUlQ6IHYuaW5kaXZfcHJvcF9zdGFydCA9IHZhbHVlOyByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgIGNhc2UgVmVuZWVyU2xvdC5jcHZfX3N0YXJ0OiB2LmNwdl9zdGFydCA9IHZhbHVlOyByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgLy8gcnVuLXRpbWUgZXJyb3IgaGFuZGxlcnMgYXJlIGp1c3QgaWdub3JlZCAod2UgbG9nIGFuIGVycm9yIG1lc3NhZ2UgaW5zdGVhZCwgbGlrZSBRdWl4ZSBkb2VzLCBubyBOZXN0ZWRDYWxsIGEgbGEgRnlyZVZNKVxyXG4gICAgICAgICAgICAgY2FzZSBWZW5lZXJTbG90LlJUX19FcnI6XHJcbiAgICAgICAgICAgICBjYXNlIFZlbmVlclNsb3Qub2ZjbGFzc19lcnI6XHJcbiAgICAgICAgICAgICBjYXNlIFZlbmVlclNsb3QucmVhZHByb3BfZXJyOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgZGVmYXVsdDogXHJcbiAgICAgICAgICAgICBcdFx0Y29uc29sZS53YXJuKGBpZ25vcmluZyB2ZW5lZXIgJHtzbG90fSAke3ZhbHVlfWApO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFxyXG5cdFx0IH1cclxuXHQgfVxyXG5cdFxyXG4gICAgIGZ1bmN0aW9uIFVuc2lnbmVkX19Db21wYXJlKGEsYil7XHJcbiAgICAgICAgICBhID0gYSA+Pj4gMDtcclxuICAgICAgICAgIGIgPSBiID4+PiAwO1xyXG4gICAgICAgICAgaWYgKGEgPiBiKSByZXR1cm4gMTtcclxuICAgICAgICAgIGlmIChhIDwgYikgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgfVxyXG4gICAgXHJcblx0XHJcblx0IC8vIGRpc3Rpbmd1aXNoZXMgYmV0d2VlbiBzdHJpbmdzLCByb3V0aW5lcywgYW5kIG9iamVjdHNcclxuICAgICBmdW5jdGlvbiBaX19SZWdpb24oYWRkcmVzczpudW1iZXIpIDogbnVtYmVye1xyXG5cdFx0IGxldCBpbWFnZTogVWx4SW1hZ2UgPSB0aGlzLmltYWdlO1xyXG5cdFx0IGlmIChhZGRyZXNzIDwgMzYgfHwgYWRkcmVzcyA+PSBpbWFnZS5nZXRFbmRNZW0oKSlcclxuXHRcdCBcdHJldHVybiAwO1xyXG5cdFx0XHJcblx0XHQgbGV0IHR5cGUgPSBpbWFnZS5yZWFkQnl0ZShhZGRyZXNzKTtcclxuXHRcdCBpZiAodHlwZSA+PSAweEUwKSByZXR1cm4gMztcclxuXHRcdCBpZiAodHlwZSA+PSAweEMwKSByZXR1cm4gMjtcclxuXHRcdCBpZiAodHlwZSA+PSAweDcwICYmIHR5cGUgPD0gMHg3RiAmJiBhZGRyZXNzID49IGltYWdlLmdldFJhbUFkZHJlc3MoMCkpIHJldHVybiAxO1xyXG5cdCBcdCByZXR1cm4gMDtcclxuXHQgfSAgXHJcbiAgICAgXHJcbiAgICAgXHJcbiAgICAgIC8vIGZpbmRzIGFuIG9iamVjdCdzIGNvbW1vbiBwcm9wZXJ0eSB0YWJsZVxyXG4gICAgICAgIGZ1bmN0aW9uIENQX19UYWIob2JqLGlkKSA6IG51bWJlclxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKFpfX1JlZ2lvbi5jYWxsKHRoaXMsIG9iaikgIT0gMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gZXJyb3IgXCJoYW5kbGluZ1wiIGluc3BpcmVkIGJ5IFF1aXhlXHJcbiAgICAgICAgICAgICAgICAvLyBpbnN0ZWFkIG9mIGRvaW5nIGEgTmVzdGVkQ2FsbCB0byB0aGUgc3VwcGxpZWQgZXJyb3IgaGFuZGxlclxyXG4gICAgICAgICAgICAgICAgLy8ganVzdCBsb2cgYW4gZXJyb3IgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlsqKiBQcm9ncmFtbWluZyBlcnJvcjogdHJpZWQgdG8gZmluZCB0aGUgXFxcIi5cXFwiIG9mIChzb21ldGhpbmcpICoqXVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBpbWFnZTogVWx4SW1hZ2UgPSB0aGlzLmltYWdlO1xyXG5cdFxyXG4gICAgICAgICAgICBsZXQgb3RhYiA9IGltYWdlLnJlYWRJbnQzMihvYmogKyAxNik7XHJcbiAgICAgICAgICAgIGlmIChvdGFiID09IDApXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgbGV0IG1heCA9IGltYWdlLnJlYWRJbnQzMihvdGFiKTtcclxuICAgICAgICAgICAgb3RhYiArPSA0O1xyXG4gICAgICAgICAgICAvLyBQZXJmb3JtQmluYXJ5U2VhcmNoXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wY29kZXNbMHgxNTFdLmhhbmRsZXIuY2FsbCh0aGlzLCBpZCwgMiwgb3RhYiwgMTAsIG1heCwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgIFxyXG4gICAgIFxyXG4gICAgICAvLyBmaW5kcyB0aGUgbG9jYXRpb24gb2YgYW4gb2JqZWN0IChcInBhcmVudCgpXCIgZnVuY3Rpb24pXHJcbiAgICAgIGZ1bmN0aW9uIFBhcmVudChvYmope1xyXG4gICAgICAgICByZXR1cm4gdGhpcy5pbWFnZS5yZWFkSW50MzIob2JqICsgMSArIHRoaXMudmVuZWVyLm51bV9hdHRyX2J5dGVzICsgMTIpO1xyXG4gICAgICB9XHJcbiAgICAgXHJcbiAgICAgLy8gZGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIG1lbWJlciBvZiBhIGdpdmVuIGNsYXNzIChcIm9mY2xhc3NcIiBvcGVyYXRvcilcclxuICAgICAgZnVuY3Rpb24gT0NfX0NsKG9iaiwgY2xhKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgIGxldCB2IDogVmVuZWVyID0gdGhpcy52ZW5lZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHN3aXRjaCAoWl9fUmVnaW9uLmNhbGwodGhpcywgb2JqKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoY2xhID09PSB2LnN0cmluZ19tYyA/IDEgOiAwKTtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoY2xhID09PSB2LnJvdXRpbmVfbWMgPyAxIDogMCk7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2xhID09PSB2LmNsYXNzX21jKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFBhcmVudC5jYWxsKHRoaXMsIG9iaikgPT09IHYuY2xhc3NfbWMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9iaiA9PT0gdi5jbGFzc19tYyB8fCBvYmogPT09IHYuc3RyaW5nX21jIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmogPT09IHYucm91dGluZV9tYyB8fCBvYmogPT09IHYub2JqZWN0X21jKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbGEgPT0gdGhpcy52ZW5lZXIub2JqZWN0X21jKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFBhcmVudC5jYWxsKHRoaXMsIG9iaikgPT0gdi5jbGFzc19tYylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqID09IHYuY2xhc3NfbWMgfHwgb2JqID09IHYuc3RyaW5nX21jIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmogPT0gdi5yb3V0aW5lX21jIHx8IG9iaiA9PSB2Lm9iamVjdF9tYylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2xhID09IHYuc3RyaW5nX21jIHx8IGNsYSA9PSB2LnJvdXRpbmVfbWMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFBhcmVudC5jYWxsKHRoaXMsIGNsYSkgIT0gdi5jbGFzc19tYylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbKiogUHJvZ3JhbW1pbmcgZXJyb3I6IHRyaWVkIHRvIGFwcGx5ICdvZmNsYXNzJyB3aXRoIG5vbi1jbGFzcyAqKl1cIikgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGltYWdlOiBVbHhJbWFnZSA9IHRoaXMuaW1hZ2U7XHJcblx0XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlubGlzdCA9IFJBX19Qci5jYWxsKHRoaXMsIG9iaiwgMik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlubGlzdCA9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmxpc3RsZW4gPSBSTF9fUHIuY2FsbCh0aGlzLCBvYmosIDIpIC8gNDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqeCA9IDA7IGp4IDwgaW5saXN0bGVuOyBqeCsrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1hZ2UucmVhZEludDMyKGlubGlzdCArIGp4ICogNCkgPT09IGNsYSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgXHJcbiAgICAgLy8gZmluZHMgdGhlIGFkZHJlc3Mgb2YgYW4gb2JqZWN0J3MgcHJvcGVydHkgKFwiLiZcIiBvcGVyYXRvcilcclxuICAgICAgICBmdW5jdGlvbiBSQV9fUHIob2JqLCBpZCkgOiBudW1iZXJcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBjbGEgPSAwO1xyXG4gICAgICAgICAgICAgbGV0IGltYWdlOiBVbHhJbWFnZSA9IHRoaXMuaW1hZ2U7XHJcblx0XHJcbiAgICAgICAgICAgIGlmICgoaWQgJiAweEZGRkYwMDAwKSAhPSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjbGEgPSBpbWFnZS5yZWFkSW50MzIodGhpcy52ZW5lZXIuY2xhc3Nlc190YWJsZSArIDQgKiAoaWQgJiAweEZGRkYpKTtcclxuICAgICAgICAgICAgICAgIGlmIChPQ19fQ2wuY2FsbCh0aGlzLCBvYmosIGNsYSkgPT0gMClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZCA+Pj0gMTY7XHJcbiAgICAgICAgICAgICAgICBvYmogPSBjbGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9wID0gQ1BfX1RhYi5jYWxsKHRoaXMsIG9iaiwgaWQpO1xyXG4gICAgICAgICAgICBpZiAocHJvcCA9PSAwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoUGFyZW50LmNhbGwodGhpcywgb2JqKSA9PT0gdGhpcy52ZW5lZXIuY2xhc3NfbWMgJiYgY2xhID09IDApXHJcbiAgICAgICAgICAgICAgICBpZiAoaWQgPCB0aGlzLnZlbmVlci5pbmRpdl9wcm9wX3N0YXJ0IHx8IGlkID49IHRoaXMudmVuZWVyLmluZGl2X3Byb3Bfc3RhcnQgKyA4KVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKGltYWdlLnJlYWRJbnQzMihpbWFnZS5nZXRSYW1BZGRyZXNzKFNFTEZfT0ZGU0VUKSkgIT0gb2JqKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXggPSAoaW1hZ2UucmVhZEJ5dGUocHJvcCArIDkpICYgMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXggIT0gMClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGltYWdlLnJlYWRJbnQzMihwcm9wICsgNCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICBcclxuICAgICAvLyBmaW5kcyB0aGUgbGVuZ3RoIG9mIGFuIG9iamVjdCdzIHByb3BlcnR5IChcIi4jXCIgb3BlcmF0b3IpXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFJMX19QcihvYmosIGlkKTogbnVtYmVyXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCBjbGEgPSAwO1xyXG4gICAgICAgICAgICAgICAgbGV0IGltYWdlOiBVbHhJbWFnZSA9IHRoaXMuaW1hZ2U7XHJcblx0XHJcbiAgICAgICAgICAgICAgICBpZiAoKGlkICYgMHhGRkZGMDAwMCkgIT0gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGEgPSBpbWFnZS5yZWFkSW50MzIodGhpcy52ZW5lZXIuY2xhc3Nlc190YWJsZSArIDQgKiAoaWQgJiAweEZGRkYpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoT0NfX0NsLmNhbGwodGhpcywgb2JqLCBjbGEpID09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZCA+Pj0gMTY7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqID0gY2xhO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBwcm9wID0gQ1BfX1RhYi5jYWxsKHRoaXMsIG9iaiwgaWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3AgPT0gMClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoUGFyZW50LmNhbGwodGhpcywgb2JqKSA9PSB0aGlzLnZlbmVlci5jbGFzc19tYyAmJiBjbGEgPT0gMClcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWQgPCB0aGlzLnZlbmVlci5pbmRpdl9wcm9wX3N0YXJ0IHx8IGlkID49IHRoaXMudmVuZWVyLmluZGl2X3Byb3Bfc3RhcnQgKyA4KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW1hZ2UucmVhZEludDMyKGltYWdlLmdldFJhbUFkZHJlc3MoU0VMRl9PRkZTRVQpKSAhPSBvYmopXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl4ID0gKGltYWdlLnJlYWRCeXRlKHByb3AgKyA5KSAmIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpeCAhPSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gNCAqIGltYWdlLnJlYWRJbnQxNihwcm9wICsgMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICBcclxuICAgICBcclxuICAgICAgIC8vIHBlcmZvcm1zIGJvdW5kcyBjaGVja2luZyB3aGVuIHJlYWRpbmcgZnJvbSBhIHdvcmQgYXJyYXkgKFwiLS0+XCIgb3BlcmF0b3IpXHJcbiAgICAgICAgZnVuY3Rpb24gUlRfX0NoTERXKGFycmF5LCBvZmZzZXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgYWRkcmVzcyA9IGFycmF5ICsgNCAqIG9mZnNldDtcclxuICAgICAgICAgICAgbGV0IGltYWdlOiBVbHhJbWFnZSA9IHRoaXMuaW1hZ2U7XHJcblx0XHJcbiAgICAgICAgICAgIGlmIChhZGRyZXNzID49IGltYWdlLmdldEVuZE1lbSgpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiWyoqIFByb2dyYW1taW5nIGVycm9yOiB0cmllZCB0byByZWFkIGZyb20gd29yZCBhcnJheSBiZXlvbmQgRW5kTWVtICoqXVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpbWFnZS5yZWFkSW50MzIoYWRkcmVzcyk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLy8gcmVhZHMgdGhlIHZhbHVlIG9mIGFuIG9iamVjdCdzIHByb3BlcnR5IChcIi5cIiBvcGVyYXRvcilcclxuICAgICAgICBmdW5jdGlvbiBSVl9fUHIob2JqLCBpZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGFkZHIgPSBSQV9fUHIuY2FsbCh0aGlzLCBvYmosIGlkKTtcclxuICAgICAgICAgICAgbGV0IGltYWdlOiBVbHhJbWFnZSA9IHRoaXMuaW1hZ2U7XHJcblx0XHJcbiAgICAgICAgICAgIGlmIChhZGRyID09IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCB2IDogVmVuZWVyID0gdGhpcy52ZW5lZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoaWQgPiAwICYmIGlkIDwgdi5pbmRpdl9wcm9wX3N0YXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbWFnZS5yZWFkSW50MzIodi5jcHZfc3RhcnQgKyA0ICogaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbKiogUHJvZ3JhbW1pbmcgZXJyb3I6IHRyaWVkIHRvIHJlYWQgKHNvbWV0aGluZykgKipdXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpbWFnZS5yZWFkSW50MzIoYWRkcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICBcclxuICAgICAgLy8gZGV0ZXJtaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBwcm92aWRlcyBhIGdpdmVuIHByb3BlcnR5IChcInByb3ZpZGVzXCIgb3BlcmF0b3IpXHJcbiAgICAgIGZ1bmN0aW9uIE9QX19QcihvYmosIGlkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdiA6IFZlbmVlciA9IHRoaXMudmVuZWVyO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChaX19SZWdpb24uY2FsbCh0aGlzLCBvYmopKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlkID09IHYuaW5kaXZfcHJvcF9zdGFydCArIFBSSU5UX1BST1AgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkID09IHYuaW5kaXZfcHJvcF9zdGFydCArIFBSSU5UX1RPX0FSUkFZX1BST1ApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlkID09IHYuaW5kaXZfcHJvcF9zdGFydCArIENBTExfUFJPUClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWQgPj0gdi5pbmRpdl9wcm9wX3N0YXJ0ICYmIGlkIDwgdi5pbmRpdl9wcm9wX3N0YXJ0ICsgOClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChQYXJlbnQuY2FsbCh0aGlzLCBvYmopID09IHYuY2xhc3NfbWMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoUkFfX1ByLmNhbGwodGhpcywgb2JqLCBpZCkgIT0gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICBcclxuICAgICAgLy8gcGVyZm9ybXMgYm91bmRzIGNoZWNraW5nIHdoZW4gd3JpdGluZyB0byBhIHdvcmQgYXJyYXkgKFwiLS0+XCIgb3BlcmF0b3IpXHJcbiAgICAgICAgZnVuY3Rpb24gUlRfX0NoU1RXKGFycmF5LCBvZmZzZXQsIHZhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZTogVWx4SW1hZ2UgPSB0aGlzLmltYWdlO1xyXG5cdCAgICAgICAgbGV0IGFkZHJlc3MgPSBhcnJheSArIDQgKiBvZmZzZXQ7XHJcbiAgICAgICAgICAgIGlmIChhZGRyZXNzID49IGltYWdlLmdldEVuZE1lbSgpIHx8IGFkZHJlc3MgPCBpbWFnZS5nZXRSYW1BZGRyZXNzKDApKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiWyoqIFByb2dyYW1taW5nIGVycm9yOiB0cmllZCB0byB3cml0ZSB0byB3b3JkIGFycmF5IG91dHNpZGUgb2YgUkFNICoqXVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1hZ2Uud3JpdGVJbnQzMihhZGRyZXNzLCB2YWwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgIC8vIHBlcmZvcm1zIGJvdW5kcyBjaGVja2luZyB3aGVuIHJlYWRpbmcgZnJvbSBhIGJ5dGUgYXJyYXkgKFwiLT5cIiBvcGVyYXRvcilcclxuICAgICAgICBmdW5jdGlvbiBSVF9fQ2hMREIoYXJyYXksIG9mZnNldClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBhZGRyZXNzID0gYXJyYXkgKyBvZmZzZXQ7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZTogVWx4SW1hZ2UgPSB0aGlzLmltYWdlO1xyXG5cdCAgICAgICBcclxuICAgICAgICAgICAgaWYgKGFkZHJlc3MgPj0gaW1hZ2UuZ2V0RW5kTWVtKCkpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlsqKiBQcm9ncmFtbWluZyBlcnJvcjogdHJpZWQgdG8gcmVhZCBmcm9tIGJ5dGUgYXJyYXkgYmV5b25kIEVuZE1lbSAqKl1cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGltYWdlLnJlYWRCeXRlKGFkZHJlc3MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgXHJcbiAgICAgIC8vIGRldGVybWluZXMgdGhlIG1ldGFjbGFzcyBvZiBhIHJvdXRpbmUsIHN0cmluZywgb3Igb2JqZWN0IChcIm1ldGFjbGFzcygpXCIgZnVuY3Rpb24pXHJcbiAgICAgIGZ1bmN0aW9uIE1ldGFfX2NsYXNzKG9iaikgOiBudW1iZXJcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoWl9fUmVnaW9uLmNhbGwodGhpcywgb2JqKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZlbmVlci5yb3V0aW5lX21jO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZlbmVlci5zdHJpbmdfbWM7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFBhcmVudC5jYWxsKHRoaXMsb2JqKSA9PT0gdGhpcy52ZW5lZXIuY2xhc3NfbWMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZlbmVlci5jbGFzc19tYztcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqID09IHRoaXMudmVuZWVyLmNsYXNzX21jIHx8IG9iaiA9PSB0aGlzLnZlbmVlci5zdHJpbmdfbWMgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqID09IHRoaXMudmVuZWVyLnJvdXRpbmVfbWMgfHwgb2JqID09IHRoaXMudmVuZWVyLm9iamVjdF9tYylcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmVuZWVyLmNsYXNzX21jO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZlbmVlci5vYmplY3RfbWM7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXHJcblx0XHJcblx0XHJcblx0XHJcbn0iLCIvLyBXcml0dGVuIGluIDIwMTUgYnkgVGhpbG8gUGxhbnogYW5kIEFuZHJldyBQbG90a2luXHJcbi8vIFRvIHRoZSBleHRlbnQgcG9zc2libGUgdW5kZXIgbGF3LCBJIGhhdmUgZGVkaWNhdGVkIGFsbCBjb3B5cmlnaHQgYW5kIHJlbGF0ZWQgYW5kIG5laWdoYm9yaW5nIHJpZ2h0cyBcclxuLy8gdG8gdGhpcyBzb2Z0d2FyZSB0byB0aGUgcHVibGljIGRvbWFpbiB3b3JsZHdpZGUuIFRoaXMgc29mdHdhcmUgaXMgZGlzdHJpYnV0ZWQgd2l0aG91dCBhbnkgd2FycmFudHkuIFxyXG4vLyBodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9wdWJsaWNkb21haW4vemVyby8xLjAvXHJcblxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPScuLi9tZXJzZW5uZS10d2lzdGVyLnRzJyAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPSdHbGtXcmFwcGVyLnRzJyAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPSdWZW5lZXIudHMnIC8+XHJcblxyXG5tb2R1bGUgRnlyZVZNIHtcclxuXHRcclxuXHQvKipcclxuXHQgKiBhbiBPcGNvZGVIYW5kbGVyIHRha2VzIGFueSBudW1iZXIgb2YgYXJndW1lbnRzIChhbGwgbnVtYmVycylcclxuXHQgKiBhbmQgcmV0dXJucyBub3RoaW5nLCBvciBhIG51bWJlciwgb3IgbXVsdGlwbGUgbnVtYmVyc1xyXG5cdCAqL1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgT3Bjb2RlSGFuZGxlcntcclxuXHRcdCguLi5hbnk6bnVtYmVyW10pIDogdm9pZCB8IG51bWJlciB8IG51bWJlcltdXHJcblx0fVxyXG5cdFxyXG5cdGV4cG9ydCBjbGFzcyBPcGNvZGUge1xyXG5cdFx0Y29kZTogbnVtYmVyO1xyXG5cdFx0bmFtZTogc3RyaW5nO1xyXG5cdFx0bG9hZEFyZ3M6IG51bWJlcjtcclxuXHRcdHN0b3JlQXJnczogbnVtYmVyO1xyXG5cdFx0aGFuZGxlcjpPcGNvZGVIYW5kbGVyO1xyXG5cdFx0cnVsZTpPcGNvZGVSdWxlO1xyXG5cdFx0Y29uc3RydWN0b3IoY29kZTogbnVtYmVyLCBuYW1lOiBzdHJpbmcsIGxvYWRBcmdzOiBudW1iZXIsIHN0b3JlQXJnczogbnVtYmVyLCBoYW5kbGVyOk9wY29kZUhhbmRsZXIsIHJ1bGU/Ok9wY29kZVJ1bGUpe1xyXG5cdFx0XHR0aGlzLmNvZGUgPSBjb2RlO1xyXG5cdFx0XHR0aGlzLm5hbWUgPSBuYW1lO1xyXG5cdFx0XHR0aGlzLmxvYWRBcmdzID0gbG9hZEFyZ3M7XHJcblx0XHRcdHRoaXMuc3RvcmVBcmdzID0gc3RvcmVBcmdzO1xyXG5cdFx0XHR0aGlzLmhhbmRsZXIgPSBoYW5kbGVyO1xyXG5cdFx0XHR0aGlzLnJ1bGUgPSBydWxlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRleHBvcnQgY29uc3QgZW51bSBHZXN0YWx0ICB7XHJcbiAgICAgICAgICAgIEdsdWx4VmVyc2lvbiA9IDAsXHJcbiAgICAgICAgICAgIFRlcnBWZXJzaW9uID0gMSxcclxuICAgICAgICAgICAgUmVzaXplTWVtID0gMixcclxuICAgICAgICAgICAgVW5kbyA9IDMsXHJcbiAgICAgICAgICAgIElPU3lzdGVtID0gNCxcclxuICAgICAgICAgICAgVW5pY29kZSA9IDUsXHJcbiAgICAgICAgICAgIE1lbUNvcHkgPSA2LFxyXG4gICAgICAgICAgICBNQWxsb2MgPSA3LFxyXG4gICAgICAgICAgICBNQWxsb2NIZWFwID0gOCxcclxuICAgICAgICAgICAgQWNjZWxlcmF0aW9uID0gOSxcclxuICAgICAgICAgICAgQWNjZWxGdW5jID0gMTAsXHJcbiAgICAgICAgICAgIEZsb2F0ID0gMTEsXHJcblx0XHRcdFxyXG5cdFx0XHQvKiogIFxyXG5cdFx0XHQgKiBFeHRVbmRvICgxMik6IFxyXG5cdFx0XHQgKiBSZXR1cm5zIDEgaWYgdGhlIGludGVycHJldGVyIHN1cHBvcnRzIHRoZSBoYXN1bmRvIGFuZCBkaXNjYXJkdW5kbyBvcGNvZGVzLiBcclxuXHRcdFx0ICogKFRoaXMgbXVzdCB0cnVlIGZvciBhbnkgdGVycCBzdXBwb3J0aW5nIEdsdWx4IDMuMS4zLiBPbiBhIHRlcnAgd2hpY2ggZG9lcyBub3Qgc3VwcG9ydCB1bmRvIGZ1bmN0aW9uYWxpdHksIFxyXG5cdFx0XHQgKiB0aGVzZSBvcGNvZGVzIHdpbGwgYmUgY2FsbGFibGUgYnV0IHdpbGwgZmFpbC4pXHJcblx0XHRcdCAqL1xyXG5cdFx0XHRFeHRVbmRvID0gMTIgXHJcbiAgICAgICAgfVxyXG5cdFx0XHJcblx0XHQvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIFNlbGVjdHMgYSBmdW5jdGlvbiBmb3IgdGhlIEZ5cmVWTSBzeXN0ZW0gY2FsbCBvcGNvZGUuXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICBleHBvcnQgY29uc3QgZW51bSBGeXJlQ2FsbFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gUmVhZHMgYSBsaW5lIGZyb20gdGhlIHVzZXI6IGFyZ3NbMV0gPSBidWZmZXIsIGFyZ3NbMl0gPSBidWZmZXIgc2l6ZS5cclxuICAgICAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgUmVhZExpbmUgPSAxLFxyXG5cdFx0XHQgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIFJlYWRzIGEgY2hhcmFjdGVyIGZyb20gdGhlIHVzZXI6IHJlc3VsdCA9IHRoZSAxNi1iaXQgVW5pY29kZSB2YWx1ZS5cclxuICAgICAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgUmVhZEtleSA9IDIsXHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIENvbnZlcnRzIGEgY2hhcmFjdGVyIHRvIGxvd2VyY2FzZTogYXJnc1sxXSA9IHRoZSBjaGFyYWN0ZXIsXHJcbiAgICAgICAgICAgIC8vLyByZXN1bHQgPSB0aGUgbG93ZXJjYXNlZCBjaGFyYWN0ZXIuXHJcbiAgICAgICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIFRvTG93ZXIgPSAzLFxyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyBDb252ZXJ0cyBhIGNoYXJhY3RlciB0byB1cHBlcmNhc2U6IGFyZ3NbMV0gPSB0aGUgY2hhcmFjdGVyLFxyXG4gICAgICAgICAgICAvLy8gcmVzdWx0ID0gdGhlIHVwcGVyY2FzZWQgY2hhcmFjdGVyLlxyXG4gICAgICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICBUb1VwcGVyID0gNCxcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gU2VsZWN0cyBhbiBvdXRwdXQgY2hhbm5lbDogYXJnc1sxXSA9IGFuIE91dHB1dENoYW5uZWwgdmFsdWUgKHNlZSBPdXRwdXQuY3MpLlxyXG4gICAgICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICBDaGFubmVsID0gNSwgXHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIFJlZ2lzdGVycyBhIHZlbmVlciBmdW5jdGlvbiBhZGRyZXNzIG9yIGNvbnN0YW50IHZhbHVlOiBhcmdzWzFdID0gYVxyXG4gICAgICAgICAgICAvLy8gVmVuZWVyU2xvdCB2YWx1ZSAoc2VlIFZlbmVlci5jcyksIGFyZ3NbMl0gPSB0aGUgZnVuY3Rpb24gYWRkcmVzcyBvclxyXG4gICAgICAgICAgICAvLy8gY29uc3RhbnQgdmFsdWUsIHJlc3VsdCA9IG5vbnplcm8gaWYgdGhlIHZhbHVlIHdhcyBhY2NlcHRlZC5cclxuICAgICAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgU2V0VmVuZWVyID0gNixcclxuXHRcdFx0Ly8vIFhNTCBGaWx0ZXJpbmcgd2lsbCB0dXJuIHRoaW5ncyBpbnRvIFhBTUwgdGFncyBmb3IgU2lsdmVybGlnaHQgb3IgV1BGLlxyXG5cdFx0XHRYTUxGaWx0ZXIgPSA3LFxyXG5cdFx0XHQvLy8gc3R5bGVzOiB7IFJvbWFuID0gMSwgQm9sZCA9IDIsIEl0YWxpYyA9IDMsIEZpeGVkID0gNCwgVmFyaWFibGUgPSA1LH1cclxuXHRcdFx0U2V0U3R5bGUgPSA4XHJcbiAgICAgICAgfVxyXG5cclxuXHRcclxuXHQvLyBjb2VyY2UgSmF2YXNjcmlwdCBudW1iZXIgaW50byB1aW50MzIgcmFuZ2VcclxuXHRmdW5jdGlvbiB1aW50MzIoeDpudW1iZXIpIDogbnVtYmVye1xyXG5cdFx0cmV0dXJuIHggPj4+IDA7XHJcblx0fVxyXG5cdFxyXG5cdC8vIGNvZXJjZSB1aW50MzIgbnVtYmVyIGludG8gIChzaWduZWQhKSBpbnQzMiByYW5nZVxyXG5cdFxyXG5cdGZ1bmN0aW9uIGludDMyKHg6IG51bWJlcikgOm51bWJlcntcclxuXHRcdHJldHVybiB4IHwgMDtcclxuXHR9XHJcblx0XHJcblx0XHJcblx0ZXhwb3J0IG1vZHVsZSBPcGNvZGVze1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGluaXRPcGNvZGVzKCl7XHJcblx0XHRcdGxldCBvcGNvZGVzOiBPcGNvZGVbXSA9IFtdO1xyXG5cdFx0XHRcclxuXHRcdFx0ZnVuY3Rpb24gb3Bjb2RlKGNvZGU6IG51bWJlciwgbmFtZTogc3RyaW5nLCBsb2FkQXJnczogbnVtYmVyLCBzdG9yZUFyZ3M6IG51bWJlciwgaGFuZGxlcjpPcGNvZGVIYW5kbGVyLCBydWxlPzpPcGNvZGVSdWxlKXtcclxuXHRcdFx0XHRvcGNvZGVzW2NvZGVdID0gbmV3IE9wY29kZShjb2RlLCBuYW1lLCBsb2FkQXJncywgc3RvcmVBcmdzLCBoYW5kbGVyLCBydWxlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MDAsICdub3AnLCAwLCAwLCBcclxuXHRcdFx0XHRmdW5jdGlvbigpeyB9KTtcclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDEwLCAnYWRkJywgMiwgMSxcclxuXHRcdFx0XHRmdW5jdGlvbiBhZGQoYSxiKXsgcmV0dXJuIHVpbnQzMihhK2IpfSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDExLCAnc3ViJywgMiwgMSxcclxuXHRcdFx0XHRmdW5jdGlvbiBzdWIoYSxiKXsgcmV0dXJuIHVpbnQzMihhLWIpfSk7XHRcdFx0XHRcclxuXHRcdFxyXG5cdFx0XHRvcGNvZGUoMHgxMiwgJ211bCcsIDIsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gbXVsKGEsYil7IHJldHVybiB1aW50MzIoKDxhbnk+TWF0aCkuaW11bChpbnQzMihhKSxpbnQzMihiKSkpfSk7XHJcblx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MTMsICdkaXYnLCAyLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGRpdihhLGIpeyByZXR1cm4gdWludDMyKGludDMyKGEpIC8gaW50MzIoYikpfSk7XHJcblx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MTQsICdtb2QnLCAyLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIG1vZChhLGIpeyByZXR1cm4gdWludDMyKGludDMyKGEpICUgaW50MzIoYikpfSk7XHJcblx0XHJcblx0XHRcdC8vIFRPRE86IGNoZWNrIHRoZSBzcGVjc1xyXG5cdFx0XHRvcGNvZGUoMHgxNSwgJ25lZycsIDEsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gbmVnKHgpeyBcclxuXHRcdFx0XHRyZXR1cm4gdWludDMyKDB4RkZGRkZGRkYgLSB4ICsgMSl9KTtcclxuXHRcclxuXHRcdFx0Ly8gVE9ETzogY2hlY2sgaWYgaXQgd29ya3MsIEpTIGhhcyBzaWduZWQgaW50cywgd2Ugd2FudCB1aW50XHJcblx0XHRcdG9wY29kZSgweDE4LCAnYml0YW5kJywgMiwgMSxcclxuXHRcdFx0XHRmdW5jdGlvbiBiaXRhbmQoYSxiKXsgcmV0dXJuIHVpbnQzMih1aW50MzIoYSkgJiB1aW50MzIoYikpfSk7XHJcblx0XHRcclxuXHRcdFx0Ly8gVE9ETzogY2hlY2sgaWYgaXQgd29ya3MsIEpTIGhhcyBzaWduZWQgaW50cywgd2Ugd2FudCB1aW50XHJcblx0XHRcdG9wY29kZSgweDE5LCAnYml0b3InLCAyLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGJpdG9yKGEsYil7IHJldHVybiB1aW50MzIodWludDMyKGEpIHwgdWludDMyKGIpKX0pO1xyXG5cdFx0XHJcblx0XHRcdC8vIFRPRE86IGNoZWNrIGlmIGl0IHdvcmtzLCBKUyBoYXMgc2lnbmVkIGludHMsIHdlIHdhbnQgdWludFxyXG5cdFx0XHRvcGNvZGUoMHgxQSwgJ2JpdHhvcicsIDIsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gYml0eG9yKGEsYil7IHJldHVybiB1aW50MzIodWludDMyKGEpIF4gdWludDMyKGIpKX0pO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gVE9ETzogY2hlY2sgaWYgaXQgd29ya3MsIEpTIGhhcyBzaWduZWQgaW50cywgd2Ugd2FudCB1aW50XHRcclxuXHRcdFx0b3Bjb2RlKDB4MUIsICdiaXRub3QnLCAxLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGJpdG5vdCh4KXsgeCA9IH51aW50MzIoeCk7IGlmICh4PDApIHJldHVybiAxICsgeCArIDB4RkZGRkZGRkY7IHJldHVybiB4OyB9KTtcclxuXHRcclxuXHRcdFx0b3Bjb2RlKDB4MUMsICdzaGlmdGwnLCAyLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHNoaWZ0bChhLGIpeyBcclxuXHRcdFx0XHRcdGlmICh1aW50MzIoYikgPj0gMzIpIHJldHVybiAwO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHVpbnQzMihhIDw8IGIpfSk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHgxRCwgJ3NzaGlmdHInLCAyLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHNzaGlmdHIoYSxiKXsgXHJcblx0XHRcdFx0XHRpZiAodWludDMyKGIpID49IDMyKSByZXR1cm4gKGEgJiAweDgwMDAwMDAwKSA/IDB4RkZGRkZGRkYgOiAwO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHVpbnQzMihpbnQzMihhKSA+PiBiKX0pO1xyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MUUsICd1c2hpZnRyJywgMiwgMSxcclxuXHRcdFx0XHRmdW5jdGlvbiB1c2hpZnRyKGEsYil7IFxyXG5cdFx0XHRcdFx0aWYgKHVpbnQzMihiKSA+PSAzMikgcmV0dXJuIDA7XHJcblx0XHRcdFx0XHRyZXR1cm4gdWludDMyKHVpbnQzMihhKSA+Pj4gYil9KTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDIwLCAnanVtcCcsIDEsIDAsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGp1bXAoanVtcFZlY3Rvcil7XHJcblx0XHRcdFx0XHR0aGlzLnRha2VCcmFuY2goanVtcFZlY3Rvcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MDIyLCAnanonLCAyLCAwLCBcclxuXHRcdFx0XHRmdW5jdGlvbiBqeihjb25kaXRpb24sIGp1bXBWZWN0b3Ipe1xyXG5cdFx0XHRcdFx0aWYgKGNvbmRpdGlvbiA9PT0gMClcclxuXHRcdFx0XHRcdFx0dGhpcy50YWtlQnJhbmNoKGp1bXBWZWN0b3IpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdG9wY29kZSgweDAyMywgJ2pueicsIDIsIDAsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGpueihjb25kaXRpb24sIGp1bXBWZWN0b3Ipe1xyXG5cdFx0XHRcdFx0aWYgKGNvbmRpdGlvbiAhPT0gMClcclxuXHRcdFx0XHRcdFx0dGhpcy50YWtlQnJhbmNoKGp1bXBWZWN0b3IpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHJcblxyXG5cdFx0XHRvcGNvZGUoMHgwMjQsICdqZXEnLCAzLCAwLCBcclxuXHRcdFx0XHRmdW5jdGlvbiBqZXEoYSwgYiwganVtcFZlY3Rvcil7XHJcblx0XHRcdFx0XHRpZiAoYSA9PT0gYiB8fCB1aW50MzIoYSkgPT09IHVpbnQzMihiKSlcclxuXHRcdFx0XHRcdFx0dGhpcy50YWtlQnJhbmNoKGp1bXBWZWN0b3IpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdG9wY29kZSgweDAyNSwgJ2puZScsIDMsIDAsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGpuZShhLCBiLCBqdW1wVmVjdG9yKXtcclxuXHRcdFx0XHRcdGlmICh1aW50MzIoYSkgIT09IHVpbnQzMihiKSlcclxuXHRcdFx0XHRcdFx0dGhpcy50YWtlQnJhbmNoKGp1bXBWZWN0b3IpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDAyNiwgJ2psdCcsIDMsIDAsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGpsdChhLCBiLCBqdW1wVmVjdG9yKXtcclxuXHRcdFx0XHRcdGlmIChpbnQzMihhKSA8IGludDMyKGIpKVxyXG5cdFx0XHRcdFx0XHR0aGlzLnRha2VCcmFuY2goanVtcFZlY3Rvcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MDI3LCAnamdlJywgMywgMCwgXHJcblx0XHRcdFx0ZnVuY3Rpb24gamdlKGEsIGIsIGp1bXBWZWN0b3Ipe1xyXG5cdFx0XHRcdFx0aWYgKGludDMyKGEpID49IGludDMyKGIpKVxyXG5cdFx0XHRcdFx0XHR0aGlzLnRha2VCcmFuY2goanVtcFZlY3Rvcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MDI4LCAnamd0JywgMywgMCwgXHJcblx0XHRcdFx0ZnVuY3Rpb24gamd0KGEsIGIsIGp1bXBWZWN0b3Ipe1xyXG5cdFx0XHRcdFx0aWYgKGludDMyKGEpID4gaW50MzIoYikpXHJcblx0XHRcdFx0XHRcdHRoaXMudGFrZUJyYW5jaChqdW1wVmVjdG9yKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHgwMjksICdqbGUnLCAzLCAwLCBcclxuXHRcdFx0XHRmdW5jdGlvbiBqbGUoYSwgYiwganVtcFZlY3Rvcil7XHJcblx0XHRcdFx0XHRpZiAoaW50MzIoYSkgPD0gaW50MzIoYikpXHJcblx0XHRcdFx0XHRcdHRoaXMudGFrZUJyYW5jaChqdW1wVmVjdG9yKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHQvLyBUT0RPOiBjaGVjayBpZiBpdCB3b3JrcywgSlMgaGFzIHNpZ25lZCBpbnRzLCB3ZSB3YW50IHVpbnRcclxuXHRcdFx0b3Bjb2RlKDB4MDJBLCAnamx0dScsIDMsIDAsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGpsdHUoYSwgYiwganVtcFZlY3Rvcil7XHJcblx0XHRcdFx0XHRpZiAoYSA8IGIpXHJcblx0XHRcdFx0XHRcdHRoaXMudGFrZUJyYW5jaChqdW1wVmVjdG9yKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHQvLyBUT0RPOiBjaGVjayBpZiBpdCB3b3JrcywgSlMgaGFzIHNpZ25lZCBpbnRzLCB3ZSB3YW50IHVpbnRcclxuXHRcdFx0b3Bjb2RlKDB4MDJCLCAnamdldScsIDMsIDAsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGpnZXUoYSwgYiwganVtcFZlY3Rvcil7XHJcblx0XHRcdFx0XHRpZiAoYSA+PSBiKVxyXG5cdFx0XHRcdFx0XHR0aGlzLnRha2VCcmFuY2goanVtcFZlY3Rvcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0Ly8gVE9ETzogY2hlY2sgaWYgaXQgd29ya3MsIEpTIGhhcyBzaWduZWQgaW50cywgd2Ugd2FudCB1aW50XHJcblx0XHRcdG9wY29kZSgweDAyQywgJ2pndHUnLCAzLCAwLCBcclxuXHRcdFx0XHRmdW5jdGlvbiBqZ3R1KGEsIGIsIGp1bXBWZWN0b3Ipe1xyXG5cdFx0XHRcdFx0aWYgKGEgPiBiKVxyXG5cdFx0XHRcdFx0XHR0aGlzLnRha2VCcmFuY2goanVtcFZlY3Rvcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0Ly8gVE9ETzogY2hlY2sgaWYgaXQgd29ya3MsIEpTIGhhcyBzaWduZWQgaW50cywgd2Ugd2FudCB1aW50XHJcblx0XHRcdG9wY29kZSgweDAyRCwgJ2psZXUnLCAzLCAwLCBcclxuXHRcdFx0XHRmdW5jdGlvbiBqbGV1KGEsIGIsIGp1bXBWZWN0b3Ipe1xyXG5cdFx0XHRcdFx0aWYgKGEgPD0gYilcclxuXHRcdFx0XHRcdFx0dGhpcy50YWtlQnJhbmNoKGp1bXBWZWN0b3IpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHgwMTA0LCAnanVtcGFicycsIDEsIDAsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGp1bXBhYnMoYWRkcmVzcyl7XHJcblx0XHRcdFx0XHR0aGlzLlBDID0gYWRkcmVzcztcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHgzMCwgJ2NhbGwnLCAyLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGNhbGwoYWRkcmVzczpudW1iZXIsIGFyZ2M6bnVtYmVyLCBkZXN0VHlwZTpudW1iZXIsIGRlc3RBZGRyOm51bWJlcil7XHJcblx0XHRcdFx0XHRsZXQgYXJncyA9IFtdO1xyXG5cdFx0XHRcdFx0d2hpbGUoYXJnYy0tKXtcclxuXHRcdFx0XHRcdFx0YXJncy5wdXNoKHRoaXMucG9wKCkpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0aGlzLnBlcmZvcm1DYWxsKGFkZHJlc3MsIGFyZ3MsIGRlc3RUeXBlLCBkZXN0QWRkciwgdGhpcy5QQyk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRPcGNvZGVSdWxlLkRlbGF5ZWRTdG9yZVxyXG5cdFx0XHQpXHJcblxyXG5cdFx0XHRvcGNvZGUoMHgxNjAsICdjYWxsZicsIDEsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gY2FsbGYoYWRkcmVzczpudW1iZXIsIGRlc3RUeXBlOm51bWJlciwgZGVzdEFkZHI6bnVtYmVyKXtcclxuXHRcdFx0XHRcdHRoaXMucGVyZm9ybUNhbGwoYWRkcmVzcywgbnVsbCwgZGVzdFR5cGUsIGRlc3RBZGRyLCB0aGlzLlBDKTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdE9wY29kZVJ1bGUuRGVsYXllZFN0b3JlXHJcblx0XHRcdClcclxuXHJcblx0XHRcdG9wY29kZSgweDE2MSwgJ2NhbGxmaScsIDIsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gY2FsbGZpKGFkZHJlc3M6bnVtYmVyLCBhcmc6IG51bWJlciwgZGVzdFR5cGU6bnVtYmVyLCBkZXN0QWRkcjpudW1iZXIpe1xyXG5cdFx0XHRcdFx0dGhpcy5wZXJmb3JtQ2FsbChhZGRyZXNzLCBbdWludDMyKGFyZyldLCBkZXN0VHlwZSwgZGVzdEFkZHIsIHRoaXMuUEMpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0T3Bjb2RlUnVsZS5EZWxheWVkU3RvcmVcclxuXHRcdFx0KVxyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTYyLCAnY2FsbGZpaScsIDMsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gY2FsbGZpaShhZGRyZXNzOm51bWJlciwgYXJnMTogbnVtYmVyLCBhcmcyOiBudW1iZXIsIGRlc3RUeXBlOm51bWJlciwgZGVzdEFkZHI6bnVtYmVyKXtcclxuXHRcdFx0XHRcdHRoaXMucGVyZm9ybUNhbGwoYWRkcmVzcywgW3VpbnQzMihhcmcxKSwgdWludDMyKGFyZzIpXSwgZGVzdFR5cGUsIGRlc3RBZGRyLCB0aGlzLlBDKTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdE9wY29kZVJ1bGUuRGVsYXllZFN0b3JlXHJcblx0XHRcdClcclxuXHRcdFxyXG5cdFx0XHRvcGNvZGUoMHgxNjMsICdjYWxsZmlpaScsIDQsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gY2FsbGZpaWkoYWRkcmVzczpudW1iZXIsIGFyZzE6IG51bWJlciwgYXJnMjogbnVtYmVyLCBhcmczOiBudW1iZXIsIGRlc3RUeXBlOm51bWJlciwgZGVzdEFkZHI6bnVtYmVyKXtcclxuXHRcdFx0XHRcdHRoaXMucGVyZm9ybUNhbGwoYWRkcmVzcywgW3VpbnQzMihhcmcxKSwgdWludDMyKGFyZzIpLCB1aW50MzIoYXJnMyldLCBkZXN0VHlwZSwgZGVzdEFkZHIsIHRoaXMuUEMpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0T3Bjb2RlUnVsZS5EZWxheWVkU3RvcmVcclxuXHRcdFx0KVxyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MzEsICdyZXR1cm4nLCAxLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIF9yZXR1cm4ocmV0VmFsOm51bWJlcil7XHJcblx0XHRcdFx0XHR0aGlzLmxlYXZlRnVuY3Rpb24odWludDMyKHJldFZhbCkpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDMyLCBcImNhdGNoXCIsIDAsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gX2NhdGNoKGRlc3RUeXBlOm51bWJlciwgZGVzdEFkZHI6bnVtYmVyLCBhZGRyZXNzOm51bWJlcil7XHJcblx0XHRcdFx0XHR0aGlzLnB1c2hDYWxsU3R1YihkZXN0VHlwZSwgZGVzdEFkZHIsIHRoaXMuUEMsIHRoaXMuRlApO1xyXG5cdFx0XHRcdFx0IC8vIHRoZSBjYXRjaCB0b2tlbiBpcyB0aGUgdmFsdWUgb2Ygc3AgYWZ0ZXIgcHVzaGluZyB0aGF0IHN0dWJcclxuICAgICAgICAgICBcdFx0XHR0aGlzLnBlcmZvcm1EZWxheWVkU3RvcmUoZGVzdFR5cGUsIGRlc3RBZGRyLCB0aGlzLlNQKTtcclxuXHRcdFx0XHRcdHRoaXMudGFrZUJyYW5jaChhZGRyZXNzKVx0XHRcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdE9wY29kZVJ1bGUuQ2F0Y2hcclxuXHRcdFx0KVxyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MzMsIFwidGhyb3dcIiwgMiwgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBfdGhyb3coZXgsIGNhdGNoVG9rZW4pe1xyXG5cdFx0XHRcdFx0aWYgKGNhdGNoVG9rZW4gPiB0aGlzLlNQKVxyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIGNhdGNoIHRva2VuICR7Y2F0Y2hUb2tlbn1cIik7XHJcblx0XHRcdFx0XHQvLyBwb3AgdGhlIHN0YWNrIGJhY2sgZG93biB0byB0aGUgc3R1YiBwdXNoZWQgYnkgY2F0Y2hcclxuXHRcdFx0XHRcdHRoaXMuU1AgPSBjYXRjaFRva2VuO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQvLyByZXN0b3JlIGZyb20gdGhlIHN0dWJcclxuXHRcdFx0XHRcdGxldCBzdHViID0gdGhpcy5wb3BDYWxsU3R1YigpO1xyXG5cdFx0XHRcdFx0dGhpcy5QQyA9IHN0dWIuUEM7XHJcblx0XHRcdFx0XHR0aGlzLkZQID0gc3R1Yi5mcmFtZVB0cjtcclxuXHRcdFx0XHRcdHRoaXMuZnJhbWVMZW4gPSB0aGlzLnN0YWNrLnJlYWRJbnQzMih0aGlzLkZQKTtcclxuXHRcdFx0XHRcdHRoaXMubG9jYWxzUG9zID0gdGhpcy5zdGFjay5yZWFkSW50MzIodGhpcy5GUCArIDQpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQvLyBzdG9yZSB0aGUgdGhyb3duIHZhbHVlIGFuZCByZXN1bWUgYWZ0ZXIgdGhlIGNhdGNoIG9wY29kZVxyXG5cdFx0XHRcdFx0dGhpcy5wZXJmb3JtRGVsYXllZFN0b3JlKHN0dWIuZGVzdFR5cGUsIHN0dWIuZGVzdEFkZHIsIGV4KTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KVxyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MzQsIFwidGFpbGNhbGxcIiwgMiwgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiB0YWlsY2FsbChhZGRyZXNzOiBudW1iZXIsIGFyZ2M6IG51bWJlcil7XHJcblx0XHRcdFx0XHRsZXQgYXJndiA9IFtdO1xyXG5cdFx0XHRcdFx0d2hpbGUoYXJnYy0tKXtcclxuXHRcdFx0XHRcdFx0YXJndi5wdXNoKHRoaXMucG9wKCkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGhpcy5wZXJmb3JtQ2FsbChhZGRyZXNzLCBhcmd2LCAwLCAwLCAwLCB0cnVlKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MTgwLCAnYWNjZWxmdW5jJywgMiwgMCxcclxuXHRcdFx0XHRmdW5jdGlvbihzbG90LCB2YWx1ZSl7XHJcblx0XHRcdFx0XHRzZXRTbG90R2x1bHguY2FsbCh0aGlzLCBmYWxzZSwgc2xvdCwgdmFsdWUpO1xyXG5cdFx0XHRcdH0pO1x0XHJcblx0XHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDE4MSwgJ2FjY2VscGFyYW0nLCAyLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uKHNsb3QsIHZhbHVlKXtcclxuXHRcdFx0XHRcdHNldFNsb3RHbHVseC5jYWxsKHRoaXMsIHRydWUsIHNsb3QsIHZhbHVlKTtcclxuXHRcdFx0XHR9KTtcdFx0XHJcblx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHg0MCwgXCJjb3B5XCIsIDEsIDEsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGNvcHkoeDpudW1iZXIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHVpbnQzMih4KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDQxLCBcImNvcHlzXCIsIDEsIDEsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGNvcHlzKHg6bnVtYmVyKXtcclxuXHRcdFx0XHRcdHJldHVybiB4ICYgMHhGRkZGO1xyXG5cdFx0XHRcdH0sIE9wY29kZVJ1bGUuSW5kaXJlY3QxNkJpdCk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHg0MiwgXCJjb3B5YlwiLCAxLCAxLCBcclxuXHRcdFx0XHRmdW5jdGlvbiBjb3B5Yih4Om51bWJlcil7XHJcblx0XHRcdFx0XHRyZXR1cm4geCAmIDB4RkY7XHJcblx0XHRcdFx0fSwgT3Bjb2RlUnVsZS5JbmRpcmVjdDhCaXQpO1xyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4NDQsIFwic2V4c1wiLCAxLCAxLCBcclxuXHRcdFx0XHRmdW5jdGlvbiBzZXhzKHg6bnVtYmVyKXtcclxuXHRcdFx0XHRcdHJldHVybiB4ICYgMHg4MDAwID8gdWludDMyKHggfCAweEZGRkYwMDAwKSA6IHggJiAweDAwMDBGRkZGO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4NDUsIFwic2V4YlwiLCAxLCAxLCBcclxuXHRcdFx0XHRmdW5jdGlvbiBzZXhiKHg6bnVtYmVyKXtcclxuXHRcdFx0XHRcdHJldHVybiB4ICYgMHg4MCA/IHVpbnQzMih4IHwgMHhGRkZGRkYwMCkgOiB4ICYgMHgwMDAwMDBGRjtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDQ4LCBcImFsb2FkXCIsIDIsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gYWxvYWQoYXJyYXk6IG51bWJlciwgaW5kZXg6IG51bWJlcil7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5pbWFnZS5yZWFkSW50MzIodWludDMyKGFycmF5KzQqaW5kZXgpKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDQ5LCBcImFsb2Fkc1wiLCAyLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGFsb2FkcyhhcnJheTogbnVtYmVyLCBpbmRleDogbnVtYmVyKXtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmltYWdlLnJlYWRJbnQxNih1aW50MzIoYXJyYXkrMippbmRleCkpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4NEEsIFwiYWxvYWRiXCIsIDIsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gYWxvYWRiKGFycmF5OiBudW1iZXIsIGluZGV4OiBudW1iZXIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuaW1hZ2UucmVhZEJ5dGUodWludDMyKGFycmF5K2luZGV4KSk7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHg0QiwgXCJhbG9hZGJpdFwiLCAyLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGFsb2FkYml0KGFycmF5OiBudW1iZXIsIGluZGV4OiBudW1iZXIpe1xyXG5cdFx0XHRcdFx0aW5kZXggPSBpbnQzMihpbmRleCk7XHJcblx0XHRcdFx0XHRsZXQgYml0eCA9IGluZGV4ICYgNztcclxuXHRcdFx0XHRcdGxldCBhZGRyZXNzID0gYXJyYXk7XHJcblx0XHRcdFx0XHRpZiAoaW5kZXggPj0gMCl7XHJcblx0XHRcdFx0XHRcdGFkZHJlc3MgKz0gKGluZGV4Pj4zKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRhZGRyZXNzIC09ICgxKygoLTEtaW5kZXgpPj4zKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsZXQgYnl0ZSA9ICB0aGlzLmltYWdlLnJlYWRCeXRlKHVpbnQzMihhZGRyZXNzKSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gYnl0ZSAmICgxIDw8IGJpdHgpID8gMSA6IDA7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHg0QywgXCJhc3RvcmVcIiwgMywgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBhc3RvcmUoYXJyYXk6IG51bWJlciwgaW5kZXg6IG51bWJlciwgdmFsdWU6IG51bWJlcil7XHJcblx0XHRcdFx0XHR0aGlzLmltYWdlLndyaXRlSW50MzIoYXJyYXkrNCppbnQzMihpbmRleCksIHVpbnQzMih2YWx1ZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDRELCBcImFzdG9yZXNcIiwgMywgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBhc3RvcmVzKGFycmF5OiBudW1iZXIsIGluZGV4OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpe1xyXG5cdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZSAmIDB4RkZGRjtcclxuXHRcdFx0XHRcdHRoaXMuaW1hZ2Uud3JpdGVCeXRlcyhhcnJheSsyKmluZGV4LCB2YWx1ZSA+PiA4LCB2YWx1ZSAmIDB4RkYgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHg0RSwgXCJhc3RvcmViXCIsIDMsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gYXN0b3JlYihhcnJheTogbnVtYmVyLCBpbmRleDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKXtcclxuXHRcdFx0XHRcdHRoaXMuaW1hZ2Uud3JpdGVCeXRlcyhhcnJheStpbmRleCwgdmFsdWUgJiAweEZGICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4NEYsIFwiYXN0b3JlYml0XCIsIDMsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gYXN0b3JlYml0KGFycmF5OiBudW1iZXIsIGluZGV4OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpe1xyXG5cdFx0XHRcdFx0aW5kZXggPSBpbnQzMihpbmRleCk7XHJcblx0XHRcdFx0XHRsZXQgYml0eCA9IGluZGV4ICYgNztcclxuXHRcdFx0XHRcdGxldCBhZGRyZXNzID0gYXJyYXk7XHJcblx0XHRcdFx0XHRpZiAoaW5kZXggPj0gMCl7XHJcblx0XHRcdFx0XHRcdGFkZHJlc3MgKz0gKGluZGV4Pj4zKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRhZGRyZXNzIC09ICgxKygoLTEtaW5kZXgpPj4zKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsZXQgYnl0ZSA9ICB0aGlzLmltYWdlLnJlYWRCeXRlKGFkZHJlc3MpO1xyXG5cdFx0XHRcdFx0aWYgKHZhbHVlID09PSAwKXtcclxuXHRcdFx0XHRcdFx0Ynl0ZSAmPSB+KDEgPDwgYml0eCk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0Ynl0ZSB8PSAoMSA8PCBiaXR4KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHRoaXMuaW1hZ2Uud3JpdGVCeXRlcyhhZGRyZXNzLCBieXRlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHg3MCwgJ3N0cmVhbWNoYXInLCAxLCAwLCBFbmdpbmUucHJvdG90eXBlLnN0cmVhbUNoYXJDb3JlKTtcclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDczLCAnc3RyZWFtdW5pY2hhcicsIDEsIDAsIEVuZ2luZS5wcm90b3R5cGUuc3RyZWFtVW5pQ2hhckNvcmUpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4NzEsICdzdHJlYW1udW0nLCAxLCAwLCBFbmdpbmUucHJvdG90eXBlLnN0cmVhbU51bUNvcmUpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4NzIsICdzdHJlYW1zdHInLCAxLCAwLCBFbmdpbmUucHJvdG90eXBlLnN0cmVhbVN0ckNvcmUpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTMwLCAnZ2xrJywgMiwgMSxcclxuXHRcdFx0XHRmdW5jdGlvbiBnbGsoY29kZTpudW1iZXIsIGFyZ2M6IG51bWJlcil7XHJcblx0XHRcdFx0XHRzd2l0Y2godGhpcy5nbGtNb2RlKXtcclxuXHRcdFx0XHRcdFx0Y2FzZSBHbGtNb2RlLk5vbmU6XHJcblx0XHRcdFx0XHRcdFx0Ly8gbm90IHJlYWxseSBzdXBwb3J0ZWQsIGp1c3QgY2xlYXIgdGhlIHN0YWNrXHJcblx0XHRcdFx0XHRcdFx0d2hpbGUoYXJnYy0tKXtcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMucG9wKCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHRcdFx0XHRjYXNlIEdsa01vZGUuV3JhcHBlcjpcclxuXHRcdFx0XHRcdFx0ICBcdHJldHVybiBHbGtXcmFwcGVyQ2FsbC5jYWxsKHRoaXMsIGNvZGUsIGFyZ2MpO1xyXG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgZ2xrTW9kZSAke3RoaXMuZ2xrTW9kZX1gKTtcdFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDE0MCwgJ2dldHN0cmluZ3RibCcsIDAsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gZ2V0c3RyaW5ndGJsKCl7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5kZWNvZGluZ1RhYmxlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDE0MSwgJ3NldHN0cmluZ3RibCcsIDEsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gc2V0c3RyaW5ndGJsKGFkZHIpe1xyXG5cdFx0XHRcdFx0dGhpcy5kZWNvZGluZ1RhYmxlID0gYWRkcjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblx0XHRcdFxyXG5cdFx0XHRcclxuXHJcblx0XHRcdG9wY29kZSgweDE0OCwgJ2dldGlvc3lzJywgMCwgMixcclxuXHRcdFx0XHRmdW5jdGlvbiBnZXRpb3N5cygpe1xyXG5cdFx0XHRcdFx0c3dpdGNoKHRoaXMub3V0cHV0U3lzdGVtKXtcclxuXHRcdFx0XHRcdFx0Y2FzZSBJT1N5c3RlbS5OdWxsOlx0cmV0dXJuIFswLDBdO1xyXG5cdFx0XHRcdFx0XHRjYXNlIElPU3lzdGVtLkZpbHRlcjogcmV0dXJuIFsxLCB0aGlzLmZpbHRlckFkZHJlc3NdO1xyXG5cdFx0XHRcdFx0XHRjYXNlIElPU3lzdGVtLkNoYW5uZWxzOiByZXR1cm4gWzIwLCAwXTtcclxuXHRcdFx0XHRcdFx0Y2FzZSBJT1N5c3RlbS5HbGs6IHJldHVybiBbMiwgMF07XHRcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHgxNDksICdzZXRpb3N5cycsIDIsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gc2V0aW9zeXMoc3lzdGVtLCByb2NrKXtcclxuXHRcdFx0XHRcdHN3aXRjaChzeXN0ZW0pe1xyXG5cdFx0XHRcdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5vdXRwdXRTeXN0ZW0gPSBJT1N5c3RlbS5OdWxsO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdFx0XHRcdHRoaXMub3V0cHV0U3lzdGVtID0gSU9TeXN0ZW0uRmlsdGVyO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZmlsdGVyQWRkcmVzcyA9IHJvY2s7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0XHRcdFx0aWYgKHRoaXMuZ2xrTW9kZSAhPT0gR2xrTW9kZS5XcmFwcGVyKVxyXG5cdFx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiR2xrIHdyYXBwZXIgc3VwcG9ydCBoYXMgbm90IGJlZW4gZW5hYmxlZFwiKTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLm91dHB1dFN5c3RlbSA9IElPU3lzdGVtLkdsaztcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdGNhc2UgMjA6XHJcblx0XHRcdFx0XHRcdFx0aWYgKCF0aGlzLmVuYWJsZUZ5cmVWTSlcclxuXHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkZ5cmVWTSBzdXBwb3J0IGhhcyBiZWVuIGRpc2FibGVkXCIpO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMub3V0cHV0U3lzdGVtID0gSU9TeXN0ZW0uQ2hhbm5lbHM7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5yZWNvZ25pemVkIG91dHB1dCBzeXN0ZW0gJHtzeXN0ZW19YCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTAyLCAnZ2V0bWVtc2l6ZScsIDAsIDEsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGdldG1lbXNpemUoKXtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmltYWdlLmdldEVuZE1lbSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcclxuXHRcdFx0b3Bjb2RlKDB4MTAzLCAnc2V0bWVtc2l6ZScsIDEsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gc2V0bWVtc2l6ZShzaXplKXtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmhlYXApXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcInNldG1lbXNpemUgaXMgbm90IGFsbG93ZWQgd2hpbGUgdGhlIGhlYXAgaXMgYWN0aXZlXCIpO1xyXG5cdFx0XHRcdFx0dHJ5e1xyXG5cdFx0XHRcdFx0XHR0aGlzLmltYWdlLnNldEVuZE1lbShzaXplKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjYXRjaCAoZSl7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XHJcblx0XHRcdFx0XHRcdHJldHVybiAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTcwLCAnbXplcm8nLCAyLCAwLCBcclxuXHRcdFx0XHRmdW5jdGlvbiBtemVybyhjb3VudCwgYWRkcmVzcyl7XHJcblx0XHRcdFx0XHRsZXQgemVyb3MgPSBbXTtcclxuXHRcdFx0XHRcdGNvdW50ID0gdWludDMyKGNvdW50KTtcclxuXHRcdFx0XHRcdHdoaWxlKGNvdW50LS0pe1xyXG5cdFx0XHRcdFx0XHR6ZXJvcy5wdXNoKDApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGhpcy5pbWFnZS53cml0ZUJ5dGVzKGFkZHJlc3MsIC4uLnplcm9zKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTcxLCAnbWNvcHknLCAzLCAwLCBcclxuXHRcdFx0XHRmdW5jdGlvbiBtY29weShjb3VudCwgZnJvbSwgdG8pe1xyXG5cdFx0XHRcdFx0bGV0IGRhdGEgPSBbXTtcclxuXHRcdFx0XHRcdGNvdW50ID0gdWludDMyKGNvdW50KTtcclxuXHRcdFx0XHRcdGZvciAobGV0IGkgPSBmcm9tOyBpPGZyb20rY291bnQ7IGkrKyl7XHJcblx0XHRcdFx0XHRcdGRhdGEucHVzaCh0aGlzLmltYWdlLnJlYWRCeXRlKGkpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHRoaXMuaW1hZ2Uud3JpdGVCeXRlcyh0bywgLi4uZGF0YSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MTc4LCAnbWFsbG9jJywgMSwgMSxcclxuXHRcdFx0XHRmdW5jdGlvbiBtYWxsb2Moc2l6ZSl7XHJcblx0XHRcdFx0XHRpZiAoc2l6ZSA8PSAwKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmhlYXApe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5oZWFwLmFsbG9jKHNpemUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bGV0IG9sZEVuZE1lbSA9IHRoaXMuaW1hZ2UuZ2V0RW5kTWVtKCk7XHJcblx0XHRcdFx0XHR0aGlzLmhlYXAgPSBuZXcgSGVhcEFsbG9jYXRvcihvbGRFbmRNZW0sIHRoaXMuaW1hZ2UubWVtb3J5KTtcclxuXHRcdFx0XHRcdHRoaXMuaGVhcC5tYXhIZWFwRXh0ZW50ID0gdGhpcy5tYXhIZWFwU2l6ZTtcclxuXHRcdFx0XHRcdGxldCBhID0gdGhpcy5oZWFwLmFsbG9jKHNpemUpO1xyXG5cdFx0XHRcdFx0aWYgKGEgPT09IDApe1xyXG5cdFx0XHRcdFx0XHR0aGlzLmhlYXAgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmltYWdlLnNldEVuZE1lbShvbGRFbmRNZW0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIGE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTc5LCAnbWZyZWUnLCAxLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIG1mcmVlKGFkZHJlc3Mpe1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaGVhcCl7XHJcblx0XHRcdFx0XHRcdHRoaXMuaGVhcC5mcmVlKGFkZHJlc3MpO1xyXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5oZWFwLmJsb2NrQ291bnQoKSA9PT0gMCl7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5pbWFnZS5lbmRNZW0gPSB0aGlzLmhlYXAuaGVhcEFkZHJlc3M7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5oZWFwID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdG9wY29kZSgweDE1MCwgJ2xpbmVhcnNlYXJjaCcsIDcsIDEsIFBlcmZvcm1MaW5lYXJTZWFyY2gpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTUxLCAnYmluYXJ5c2VhcmNoJywgNywgMSwgUGVyZm9ybUJpbmFyeVNlYXJjaCk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHgxNTIsICdsaW5rZWRzZWFyY2gnLCA2LCAxLCBQZXJmb3JtTGlua2VkU2VhcmNoKTtcclxuXHJcblx0XHRcdG9wY29kZSgweDUwLCAnc3RrY291bnQnLCAwLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHN0a2NvdW50KCl7XHJcblx0XHRcdFx0XHRyZXR1cm4gKHRoaXMuU1AgLSAodGhpcy5GUCArIHRoaXMuZnJhbWVMZW4pKSAvIDQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4NTEsICdzdGtwZWVrJywgMSwgMSxcclxuXHRcdFx0XHRmdW5jdGlvbiBzdGtwZWVrKHBvcyl7XHJcblx0XHRcdFx0XHRsZXQgYWRkcmVzcyA9IHRoaXMuU1AgLSA0ICogKDEgKyBwb3MpXHJcblx0XHRcdFx0XHRpZiAoYWRkcmVzcyA8IHRoaXMuRlAgKyB0aGlzLmZyYW1lTGVuKVxyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJTdGFjayB1bmRlcmZsb3dcIik7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5zdGFjay5yZWFkSW50MzIoYWRkcmVzcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4NTIsICdzdGtzd2FwJywgMCwgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBzdGtzd2FwKHBvcyl7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5TUCAtICh0aGlzLkZQICsgdGhpcy5mcmFtZUxlbikgPCA4KVxyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJTdGFjayB1bmRlcmZsb3dcIik7XHJcblx0XHRcdFx0XHRsZXQgYSA9IHRoaXMucG9wKCk7XHJcblx0XHRcdFx0XHRsZXQgYiA9IHRoaXMucG9wKCk7XHJcblx0XHRcdFx0XHR0aGlzLnB1c2goYSk7XHJcblx0XHRcdFx0XHR0aGlzLnB1c2goYik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4NTMsICdzdGtyb2xsJywgMiwgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBzdGtyb2xsKGl0ZW1zLCBkaXN0YW5jZSl7XHJcblx0XHRcdFx0XHQvLyBUT0RPOiB0cmVhdCBkaXN0YW5jZSBhcyBzaWduZWQgdmFsdWVcclxuXHRcdFx0XHRcdGlmIChpdGVtcyA9PT0gMClcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0ZGlzdGFuY2UgJT0gaXRlbXM7XHJcblx0XHRcdFx0XHRpZiAoZGlzdGFuY2UgPT09IDApXHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdC8vIHJvbGxpbmcgWCBpdGVtcyBkb3duIFkgc2xvdHMgPT0gcm9sbGluZyBYIGl0ZW1zIHVwIFgtWSBzbG90c1xyXG4gICAgICAgICAgICAgXHRcdGlmIChkaXN0YW5jZSA8IDApXHJcblx0XHRcdFx0XHQgXHRkaXN0YW5jZSArPSBpdGVtcztcclxuXHRcdFx0XHRcdGlmICh0aGlzLlNQIC0gKHRoaXMuRlAgKyB0aGlzLmZyYW1lTGVuKSA8IDQqIGl0ZW1zKVxyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJTdGFjayB1bmRlcmZsb3dcIik7XHJcblx0XHRcdFx0XHRsZXQgdGVtcDEgPSBbXTtcclxuXHRcdFx0XHRcdGxldCB0ZW1wMiA9IFtdO1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgaT0wOyBpPGRpc3RhbmNlOyBpKyspe1xyXG5cdFx0XHRcdFx0XHR0ZW1wMS5wdXNoKHRoaXMucG9wKCkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Zm9yIChsZXQgaT1kaXN0YW5jZTsgaTxpdGVtczsgaSsrKXtcclxuXHRcdFx0XHRcdFx0dGVtcDIucHVzaCh0aGlzLnBvcCgpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHdoaWxlKHRlbXAxLmxlbmd0aCl7XHJcblx0XHRcdFx0XHRcdHRoaXMucHVzaCh0ZW1wMS5wb3AoKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR3aGlsZSh0ZW1wMi5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0XHR0aGlzLnB1c2godGVtcDIucG9wKCkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdG9wY29kZSgweDU0LCAnc3RrY29weScsMSwgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBzdGtjb3B5KGNvdW50KXtcclxuXHRcdFx0XHRcdGxldCBieXRlcyA9IGNvdW50ICogNDtcclxuXHRcdFx0XHRcdGlmIChieXRlcyA+IHRoaXMuU1AgLSAodGhpcy5GUCArIHRoaXMuZnJhbWVMZW4pKVxyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJTdGFjayB1bmRlcmZsb3dcIik7XHJcblx0XHRcdFx0XHRsZXQgc3RhcnQgPSB0aGlzLlNQIC0gYnl0ZXM7XHJcblx0XHRcdFx0XHR3aGlsZShjb3VudC0tKXtcclxuXHRcdFx0XHRcdFx0dGhpcy5wdXNoKHRoaXMuc3RhY2sucmVhZEludDMyKHN0YXJ0KSlcclxuXHRcdFx0XHRcdFx0c3RhcnQrPSA0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTAwLCBcImdlc3RhbHRcIiwgMiwgMSxcclxuXHRcdFx0XHRmdW5jdGlvbiBnZXN0YWx0KHNlbGVjdG9yLCBhcmcpe1xyXG5cdFx0XHRcdFx0c3dpdGNoKHNlbGVjdG9yKXtcclxuXHRcdFx0XHRcdFx0Y2FzZSBHZXN0YWx0LkdsdWx4VmVyc2lvbjogcmV0dXJuIFZlcnNpb25zLmdsdWx4O1xyXG5cdFx0XHRcdFx0XHRjYXNlIEdlc3RhbHQuVGVycFZlcnNpb246IHJldHVybiBWZXJzaW9ucy50ZXJwO1xyXG5cdFx0XHRcdFx0XHRjYXNlIEdlc3RhbHQuUmVzaXplTWVtOlxyXG5cdFx0XHRcdFx0XHRjYXNlIEdlc3RhbHQuVW5pY29kZTpcclxuXHRcdFx0XHRcdFx0Y2FzZSBHZXN0YWx0Lk1lbUNvcHk6XHJcblx0XHRcdFx0XHRcdGNhc2UgR2VzdGFsdC5NQWxsb2M6XHJcblx0XHRcdFx0IFx0XHRjYXNlIEdlc3RhbHQuVW5kbzpcclxuXHRcdFx0XHRcdFx0Y2FzZSBHZXN0YWx0LkV4dFVuZG86XHJcblx0XHRcdFx0XHRcdGNhc2UgR2VzdGFsdC5BY2NlbGVyYXRpb246XHJcblx0XHRcdFx0XHRcdCBcdHJldHVybiAxO1xyXG5cdFx0XHRcdFx0XHRjYXNlIEdlc3RhbHQuRmxvYXQ6XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdFx0XHRcdGNhc2UgR2VzdGFsdC5JT1N5c3RlbTpcclxuXHRcdFx0XHRcdFx0XHRpZiAoYXJnID09PSAwKSByZXR1cm4gMTsgIC8vIE51bGwtSU9cclxuXHRcdFx0XHRcdFx0XHRpZiAoYXJnID09PSAxKSByZXR1cm4gMTsgIC8vIEZpbHRlclxyXG5cdFx0XHRcdFx0XHRcdGlmIChhcmcgPT09IDIwICYmIHRoaXMuZW5hYmxlRnlyZVZNKSByZXR1cm4gMTsgLy8gQ2hhbm5lbCBJT1xyXG5cdFx0XHRcdFx0XHRcdGlmIChhcmcgPT0gMiAmJiB0aGlzLmdsa01vZGUgPT09IEdsa01vZGUuV3JhcHBlcikgcmV0dXJuIDE7IC8vIEdsa1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHRcdFx0XHRjYXNlIEdlc3RhbHQuTUFsbG9jSGVhcDpcclxuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5oZWFwKSByZXR1cm4gdGhpcy5oZWFwLmhlYXBBZGRyZXNzO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHRcdFx0XHRjYXNlIEdlc3RhbHQuQWNjZWxGdW5jOlxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAwOyBcclxuXHRcdFx0XHRcdH1cdFx0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHJcblx0XHRcdG9wY29kZSgweDEyMCwgJ3F1aXQnLCAwLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHF1aXQoKXsgdGhpcy5ydW5uaW5nID0gZmFsc2U7IH0pO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHgxMjIsICdyZXN0YXJ0JywgMCwgMCwgRW5naW5lLnByb3RvdHlwZS5yZXN0YXJ0KTtcclxuXHJcblx0XHRcdG9wY29kZSgweDEyMywgJ3NhdmUnLCAxLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHNhdmUoWCwgZGVzdFR5cGU6bnVtYmVyLCBkZXN0QWRkcjpudW1iZXIpe1xyXG5cdFx0XHRcdFx0Ly8gVE9ETzogZmluZCBvdXQgd2hhdCB0aGF0IG9uZSBhcmd1bWVudCBYIGRvZXMgLi4uXHJcblx0XHRcdFx0XHRsZXQgZW5naW5lOiBFbmdpbmUgPSB0aGlzO1xyXG5cdFx0XHRcdFx0aWYgKGVuZ2luZS5zYXZlUmVxdWVzdGVkKXtcclxuXHRcdFx0XHRcdFx0bGV0IHEgPSBlbmdpbmUuc2F2ZVRvUXVldHphbChkZXN0VHlwZSwgZGVzdEFkZHIpO1xyXG5cdFx0XHRcdFx0XHRsZXQgcmVzdW1lID0gdGhpcy5yZXN1bWVBZnRlcldhaXQuYmluZCh0aGlzKTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGxldCBjYWxsYmFjayA9IGZ1bmN0aW9uKHN1Y2Nlc3M6Ym9vbGVhbil7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHN1Y2Nlc3Mpe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZW5naW5lWydwZXJmb3JtRGVsYXllZFN0b3JlJ10oZGVzdFR5cGUsIGRlc3RBZGRyLCAwKTtcclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdGVuZ2luZVsncGVyZm9ybURlbGF5ZWRTdG9yZSddKGRlc3RUeXBlLCBkZXN0QWRkciwgMSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHJlc3VtZSgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVuZ2luZS5zYXZlUmVxdWVzdGVkKHEsIGNhbGxiYWNrKTtcclxuXHRcdFx0XHRcdFx0bGV0IHdhaXQ6IGFueSA9ICd3YWl0JztcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHdhaXQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbmdpbmVbJ3BlcmZvcm1EZWxheWVkU3RvcmUnXShkZXN0VHlwZSwgZGVzdEFkZHIsIDEpO1x0XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRPcGNvZGVSdWxlLkRlbGF5ZWRTdG9yZVxyXG5cdFx0XHQpXHJcblx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHgxMjQsIFwicmVzdG9yZVwiLCAxLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHJlc3RvcmUoWCwgZGVzdFR5cGU6bnVtYmVyLCBkZXN0QWRkcjpudW1iZXIpe1xyXG5cdFx0XHRcdFx0Ly8gVE9ETzogZmluZCBvdXQgd2hhdCB0aGF0IG9uZSBhcmd1bWVudCBYIGRvZXMgLi4uXHJcblx0XHRcdFx0XHRsZXQgZW5naW5lOiBFbmdpbmUgPSB0aGlzO1xyXG5cdFx0XHRcdFx0aWYgKGVuZ2luZS5sb2FkUmVxdWVzdGVkKXtcclxuXHRcdFx0XHRcdFx0bGV0IHJlc3VtZSA9IHRoaXMucmVzdW1lQWZ0ZXJXYWl0LmJpbmQodGhpcyk7XHJcblx0XHRcdFx0XHRcdGxldCBjYWxsYmFjayA9IGZ1bmN0aW9uKHF1ZXR6YWw6UXVldHphbCl7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHF1ZXR6YWwpe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZW5naW5lLmxvYWRGcm9tUXVldHphbChxdWV0emFsKTtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc3VtZSgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRlbmdpbmVbJ3BlcmZvcm1EZWxheWVkU3RvcmUnXShkZXN0VHlwZSwgZGVzdEFkZHIsIDEpO1xyXG5cdFx0XHRcdFx0XHRcdHJlc3VtZSgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVuZ2luZS5sb2FkUmVxdWVzdGVkKGNhbGxiYWNrKTtcclxuXHRcdFx0XHRcdFx0bGV0IHdhaXQ6IGFueSA9ICd3YWl0JztcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHdhaXQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbmdpbmVbJ3BlcmZvcm1EZWxheWVkU3RvcmUnXShkZXN0VHlwZSwgZGVzdEFkZHIsIDEpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0T3Bjb2RlUnVsZS5EZWxheWVkU3RvcmVcclxuXHRcdFx0KVxyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTI1LCAnc2F2ZXVuZG8nLCAwLCAwLCBcclxuXHRcdFx0XHRmdW5jdGlvbiBzYXZldW5kbyhkZXN0VHlwZTpudW1iZXIsIGRlc3RBZGRyOm51bWJlcil7XHJcblx0XHRcdFx0XHRsZXQgcSA9IHRoaXMuc2F2ZVRvUXVldHphbChkZXN0VHlwZSwgZGVzdEFkZHIpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRpZiAodGhpcy51bmRvQnVmZmVycyl7XHJcblx0XHRcdFx0XHRcdC8vIFRPRE8gbWFrZSBNQVhfVU5ET19MRVZFTCBjb25maWd1cmFibGVcclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMudW5kb0J1ZmZlcnMubGVuZ3RoID49IDMpe1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMudW5kb0J1ZmZlcnMudW5zaGlmdCgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHRoaXMudW5kb0J1ZmZlcnMucHVzaChxKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHR0aGlzLnVuZG9CdWZmZXJzID0gWyBxIF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0aGlzLnBlcmZvcm1EZWxheWVkU3RvcmUoZGVzdFR5cGUsIGRlc3RBZGRyLCAwKTtcclxuXHRcdFx0fSwgT3Bjb2RlUnVsZS5EZWxheWVkU3RvcmUpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTI2LCAncmVzdG9yZXVuZG8nLCAwLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHJlc3RvcmV1bmRvKGRlc3RUeXBlOm51bWJlciwgZGVzdEFkZHI6bnVtYmVyKXtcclxuXHRcdFx0XHRcdGlmICh0aGlzLnVuZG9CdWZmZXJzICYmIHRoaXMudW5kb0J1ZmZlcnMubGVuZ3RoKXtcclxuXHRcdFx0XHRcdFx0bGV0IHEgPSB0aGlzLnVuZG9CdWZmZXJzLnBvcCgpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmxvYWRGcm9tUXVldHphbChxKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHR0aGlzLnBlcmZvcm1EZWxheWVkU3RvcmUoZGVzdFR5cGUsIGRlc3RBZGRyLCAxKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH0sIE9wY29kZVJ1bGUuRGVsYXllZFN0b3JlKTtcclxuXHJcblxyXG5cdFx0XHRvcGNvZGUoMHgxMjcsICdwcm90ZWN0JywgMiwgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBwcm90ZWN0KHN0YXJ0LCBsZW5ndGgpe1xyXG5cdFx0XHRcdFx0aWYgKHN0YXJ0IDwgdGhpcy5pbWFnZS5nZXRFbmRNZW0oKSl7XHJcblx0XHRcdFx0XHRcdHRoaXMucHJvdGVjdGlvblN0YXJ0ID0gc3RhcnQ7XHJcblx0XHRcdFx0XHRcdHRoaXMucHJvdGVjdGlvbkxlbmd0aCA9IGxlbmd0aDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdClcclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDEyOCwgJ2hhc3VuZG8nLCAwLCAxLFxyXG5cdFx0XHRcdC8vIFRlc3Qgd2hldGhlciBhIFZNIHN0YXRlIGlzIGF2YWlsYWJsZSBpbiB0ZW1wb3Jhcnkgc3RvcmFnZS4gXHJcblx0XHRcdFx0Ly8gcmV0dXJuIDAgaWYgYSBzdGF0ZSBpcyBhdmFpbGFibGUsIDEgaWYgbm90LiBcclxuXHRcdFx0XHQvLyBJZiB0aGlzIHJldHVybnMgMCwgdGhlbiByZXN0b3JldW5kbyBpcyBleHBlY3RlZCB0byBzdWNjZWVkLlxyXG5cdFx0XHRcdGZ1bmN0aW9uIGhhc3VuZG8oKXtcclxuXHRcdFx0XHRcdGlmICh0aGlzLnVuZG9CdWZmZXJzICYmIHRoaXMudW5kb0J1ZmZlcnMubGVuZ3RoKSByZXR1cm4gMDtcclxuXHRcdFx0XHRcdHJldHVybiAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KVxyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTI5LCAnZGlzY2FyZHVuZG8nLCAwLCAwLFxyXG5cdFx0XHRcdC8vIERpc2NhcmQgYSBWTSBzdGF0ZSAodGhlIG1vc3QgcmVjZW50bHkgc2F2ZWQpIGZyb20gdGVtcG9yYXJ5IHN0b3JhZ2UuIElmIG5vbmUgaXMgYXZhaWxhYmxlLCB0aGlzIGRvZXMgbm90aGluZy5cclxuXHRcdFx0XHRmdW5jdGlvbiBkaXNjYXJkdW5kbygpe1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMudW5kb0J1ZmZlcnMpe1xyXG5cdFx0XHRcdFx0XHR0aGlzLnVuZG9CdWZmZXJzLnBvcCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KVxyXG5cclxuXHJcblx0XHRcdG9wY29kZSgweDExMCwgJ3JhbmRvbScsIDEsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gcmFuZG9tKG1heCl7XHJcblx0XHRcdFx0XHRpZiAobWF4ID09PSAxIHx8IG1heCA9PT0gMHhGRkZGRkZGRilcclxuXHRcdFx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGxldCByYW5kb206IE1lcnNlbm5lVHdpc3RlciA9IHRoaXMucmFuZG9tO1xyXG5cdFx0XHRcdFx0aWYgKCFyYW5kb20pe1xyXG5cdFx0XHRcdFx0XHRyYW5kb20gPSB0aGlzLnJhbmRvbSA9IG5ldyBNZXJzZW5uZVR3aXN0ZXIoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChtYXggPT09IDApe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gcmFuZG9tLmdlbnJhbmRfaW50MzIoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0bWF4ID0gaW50MzIobWF4KTtcclxuXHRcdFx0XHRcdGlmIChtYXggPCAwKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuICB1aW50MzIoIC0gKHJhbmRvbS5nZW5yYW5kX2ludDMxKCkgJSAtbWF4KSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gcmFuZG9tLmdlbnJhbmRfaW50MzEoKSAlIG1heDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHgxMTEsICdzZXRyYW5kb20nLDEsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gc2V0cmFuZG9tKHNlZWQpe1xyXG5cdFx0XHRcdFx0aWYgKCFzZWVkKSBzZWVkID0gdW5kZWZpbmVkO1xyXG5cdFx0XHRcdFx0dGhpcy5yYW5kb20gPSBuZXcgTWVyc2VubmVUd2lzdGVyKHNlZWQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdG9wY29kZSgweDEwMDAsICdmeXJlY2FsbCcsIDMsIDEsIEVuZ2luZS5wcm90b3R5cGUuZnlyZUNhbGwpO1xyXG5cclxuXHRcdFx0cmV0dXJuIG9wY29kZXM7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGNvbnN0IGVudW0gU2VhcmNoT3B0aW9ucyB7XHJcblx0XHRLZXlJbmRpcmVjdCA9IDEsXHJcbiAgICAgICAgWmVyb0tleVRlcm1pbmF0ZXMgPSAyLFxyXG4gICAgICAgIFJldHVybkluZGV4ID0gNFxyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBQZXJmb3JtQmluYXJ5U2VhcmNoKGtleSwga2V5U2l6ZSwgc3RhcnQsIHN0cnVjdFNpemUsIG51bVN0cnVjdHMsIGtleU9mZnNldCwgb3B0aW9ucyl7XHJcblx0XHRpZiAob3B0aW9ucyAmIFNlYXJjaE9wdGlvbnMuWmVyb0tleVRlcm1pbmF0ZXMpXHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlplcm9LZXlUZXJtaW5hdGVkIG9wdGlvbiBtYXkgbm90IGJlIHVzZWQgd2l0aCBiaW5hcnkgc2VhcmNoXCIpO1xyXG5cdFx0aWYgKGtleVNpemUgPiA0ICYmICEob3B0aW9ucyAmIFNlYXJjaE9wdGlvbnMuS2V5SW5kaXJlY3QpIClcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiS2V5SW5kaXJlY3Qgb3B0aW9uIG11c3QgYmUgdXNlZCB3aGVuIHNlYXJjaGluZyBmb3IgYSA+NCBieXRlIGtleVwiKTtcclxuXHRcdGxldCByZXR1cm5JbmRleCA9IG9wdGlvbnMgJiBTZWFyY2hPcHRpb25zLlJldHVybkluZGV4O1xyXG5cdFx0bGV0IGxvdyA9MCwgaGlnaCA9IG51bVN0cnVjdHM7XHJcblx0XHRrZXkgPSBrZXkgPj4+IDA7XHJcblx0XHR3aGlsZSAobG93IDwgaGlnaCl7XHJcblx0XHRcdGxldCBpbmRleCA9IE1hdGguZmxvb3IoKGxvdytoaWdoKSAvIDIpO1xyXG5cdFx0XHRsZXQgY21wID0gY29tcGFyZUtleXMuY2FsbCh0aGlzLCBrZXksIHN0YXJ0ICsgaW5kZXgqc3RydWN0U2l6ZSArIGtleU9mZnNldCwga2V5U2l6ZSwgb3B0aW9ucyk7XHJcblx0XHRcdGlmIChjbXAgPT09IDApe1xyXG5cdFx0XHRcdC8vIGZvdW5kIGl0XHJcblx0XHRcdFx0aWYgKHJldHVybkluZGV4KSByZXR1cm4gaW5kZXg7XHJcblx0XHRcdFx0cmV0dXJuIHN0YXJ0K2luZGV4KnN0cnVjdFNpemU7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGNtcCA8IDApe1xyXG5cdFx0XHRcdGhpZ2ggPSBpbmRleDtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0bG93ID0gaW5kZXggKyAxO1x0XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIGRpZCBub3QgZmluZFxyXG5cdFx0cmV0dXJuIHJldHVybkluZGV4ID8gMHhGRkZGRkZGRiA6IDA7XHJcblx0fVxyXG5cdFxyXG5cdFxyXG5cdGZ1bmN0aW9uIFBlcmZvcm1MaW5lYXJTZWFyY2goa2V5LCBrZXlTaXplLCBzdGFydCwgc3RydWN0U2l6ZSwgbnVtU3RydWN0cywga2V5T2Zmc2V0LCBvcHRpb25zKXtcclxuXHRcdGlmIChrZXlTaXplID4gNCAmJiAhKG9wdGlvbnMgJiBTZWFyY2hPcHRpb25zLktleUluZGlyZWN0KSApXHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIktleUluZGlyZWN0IG9wdGlvbiBtdXN0IGJlIHVzZWQgd2hlbiBzZWFyY2hpbmcgZm9yIGEgPjQgYnl0ZSBrZXlcIik7XHJcblx0XHRsZXQgcmV0dXJuSW5kZXggPSBvcHRpb25zICYgU2VhcmNoT3B0aW9ucy5SZXR1cm5JbmRleDtcclxuXHRcdGtleSA9IGtleSA+Pj4gMDtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBudW1TdHJ1Y3RzID09PSAtMSB8fCBpPG51bVN0cnVjdHM7IGkrKyl7XHJcblx0XHRcdGxldCBjbXAgPSBjb21wYXJlS2V5cy5jYWxsKHRoaXMsIGtleSwgc3RhcnQgKyBpKnN0cnVjdFNpemUgKyBrZXlPZmZzZXQsIGtleVNpemUsIG9wdGlvbnMpO1xyXG5cdFx0XHRpZiAoY21wID09PSAwKXtcclxuXHRcdFx0XHQvLyBmb3VuZCBpdFxyXG5cdFx0XHRcdGlmIChyZXR1cm5JbmRleCkgcmV0dXJuIGk7XHJcblx0XHRcdFx0cmV0dXJuIHN0YXJ0K2kqc3RydWN0U2l6ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAob3B0aW9ucyAmIFNlYXJjaE9wdGlvbnMuWmVyb0tleVRlcm1pbmF0ZXMpe1xyXG5cdFx0XHRcdGlmIChrZXlJc1plcm8uY2FsbCh0aGlzLCBzdGFydCArIGkqc3RydWN0U2l6ZSArIGtleU9mZnNldCwga2V5U2l6ZSkpe1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBkaWQgbm90IGZpbmRcclxuXHRcdHJldHVybiByZXR1cm5JbmRleCA/IDB4RkZGRkZGRkYgOiAwO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBQZXJmb3JtTGlua2VkU2VhcmNoKGtleSwga2V5U2l6ZSwgc3RhcnQsIGtleU9mZnNldCwgbmV4dE9mZnNldCwgb3B0aW9ucyl7XHJcblx0XHRpZiAob3B0aW9ucyAmIFNlYXJjaE9wdGlvbnMuUmV0dXJuSW5kZXgpXHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlJldHVybkluZGV4IG9wdGlvbiBtYXkgbm90IGJlIHVzZWQgd2l0aCBsaW5rZWQgc2VhcmNoXCIpO1xyXG5cdFx0bGV0IG5vZGUgPSBzdGFydDtcclxuXHRcdGtleSA9IGtleSA+Pj4gMDtcclxuXHRcdHdoaWxlIChub2RlKXtcclxuXHRcdFx0bGV0IGNtcCA9IGNvbXBhcmVLZXlzLmNhbGwodGhpcywga2V5LCBub2RlICsga2V5T2Zmc2V0LCBrZXlTaXplLCBvcHRpb25zKTtcclxuXHRcdFx0aWYgKGNtcCA9PT0gMCl7XHJcblx0XHRcdFx0Ly8gZm91bmQgaXRcclxuXHRcdFx0XHRyZXR1cm4gbm9kZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAob3B0aW9ucyAmIFNlYXJjaE9wdGlvbnMuWmVyb0tleVRlcm1pbmF0ZXMpe1xyXG5cdFx0XHRcdGlmIChrZXlJc1plcm8uY2FsbCh0aGlzLCBub2RlICsga2V5T2Zmc2V0LCBrZXlTaXplKSl7XHJcblx0XHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gYWR2YW5jZSB0aGUgbmV4dCBpdGVtXHJcblx0XHRcdG5vZGUgPSB0aGlzLmltYWdlLnJlYWRJbnQzMihub2RlK25leHRPZmZzZXQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBrZXlJc1plcm8oYWRkcmVzcywgc2l6ZSl7XHJcblx0XHR3aGlsZShzaXplLS0pe1xyXG5cdFx0XHRpZiAodGhpcy5pbWFnZS5yZWFkQnl0ZShhZGRyZXNzK3NpemUpICE9PSAwKVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBjb21wYXJlS2V5cyhxdWVyeTpudW1iZXIsIGNhbmRpZGF0ZUFkZHI6IG51bWJlciwga2V5U2l6ZTogbnVtYmVyLCBvcHRpb25zOiBudW1iZXIpe1xyXG5cdFx0bGV0IHsgaW1hZ2UgfSA9IHRoaXM7XHJcblx0XHRpZiAob3B0aW9ucyAmIFNlYXJjaE9wdGlvbnMuS2V5SW5kaXJlY3Qpe1xyXG5cdFx0XHQvLyBLZXlJbmRpcmVjdCAqaXMqIHNldFxyXG4gICAgICAgICAgICAvLyBjb21wYXJlIHRoZSBieXRlcyBzdG9yZWQgYXQgcXVlcnkgdnMuIGNhbmRpZGF0ZUFkZHJcclxuIFx0XHRcdGZvciAobGV0IGk9MDsgaTxrZXlTaXplOyBpKyspe1xyXG5cdFx0XHRcdGxldCBiMSA9IGltYWdlLnJlYWRCeXRlKHF1ZXJ5KyspO1xyXG5cdFx0XHRcdGxldCBiMiA9IGltYWdlLnJlYWRCeXRlKGNhbmRpZGF0ZUFkZHIrKyk7XHJcblx0XHRcdFx0aWYgKGIxIDwgYjIpXHJcblx0XHRcdFx0XHRyZXR1cm4gLTE7XHJcblx0XHRcdFx0aWYgKGIxID4gYjIpXHJcblx0XHRcdFx0XHRyZXR1cm4gMTsgXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHRcclxuXHRcdFxyXG5cdFx0Ly8gS2V5SW5kaXJlY3QgaXMgKm5vdCogc2V0XHJcbiAgICAgICAgLy8gbWFzayBxdWVyeSB0byB0aGUgYXBwcm9wcmlhdGUgc2l6ZSBhbmQgY29tcGFyZSBpdCBhZ2FpbnN0IHRoZSB2YWx1ZSBzdG9yZWQgYXQgY2FuZGlkYXRlQWRkclxyXG5cdFx0bGV0IGNrZXk7XHJcblx0XHRzd2l0Y2goa2V5U2l6ZSl7XHJcblx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRja2V5ID0gaW1hZ2UucmVhZEJ5dGUoY2FuZGlkYXRlQWRkcik7XHJcblx0XHRcdFx0cXVlcnkgJj0gMHhGRjtcclxuXHRcdFx0XHRyZXR1cm4gcXVlcnkgLSBja2V5O1xyXG5cdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0Y2tleSA9IGltYWdlLnJlYWRJbnQxNihjYW5kaWRhdGVBZGRyKTtcclxuXHRcdFx0XHRxdWVyeSAmPSAweEZGRkY7XHJcblx0XHRcdFx0cmV0dXJuIHF1ZXJ5IC0gY2tleTtcclxuXHRcdFx0Y2FzZSAzOlxyXG5cdFx0XHRcdGNrZXkgPSBpbWFnZS5yZWFkSW50MzIoY2FuZGlkYXRlQWRkcikgJiAweEZGRkZGRjtcclxuXHRcdFx0XHRxdWVyeSAmPSAweEZGRkZGRjtcclxuXHRcdFx0XHRyZXR1cm4gcXVlcnkgLSBja2V5O1xyXG5cdFx0XHRjYXNlIDQ6XHJcblx0XHRcdFx0Y2tleSA9IGltYWdlLnJlYWRJbnQzMihjYW5kaWRhdGVBZGRyKTtcclxuXHRcdFx0XHRyZXR1cm4gcXVlcnkgLSBja2V5O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0fVxyXG59IiwiLy8gV3JpdHRlbiBpbiAyMDE1IGJ5IFRoaWxvIFBsYW56IFxyXG4vLyBUbyB0aGUgZXh0ZW50IHBvc3NpYmxlIHVuZGVyIGxhdywgSSBoYXZlIGRlZGljYXRlZCBhbGwgY29weXJpZ2h0IGFuZCByZWxhdGVkIGFuZCBuZWlnaGJvcmluZyByaWdodHMgXHJcbi8vIHRvIHRoaXMgc29mdHdhcmUgdG8gdGhlIHB1YmxpYyBkb21haW4gd29ybGR3aWRlLiBUaGlzIHNvZnR3YXJlIGlzIGRpc3RyaWJ1dGVkIHdpdGhvdXQgYW55IHdhcnJhbnR5LiBcclxuLy8gaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvcHVibGljZG9tYWluL3plcm8vMS4wL1xyXG5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD0nR2xrV3JhcHBlci50cycgLz5cclxuXHJcblxyXG5tb2R1bGUgRnlyZVZNIHtcclxuXHRcclxuXHQgLy8vIElkZW50aWZpZXMgYW4gb3V0cHV0IHN5c3RlbSBmb3IgdXNlIHdpdGggQHNldGlvc3lzLlxyXG5cdGV4cG9ydCBjb25zdCBlbnVtIElPU3lzdGVtIHtcclxuXHRcdC8vLyBPdXRwdXQgaXMgZGlzY2FyZGVkLlxyXG5cdFx0TnVsbCxcclxuXHRcdC8vLyBPdXRwdXQgaXMgZmlsdGVyZWQgdGhyb3VnaCBhIEdsdWx4IGZ1bmN0aW9uLlxyXG5cdFx0RmlsdGVyLFxyXG5cdFx0Ly8vIE91dHB1dCBpcyBzZW50IHRocm91Z2ggRnlyZVZNJ3MgY2hhbm5lbCBzeXN0ZW0uXHJcblx0XHRDaGFubmVscyxcclxuXHRcdC8vLyBPdXRwdXQgaXMgc2VudCB0aHJvdWdoIEdsay5cclxuXHRcdEdsa1xyXG5cdH1cclxuXHRcclxuXHRleHBvcnQgZnVuY3Rpb24gU2VuZENoYXJUb091dHB1dCh4OiBudW1iZXIpe1xyXG5cdFx0c3dpdGNoKHRoaXMub3V0cHV0U3lzdGVtKXtcclxuXHRcdFx0Y2FzZSBJT1N5c3RlbS5OdWxsOiByZXR1cm47XHJcblx0XHRcdGNhc2UgSU9TeXN0ZW0uQ2hhbm5lbHM6XHJcblx0XHRcdFx0Ly8gVE9ETz8gbmVlZCB0byBoYW5kbGUgVW5pY29kZSBjaGFyYWN0ZXJzIGxhcmdlciB0aGFuIDE2IGJpdHNcclxuXHRcdFx0XHR0aGlzLm91dHB1dEJ1ZmZlci53cml0ZShTdHJpbmcuZnJvbUNoYXJDb2RlKHgpKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdGNhc2UgSU9TeXN0ZW0uR2xrOlxyXG5cdFx0XHRcdGlmICh0aGlzLmdsa01vZGUgPT09IEdsa01vZGUuV3JhcHBlcilcclxuXHRcdFx0XHRcdEdsa1dyYXBwZXJXcml0ZS5jYWxsKHRoaXMsIFN0cmluZy5mcm9tQ2hhckNvZGUoeCkpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0XHRcclxuXHRcdH1cclxuXHRcdHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgb3V0cHV0IHN5c3RlbSAke3RoaXMub3V0cHV0U3lzdGVtfWApO1xyXG5cdH1cclxuXHRcclxuXHRleHBvcnQgZnVuY3Rpb24gU2VuZFN0cmluZ1RvT3V0cHV0KHg6IHN0cmluZyl7XHJcblx0XHRzd2l0Y2godGhpcy5vdXRwdXRTeXN0ZW0pe1xyXG5cdFx0XHRjYXNlIElPU3lzdGVtLk51bGw6IHJldHVybjtcclxuXHRcdFx0Y2FzZSBJT1N5c3RlbS5DaGFubmVsczpcclxuXHRcdFx0XHR0aGlzLm91dHB1dEJ1ZmZlci53cml0ZSh4KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdGNhc2UgSU9TeXN0ZW0uR2xrOlxyXG5cdFx0XHRcdGlmICh0aGlzLmdsa01vZGUgPT09IEdsa01vZGUuV3JhcHBlcilcclxuXHRcdFx0XHRcdEdsa1dyYXBwZXJXcml0ZS5jYWxsKHRoaXMsIHgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgb3V0cHV0IHN5c3RlbSAke3RoaXMub3V0cHV0U3lzdGVtfWApO1xyXG5cdH1cclxuXHRcclxuXHRcclxuXHRleHBvcnQgY29uc3QgZW51bSBHTFVMWF9IVUZGIHtcclxuXHRcdC8vIFN0cmluZyBkZWNvZGluZyB0YWJsZTogaGVhZGVyIGZpZWxkIG9mZnNldHNcclxuICAgICAgICBUQUJMRVNJWkVfT0ZGU0VUID0gMCxcclxuICAgICAgICBOT0RFQ09VTlRfT0ZGU0VUID0gNCxcclxuICAgICAgICBST09UTk9ERV9PRkZTRVQgPSA4LFxyXG5cclxuICAgICAgICAvLyBTdHJpbmcgZGVjb2RpbmcgdGFibGU6IG5vZGUgdHlwZXNcclxuICAgICAgICBOT0RFX0JSQU5DSCA9IDAsXHJcbiAgICAgICAgTk9ERV9FTkQgPSAxLFxyXG4gICAgICAgIE5PREVfQ0hBUiA9IDIsXHJcbiAgICAgICAgTk9ERV9DU1RSID0gMyxcclxuICAgICAgICBOT0RFX1VOSUNIQVIgPSA0LFxyXG4gICAgICAgIE5PREVfVU5JU1RSID0gNSxcclxuICAgICAgICBOT0RFX0lORElSRUNUID0gOCxcclxuICAgICAgIFx0Tk9ERV9EQkxJTkRJUkVDVCA9IDksXHJcbiAgICAgICAgTk9ERV9JTkRJUkVDVF9BUkdTID0gMTAsXHJcbiAgICAgICAgTk9ERV9EQkxJTkRJUkVDVF9BUkdTID0gMTFcclxuXHR9XHJcblx0XHJcblx0LyoqXHJcblx0ICogUHJpbnRzIHRoZSBuZXh0IGNoYXJhY3RlciBvZiBhIGNvbXByZXNzZWQgc3RyaW5nLCBjb25zdW1pbmcgb25lIG9yIG1vcmUgYml0cy5cclxuICAgICAqXHJcblx0ICovXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIE5leHRDb21wcmVzc2VkQ2hhcigpe1xyXG5cdFx0bGV0IGVuZ2luZTogRW5naW5lID0gdGhpcztcclxuXHRcdGxldCB7aW1hZ2V9ID0gZW5naW5lO1xyXG5cdFx0bGV0IG5vZGUgPSBpbWFnZS5yZWFkSW50MzIodGhpcy5kZWNvZGluZ1RhYmxlICsgR0xVTFhfSFVGRi5ST09UTk9ERV9PRkZTRVQpO1xyXG5cdFx0XHJcblx0XHR3aGlsZSAodHJ1ZSl7XHJcblx0XHRcdGxldCBub2RlVHlwZSA9IGltYWdlLnJlYWRCeXRlKG5vZGUrKyk7XHJcblx0XHRcdHN3aXRjaChub2RlVHlwZSl7XHJcblx0XHRcdFx0Y2FzZSBHTFVMWF9IVUZGLk5PREVfQlJBTkNIOlxyXG5cdFx0XHRcdFx0aWYgKG5leHRDb21wcmVzc2VkU3RyaW5nQml0KGVuZ2luZSkpe1xyXG5cdFx0XHRcdFx0XHRub2RlID0gaW1hZ2UucmVhZEludDMyKG5vZGUrNCk7IC8vIGdvIHJpZ2h0XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0bm9kZSA9IGltYWdlLnJlYWRJbnQzMihub2RlKTsgLy8gZ28gbGVmdFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBHTFVMWF9IVUZGLk5PREVfRU5EOlxyXG5cdFx0XHRcdFx0dGhpcy5yZXN1bWVGcm9tQ2FsbFN0dWIoMCk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0Y2FzZSBHTFVMWF9IVUZGLk5PREVfQ0hBUjpcclxuXHRcdFx0XHRjYXNlIEdMVUxYX0hVRkYuTk9ERV9VTklDSEFSOlxyXG5cdFx0XHRcdFx0bGV0IGMgPSAobm9kZVR5cGUgPT09IEdMVUxYX0hVRkYuTk9ERV9VTklDSEFSKSA/IGltYWdlLnJlYWRJbnQzMihub2RlKSA6IGltYWdlLnJlYWRCeXRlKG5vZGUpO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMub3V0cHV0U3lzdGVtID09PSBJT1N5c3RlbS5GaWx0ZXIpe1xyXG5cdFx0XHRcdFx0XHR0aGlzLnBlcmZvcm1DYWxsKHRoaXMuZmlsdGVyQWRkcmVzcywgWyBjIF0sIEdMVUxYX1NUVUIuUkVTVU1FX0hVRkZTVFIsIHRoaXMucHJpbnRpbmdEaWdpdCwgdGhpcy5QQyk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0U2VuZENoYXJUb091dHB1dC5jYWxsKHRoaXMsIGMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdGNhc2UgR0xVTFhfSFVGRi5OT0RFX0NTVFI6XHJcblx0XHRcdFx0XHRpZiAodGhpcy5vdXRwdXRTeXN0ZW0gPT09IElPU3lzdGVtLkZpbHRlcil7XHJcblx0XHRcdFx0XHRcdHRoaXMucHVzaENhbGxTdHViKEdMVUxYX1NUVUIuUkVTVU1FX0hVRkZTVFIsIHRoaXMucHJpbnRpbmdEaWdpdCwgdGhpcy5QQywgdGhpcy5GUCk7XHJcblx0XHRcdFx0XHRcdHRoaXMuUEMgPSBub2RlO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmV4ZWNNb2RlID0gRXhlY3V0aW9uTW9kZS5DU3RyaW5nO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFNlbmRTdHJpbmdUb091dHB1dC5jYWxsKHRoaXMsIHRoaXMuaW1hZ2UucmVhZENTdHJpbmcobm9kZSkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdC8vIFRPRE86IHRoZSBvdGhlciBub2RlIHR5cGVzXHJcblx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5yZWNvZ25pemVkIGNvbXByZXNzZWQgc3RyaW5nIG5vZGUgdHlwZSAke25vZGVUeXBlfWApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdFxyXG5cdGZ1bmN0aW9uIG5leHRDb21wcmVzc2VkU3RyaW5nQml0KGVuZ2luZSk6IGJvb2xlYW57XHJcblx0XHRsZXQgcmVzdWx0ID0gKChlbmdpbmUuaW1hZ2UucmVhZEJ5dGUoZW5naW5lLlBDKSAmICggMSA8PCBlbmdpbmUucHJpbnRpbmdEaWdpdCkpICE9PSAwKVxyXG5cdFx0ZW5naW5lLnByaW50aW5nRGlnaXQrKztcclxuXHRcdGlmIChlbmdpbmUucHJpbnRpbmdEaWdpdCA9PT0gOCl7XHJcblx0XHRcdGVuZ2luZS5wcmludGluZ0RpZ2l0ID0gMDtcclxuXHRcdFx0ZW5naW5lLlBDKys7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHRcclxuXHRleHBvcnQgZnVuY3Rpb24gTmV4dENTdHJpbmdDaGFyKCl7XHJcblx0XHRsZXQgY2ggPSB0aGlzLmltYWdlLnJlYWRCeXRlKHRoaXMuUEMrKyk7XHJcblx0XHRpZiAoY2ggPT09IDApe1xyXG5cdFx0XHR0aGlzLnJlc3VtZUZyb21DYWxsU3R1YigwKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMub3V0cHV0U3lzdGVtID09PSBJT1N5c3RlbS5GaWx0ZXIpe1xyXG5cdFx0XHR0aGlzLnBlcmZvcm1DYWxsKHRoaXMuZmlsdGVyQWRkcmVzcywgW2NoXSwgIEdMVUxYX1NUVUIuUkVTVU1FX0NTVFIsIDAsIHRoaXMuUEMpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdFNlbmRDaGFyVG9PdXRwdXQoY2gpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRleHBvcnQgZnVuY3Rpb24gTmV4dFVuaVN0cmluZ0NoYXIoKXtcclxuXHRcdGxldCBjaCA9IHRoaXMuaW1hZ2UucmVhZEludDMyKHRoaXMuUEMpO1xyXG5cdFx0dGhpcy5QQyArPSA0O1xyXG5cdFx0aWYgKGNoID09PSAwKXtcclxuXHRcdFx0dGhpcy5yZXN1bWVGcm9tQ2FsbFN0dWIoMCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLm91dHB1dFN5c3RlbSA9PT0gSU9TeXN0ZW0uRmlsdGVyKXtcclxuXHRcdFx0dGhpcy5wZXJmb3JtQ2FsbCh0aGlzLmZpbHRlckFkZHJlc3MsIFtjaF0sICBHTFVMWF9TVFVCLlJFU1VNRV9VTklTVFIsIDAsIHRoaXMuUEMpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdFNlbmRDaGFyVG9PdXRwdXQoY2gpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRleHBvcnQgZnVuY3Rpb24gTmV4dERpZ2l0KCl7XHJcblx0XHRsZXQgczpzdHJpbmcgPSB0aGlzLlBDLnRvU3RyaW5nKCk7XHJcblx0XHRpZiAodGhpcy5wcmludGluZ0RpZ2l0IDwgcy5sZW5ndGgpe1xyXG5cdFx0XHRsZXQgY2ggPSBzLmNoYXJBdCh0aGlzLnByaW50aW5nRGlnaXQpO1xyXG5cdFx0XHRpZiAodGhpcy5vdXRwdXRTeXN0ZW0gPT09IElPU3lzdGVtLkZpbHRlcil7XHJcblx0XHRcdFx0dGhpcy5wZXJmb3JtQ2FsbCh0aGlzLmZpbHRlckFkZHJlc3MsIFtjaC5jaGFyQ29kZUF0KDApXSwgIEdMVUxYX1NUVUIuUkVTVU1FX05VTUJFUiwgdGhpcy5wcmludGluZ0RpZ2l0KzEsIHRoaXMuUEMpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRTZW5kU3RyaW5nVG9PdXRwdXQoY2gpO1xyXG5cdFx0XHRcdHRoaXMucHJpbnRpbmdEaWdpdCsrO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0dGhpcy5yZXN1bWVGcm9tQ2FsbFN0dWIoMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgQ2hhbm5lbERhdGEge1xyXG5cdFx0W2NoYW5uZWw6IHN0cmluZ10gOiBzdHJpbmc7IFxyXG5cdFx0TUFJTj86IHN0cmluZztcclxuXHRcdFBSUFQ/OiBzdHJpbmc7XHQvLyBwcm9tcHRcclxuXHRcdExPQ04/OiBzdHJpbmc7ICAvLyBsb2NhdGlvblxyXG5cdFx0U0NPUj86IHN0cmluZzsgIC8vIHNjb3JlXHJcblx0XHRUSU1FPzogc3RyaW5nOyAgLy8gdGltZSAoaGhtbSlcclxuXHRcdFRVUk4/OiBzdHJpbmc7ICAvLyB0dXJuIGNvdW50XHJcblx0XHRQTE9HPzogc3RyaW5nOyAgLy8gcHJvbG9ndWUsXHJcblx0XHRERUFEPzogc3RyaW5nOyAgLy8gRGVhdGggdGV4dCAoc2hvd24gd2hlbiBwbGF5ZXIgZGllcylcclxuXHRcdEVOREc/OiBzdHJpbmc7ICAvLyBFbmQgZ2FtZSB0ZXh0XHJcblx0XHRJTkZPPzogc3RyaW5nOyAgLy8gU3RvcnkgaW5mbyB0ZXh0IChjb21lcyBvdXQgYXMgSlNPTilcclxuXHRcdFNOT1Q/OiBzdHJpbmc7ICAvLyAgTm90aWZ5IGlmIHNjb3JlIGNoYW5nZXNcclxuXHR9XHJcblx0XHJcblx0XHJcblx0ZXhwb3J0IGNsYXNzIE91dHB1dEJ1ZmZlciB7XHJcblx0XHRcclxuXHRcdC8vIE5vIHNwZWNpYWwgXCJTdHJpbmdCdWlsZGVyXCJcclxuXHRcdC8vIHNpbXBsZSBTdHJpbmcgY29uY2F0ZW5hdGlvbiBpcyBzYWlkIHRvIGJlIGZhc3Qgb24gbW9kZXJuIGJyb3dzZXJzXHJcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNzEyNjM1NS8xNDk1NVxyXG5cdFx0XHJcblx0XHRwcml2YXRlIGNoYW5uZWwgPSAnTUFJTic7XHJcblx0XHRcclxuXHRcdHByaXZhdGUgY2hhbm5lbERhdGE6IENoYW5uZWxEYXRhICA9IHtcclxuXHRcdFx0XHRNQUlOOiAnJ1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRnZXRDaGFubmVsKCk6IHN0cmluZ3tcclxuXHRcdFx0cmV0dXJuIHRoaXMuY2hhbm5lbDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0LyoqICBJZiB0aGUgb3V0cHV0IGNoYW5uZWwgaXMgY2hhbmdlZCB0byBhbnkgY2hhbm5lbCBvdGhlciB0aGFuXHJcbiAgICAgICAgKiBcIk1BSU5cIiwgdGhlIGNoYW5uZWwncyBjb250ZW50cyB3aWxsIGJlXHJcbiAgICAgICAgKiBjbGVhcmVkIGZpcnN0LlxyXG5cdFx0Ki9cclxuXHRcdHNldENoYW5uZWwoYzogc3RyaW5nKXtcclxuXHRcdFx0aWYgKGMgPT09IHRoaXMuY2hhbm5lbCkgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmNoYW5uZWwgPSBjO1xyXG5cdFx0XHRpZiAoYyAhPT0gJ01BSU4nKXtcclxuXHRcdFx0XHR0aGlzLmNoYW5uZWxEYXRhW2NdID0gJyc7XHRcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvKiogXHJcblx0XHQgKiBXcml0ZXMgYSBzdHJpbmcgdG8gdGhlIGJ1ZmZlciBmb3IgdGhlIGN1cnJlbnRseVxyXG5cdFx0ICogc2VsZWN0ZWQgb3V0cHV0IGNoYW5uZWwuXHJcblx0XHQgKi9cclxuXHRcdHdyaXRlKHM6IHN0cmluZyl7XHJcblx0XHRcdHRoaXMuY2hhbm5lbERhdGFbdGhpcy5jaGFubmVsXSArPSBzO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdCAqICBQYWNrYWdlcyBhbGwgdGhlIG91dHB1dCB0aGF0IGhhcyBiZWVuIHN0b3JlZCBzbyBmYXIsIHJldHVybnMgaXQsXHJcbiAgICAgICAgICogIGFuZCBlbXB0aWVzIHRoZSBidWZmZXIuXHJcblx0XHQgKi9cclxuXHRcdGZsdXNoKCkgOiBDaGFubmVsRGF0YXtcclxuXHRcdFx0bGV0IHtjaGFubmVsRGF0YX0gPSB0aGlzO1xyXG5cdFx0XHRsZXQgciA6IENoYW5uZWxEYXRhPSB7fTtcclxuXHRcdFx0Zm9yIChsZXQgYyBpbiBjaGFubmVsRGF0YSkge1xyXG5cdFx0XHRcdGxldCBzID0gY2hhbm5lbERhdGFbY107XHJcblx0XHRcdFx0aWYgKHMpe1xyXG5cdFx0XHRcdFx0cltjXSA9IHM7XHJcblx0XHRcdFx0XHRjaGFubmVsRGF0YVtjXSA9ICcnO1x0XHRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHI7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdFxyXG5cdH1cclxuXHRcclxufSIsIi8vIFdyaXR0ZW4gaW4gMjAxNSBieSBUaGlsbyBQbGFueiBhbmQgQW5kcmV3IFBsb3RraW5cclxuLy8gVG8gdGhlIGV4dGVudCBwb3NzaWJsZSB1bmRlciBsYXcsIEkgaGF2ZSBkZWRpY2F0ZWQgYWxsIGNvcHlyaWdodCBhbmQgcmVsYXRlZCBhbmQgbmVpZ2hib3JpbmcgcmlnaHRzIFxyXG4vLyB0byB0aGlzIHNvZnR3YXJlIHRvIHRoZSBwdWJsaWMgZG9tYWluIHdvcmxkd2lkZS4gVGhpcyBzb2Z0d2FyZSBpcyBkaXN0cmlidXRlZCB3aXRob3V0IGFueSB3YXJyYW50eS4gXHJcbi8vIGh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL3B1YmxpY2RvbWFpbi96ZXJvLzEuMC9cclxuXHJcbm1vZHVsZSBGeXJlVk0ge1xyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIGEgc3RydWN0IHRvIGtlZXAgdHJhY2sgb2YgaGVhcCBmcmFnbWVudHNcclxuXHQgKi9cclxuXHRcclxuXHRjbGFzcyBIZWFwRW50cnkge1xyXG5cdFx0b2Zmc2V0OiBudW1iZXI7XHJcblx0XHRsZW5ndGg6IG51bWJlcjtcclxuXHRcdGNvbnN0cnVjdG9yKG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcil7XHJcblx0XHRcdHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xyXG5cdFx0XHR0aGlzLmxlbmd0aCA9IGxlbmd0aDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIE1hbmFnZXMgdGhlIGhlYXAgc2l6ZSBhbmQgYmxvY2sgYWxsb2NhdGlvbiBmb3IgdGhlIG1hbGxvYy9tZnJlZSBvcGNvZGVzLlxyXG5cdCAqIFxyXG5cdCAqIElmIEluZm9ybSBldmVyIHN0YXJ0cyB1c2luZyB0aGUgbWFsbG9jIG9wY29kZSBkaXJlY3RseSwgaW5zdGVhZCBvZlxyXG4gICAgICogaXRzIG93biBoZWFwIGFsbG9jYXRvciwgdGhpcyBzaG91bGQgYmUgbWFkZSBhIGxpdHRsZSBzbWFydGVyLlxyXG4gICAgICogQ3VycmVudGx5IHdlIG1ha2Ugbm8gYXR0ZW1wdCB0byBhdm9pZCBoZWFwIGZyYWdtZW50YXRpb24uXHJcblx0ICovXHJcblx0XHJcblx0ZXhwb3J0IGNsYXNzIEhlYXBBbGxvY2F0b3Ige1xyXG5cdFx0cHJpdmF0ZSBoZWFwQWRkcmVzczogbnVtYmVyO1xyXG5cdFx0cHJpdmF0ZSBlbmRNZW06IG51bWJlcjtcclxuXHRcdHByaXZhdGUgaGVhcEV4dGVudCA9IDA7XHJcblx0IFx0bWF4SGVhcEV4dGVudCA9IDBcclxuXHRcdHByaXZhdGUgbWVtb3J5OiBNZW1vcnlBY2Nlc3M7XHJcblx0XHRwcml2YXRlIGJsb2NrczogSGVhcEVudHJ5W10gPSBbXTtcclxuXHRcdHByaXZhdGUgZnJlZUxpc3Q6IEhlYXBFbnRyeVtdID0gW107XHJcblx0XHRcclxuXHRcdFxyXG5cdFx0Y29uc3RydWN0b3IoaGVhcEFkZHJlc3M6IG51bWJlciwgbWVtb3J5OiBNZW1vcnlBY2Nlc3Mpe1xyXG5cdFx0XHR0aGlzLmhlYXBBZGRyZXNzID0gaGVhcEFkZHJlc3M7XHJcblx0XHRcdHRoaXMubWVtb3J5ID0gbWVtb3J5O1xyXG5cdFx0XHR0aGlzLmVuZE1lbSA9IGhlYXBBZGRyZXNzO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdCAqIHNhdmVzIHRoZSBoZWFwIHN0YXRlIGludG8gYSBVaW50OEFycmF5LlxyXG5cdFx0ICogRG9lcyBub3QgaW5jbHVkZSB0aGUgbWVtb3J5IGl0c2VsZiwgb25seSB0aGUgYmxvY2sgYWxsb2NhdGlvbiBpbmZvcm1hdGlvbi5cclxuXHRcdCAqL1xyXG5cdFx0IHNhdmUoKTogVWludDhBcnJheSB7XHJcblx0XHRcdCBsZXQgY291bnQgPSB0aGlzLmJsb2NrQ291bnQoKSA7XHJcblx0XHRcdCBsZXQgcmVzdWx0ID0gbmV3IE1lbW9yeUFjY2Vzcyg4ICsgY291bnQgKiA4KTtcclxuXHRcdFx0IHJlc3VsdC53cml0ZUludDMyKDAsIHRoaXMuaGVhcEFkZHJlc3MpO1xyXG5cdFx0XHQgcmVzdWx0LndyaXRlSW50MzIoNCwgY291bnQpO1xyXG5cdFx0XHQgbGV0IHtibG9ja3N9ID0gdGhpcztcclxuXHRcdFx0IGZvcihsZXQgaT0wOyBpPGNvdW50OyBpKyspe1xyXG5cdFx0XHRcdCByZXN1bHQud3JpdGVJbnQzMig4KmkrOCwgYmxvY2tzW2ldLm9mZnNldCk7XHJcblx0XHRcdFx0IHJlc3VsdC53cml0ZUludDMyKDgqaSoxMiwgYmxvY2tzW2ldLmxlbmd0aCk7XHJcblx0XHRcdCB9XHJcblx0XHRcdCByZXR1cm4gcmVzdWx0LmJ1ZmZlcjtcclxuXHRcdCB9XHJcblx0XHQgXHJcblx0XHQgLyoqXHJcblx0XHQgICogcmVzdG9yZXMgdGhlIGhlYXAgc3RhdGUgZnJvbSBhbiBVaW50OEFycmF5IChhcyBjcmVhdGVkIGJ5IHRoZSBcInNhdmVcIiBtZXRob2QpXHJcblx0XHQgICovXHJcblx0XHRzdGF0aWMgcmVzdG9yZShidWZmZXI6IFVpbnQ4QXJyYXksIG1lbW9yeTogTWVtb3J5QWNjZXNzKSA6IEhlYXBBbGxvY2F0b3J7XHJcblx0XHRcdGxldCBtID0gbmV3IE1lbW9yeUFjY2VzcygwKTtcclxuXHRcdFx0bS5idWZmZXIgPSBidWZmZXI7XHJcblx0XHRcdGxldCBjb3VudCA9IG0ucmVhZEludDMyKDQpO1xyXG5cdFx0XHJcblx0XHRcdGlmIChjb3VudCA9PT0gMClcclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFxyXG5cdFx0XHRsZXQgaGVhcCA9IG5ldyBIZWFwQWxsb2NhdG9yKG0ucmVhZEludDMyKDApLCBtZW1vcnkpO1xyXG5cdFx0XHRsZXQgbmV4dEFkZHJlc3MgPSBoZWFwLmhlYXBBZGRyZXNzO1xyXG5cdFx0XHRmb3IgKGxldCBpPTA7IGk8Y291bnQ7IGkrKyl7XHJcblx0XHRcdFx0bGV0IHN0YXJ0ID0gbS5yZWFkSW50MzIoOCppKzgpO1xyXG5cdFx0XHRcdGxldCBsZW5ndGggPSBtLnJlYWRJbnQzMig4KmkrMTIpO1xyXG5cdFx0XHRcdGhlYXAuYmxvY2tzLnB1c2gobmV3IEhlYXBFbnRyeShzdGFydCwgbGVuZ3RoKSk7XHJcblx0XHRcdFx0aWYgKG5leHRBZGRyZXNzIDwgc3RhcnQpe1xyXG5cdFx0XHRcdFx0aGVhcC5mcmVlTGlzdC5wdXNoKG5ldyBIZWFwRW50cnkobmV4dEFkZHJlc3MsIHN0YXJ0LW5leHRBZGRyZXNzKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5leHRBZGRyZXNzID0gc3RhcnQrbGVuZ3RoO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRoZWFwLmVuZE1lbSA9IG5leHRBZGRyZXNzO1xyXG5cdFx0XHRoZWFwLmhlYXBFeHRlbnQgPSBuZXh0QWRkcmVzcyAtIGhlYXAuaGVhcEFkZHJlc3M7XHJcblx0XHRcdGlmICghaGVhcC5tZW1vcnkuc2V0RW5kTWVtKGhlYXAuZW5kTWVtKSl7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgYWxsb2NhdGUgVk0gbWVtb3J5IHRvIGZpdCBzYXZlZCBoZWFwXCIpXHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gVE9ETzogc29ydCBibG9ja2xpc3QgYW5kIGZyZWVsaXN0XHJcblx0XHRcdHJldHVybiBoZWFwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogYWxsb2NhdGVzIGEgbmV3IGJsb2NrIG9uIHRoZSBoZWFwXHJcblx0XHQgKiBAcmV0dXJuIHRoZSBhZGRyZXNzIG9mIHRoZSBuZXcgYmxvY2ssIG9yIG51bGwgaWYgYWxsb2NhdGlvbiBmYWlsZWRcclxuXHRcdCAqL1xyXG5cdFx0YWxsb2Moc2l6ZTogbnVtYmVyKSA6IG51bWJlcntcclxuXHRcdFx0XHRsZXQge2Jsb2NrcywgZnJlZUxpc3R9ID0gdGhpcztcclxuXHRcdFxyXG5cdFx0XHRcdGxldCByZXN1bHQgPSBuZXcgSGVhcEVudHJ5KC0xLCBzaXplKTtcclxuXHRcdFx0XHQvLyBsb29rIGZvciBhIGZyZWUgYmxvY2tcclxuXHRcdFx0XHRmb3IobGV0IGk9MDsgaTxmcmVlTGlzdC5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0XHRsZXQgZW50cnkgPSBmcmVlTGlzdFtpXTtcclxuXHRcdFx0XHRcdGlmKGVudHJ5ICYmIGVudHJ5Lmxlbmd0aCA+PSBzaXplKXtcclxuXHRcdFx0XHRcdFx0cmVzdWx0Lm9mZnNldCA9IGVudHJ5Lm9mZnNldDtcclxuXHRcdFx0XHRcdFx0aWYgKGVudHJ5Lmxlbmd0aCA+IHNpemUpe1xyXG5cdFx0XHRcdFx0XHRcdC8vIGtlZXAgdGhlIHJlc3QgaW4gdGhlIGZyZWUgbGlzdFxyXG5cdFx0XHRcdFx0XHRcdGVudHJ5Lm9mZnNldCArPSBzaXplO1xyXG5cdFx0XHRcdFx0XHRcdGVudHJ5Lmxlbmd0aCAtPSBzaXplO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRmcmVlTGlzdFtpXSA9IG51bGw7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChyZXN1bHQub2Zmc2V0ID09PSAtMSl7XHJcblx0XHRcdFx0XHQvLyBlbmZvcmNlIG1heCBoZWFwIHNpemVcclxuXHRcdFx0XHRcdGlmICh0aGlzLm1heEhlYXBFeHRlbnQgJiYgdGhpcy5oZWFwRXh0ZW50ICsgc2l6ZSA+IHRoaXMubWF4SGVhcEV4dGVudCl7XHJcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gYWRkIGEgbmV3IGJsb2NrXHJcblx0XHRcdFx0XHRyZXN1bHQub2Zmc2V0ID0gdGhpcy5oZWFwQWRkcmVzcyArIHRoaXMuaGVhcEV4dGVudDtcclxuXHRcdFx0XHRcdGlmIChyZXN1bHQub2Zmc2V0ICsgc2l6ZSA+IHRoaXMuZW5kTWVtKXtcclxuXHRcdFx0XHRcdFx0Ly8gZ3JvdyB0aGUgaGVhcFxyXG5cdFx0XHRcdFx0XHRsZXQgbmV3SGVhcEFsbG9jYXRpb24gPSBNYXRoLm1heChcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmhlYXBFeHRlbnQgKiA1IC8gNCwgdGhpcy5oZWFwRXh0ZW50ICsgc2l6ZSk7XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLm1heEhlYXBFeHRlbnQpe1xyXG5cdFx0XHRcdFx0XHRcdG5ld0hlYXBBbGxvY2F0aW9uID0gTWF0aC5taW4obmV3SGVhcEFsbG9jYXRpb24sIHRoaXMubWF4SGVhcEV4dGVudCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGlmICghIHRoaXMuc2V0RW5kTWVtKG5ld0hlYXBBbGxvY2F0aW9uKSl7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0dGhpcy5oZWFwRXh0ZW50ICs9IHNpemU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vIFRPRE86IGtlZXAgdGhlIGxpc3Qgc29ydGVkXHJcblx0XHRcdFx0YmxvY2tzLnB1c2gocmVzdWx0KTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0Lm9mZnNldDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cHJpdmF0ZSBzZXRFbmRNZW0obmV3SGVhcEFsbG9jYXRpb246IG51bWJlcikgOiBib29sZWFue1xyXG5cdFx0XHRsZXQgbmV3RW5kTWVtID0gdGhpcy5oZWFwQWRkcmVzcyArIG5ld0hlYXBBbGxvY2F0aW9uO1xyXG5cdFx0XHRpZiAodGhpcy5tZW1vcnkuc2V0RW5kTWVtKG5ld0VuZE1lbSkpe1xyXG5cdFx0XHRcdHRoaXMuZW5kTWVtID0gbmV3RW5kTWVtO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0YmxvY2tDb3VudCgpIDogbnVtYmVyIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuYmxvY2tzLmxlbmd0aDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0LyoqXHJcblx0XHQgKiBkZWFsbG9jYXRlcyBhIHByZXZpb3VzbHkgYWxsb2NhdGVkIGJsb2NrXHJcblx0XHQgKi9cclxuXHRcdGZyZWUoYWRkcmVzczogbnVtYmVyKXtcclxuXHRcdFx0bGV0IHtibG9ja3MsIGZyZWVMaXN0fSA9IHRoaXM7XHJcblx0XHRcdC8vIGZpbmQgdGhlIGJsb2NrXHJcblx0XHRcdGZvcihsZXQgaT0wOyBpPGJsb2Nrcy5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0bGV0IGJsb2NrID0gYmxvY2tzW2ldO1xyXG5cdFx0XHRcdGlmIChibG9jay5vZmZzZXQgPT09IGFkZHJlc3Mpe1xyXG5cdFx0XHRcdFx0Ly8gcmVtb3ZlIGl0XHJcblx0XHRcdFx0XHRibG9ja3Muc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdFx0Ly8gc2hyaW5rIHRoZSBoZWFwIGlmIHRoYXQgd2FzIGF0IHRoZSBlbmRcclxuXHRcdFx0XHRcdGlmIChhZGRyZXNzK2Jsb2NrLmxlbmd0aC10aGlzLmhlYXBBZGRyZXNzID09PSB0aGlzLmhlYXBFeHRlbnQpe1xyXG5cdFx0XHRcdFx0XHRsZXQgbmV3SGVhcEV4dGVudCA9IHRoaXMuaGVhcEFkZHJlc3M7XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaj0wOyBqPGJsb2Nrcy5sZW5ndGg7IGorKyl7XHJcblx0XHRcdFx0XHRcdFx0bGV0IGIgPSBibG9ja3Nbal07XHJcblx0XHRcdFx0XHRcdFx0bmV3SGVhcEV4dGVudCA9IE1hdGgubWF4KG5ld0hlYXBFeHRlbnQsIGIubGVuZ3RoICsgYi5vZmZzZXQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHRoaXMuaGVhcEV4dGVudCA9IG5ld0hlYXBFeHRlbnQgLSB0aGlzLmhlYXBBZGRyZXNzO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly8gYWRkIHRvIHRoZSBmcmVlIGxpc3RcclxuXHRcdFx0XHRcdFx0ZnJlZUxpc3QucHVzaChibG9jayk7XHJcblx0XHRcdFx0XHRcdC8vIFRPRE86IGtlZXAgc29ydGVkIGFuZCBjb2FsZXNjZSBmcmVlIGxpc3RcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0Ly8gc2hyaW5rIHRoZSBoZWFwXHJcblx0XHRcdFx0XHRpZiAoYmxvY2tzLmxlbmd0aCA+IDAgJiYgdGhpcy5oZWFwRXh0ZW50IDw9ICh0aGlzLmVuZE1lbSAtIHRoaXMuaGVhcEFkZHJlc3MpIC8gMil7XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLnNldEVuZE1lbSh0aGlzLmhlYXBFeHRlbnQpKXtcclxuXHRcdFx0XHRcdFx0XHR2YXIgbmV3RW5kTWVtID0gdGhpcy5lbmRNZW07XHJcblx0XHRcdFx0XHRcdFx0Zm9yKGxldCBpPTA7IGk8ZnJlZUxpc3QubGVuZ3RoOyBpKyspe1xyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IGVudHJ5ID0gZnJlZUxpc3RbaV07XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZW50cnkgJiYgZW50cnkub2Zmc2V0ID49IG5ld0VuZE1lbSl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZyZWVMaXN0W2ldID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHRcdFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHJldHVybjtcdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHQvKipcclxuXHQgKiAgV3JhcHBlciBhcm91bmQgRUNNQVNjcmlwdCA2IHN0YW5kYXJkIFVpbnQ4QXJyYXkuXHJcblx0ICogIFByb3ZpZGVzIGFjY2VzcyB0byBhIG1lbW9yeSBidWZmZXIuXHJcblx0ICovXHJcblx0ZXhwb3J0IGNsYXNzIE1lbW9yeUFjY2VzcyB7XHJcblx0XHRcclxuXHRcdHB1YmxpYyBidWZmZXI6IFVpbnQ4QXJyYXk7XHJcblx0XHRcclxuXHRcdHByaXZhdGUgbWF4U2l6ZTogbnVtYmVyO1xyXG5cdFx0XHJcblx0XHRjb25zdHJ1Y3RvcihzaXplOiBudW1iZXIsIG1heFNpemU9c2l6ZSl7XHJcblx0XHRcdHRoaXMuYnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7XHJcblx0XHRcdHRoaXMubWF4U2l6ZSA9IG1heFNpemU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogUmVhZHMgYSBzaW5nbGUgYnl0ZSAodW5zaWduZWQpXHJcblx0XHQgKi9cclxuXHRcdHJlYWRCeXRlKG9mZnNldDogbnVtYmVyKXtcclxuXHRcdFx0cmV0dXJuIHRoaXMuYnVmZmVyW29mZnNldF07XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdCAvKipcclxuXHRcdCAqIFdyaXRlcyBhIHNpbmdsZSBieXRlICh1bnNpZ25lZCkuXHJcblx0XHQgKiBXcml0ZXMgMCB3aGVuIHZhbHVlIGlzIHVuZGVmaW5lZCBvciBudWxsLlxyXG5cdFx0ICovXHJcblx0XHR3cml0ZUJ5dGUob2Zmc2V0OiBudW1iZXIsIHZhbHVlOm51bWJlcil7XHJcblx0XHRcdGlmICh2YWx1ZSA8IDAgfHwgdmFsdWUgPiAyNTUpXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGAke3ZhbHVlfSBpcyBvdXQgb2YgcmFuZ2UgZm9yIGEgYnl0ZWApO1xyXG5cdFx0XHR0aGlzLmJ1ZmZlcltvZmZzZXRdID0gdmFsdWU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogUmVhZHMgYW4gdW5zaWduZWQsIGJpZy1lbmRpYW4sIDE2LWJpdCBudW1iZXJcclxuXHRcdCAqL1xyXG5cdFx0cmVhZEludDE2KG9mZnNldDogbnVtYmVyKXtcclxuXHRcdFx0cmV0dXJuICh0aGlzLmJ1ZmZlcltvZmZzZXRdICogMjU2KSArIHRoaXMuYnVmZmVyW29mZnNldCsxXTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gVHlwZVNjcmlwdCBkb2VzIG5vdCBsaWtlIHVzIGNhbGxpbmcgXCJzZXRcIiB3aXRoIGFuIGFycmF5IGRpcmVjdGx5XHJcblx0XHRwcml2YXRlIHNldChvZmZzZXQ6IG51bWJlciwgdmFsdWU6IGFueSl7XHJcblx0XHRcdHRoaXMuYnVmZmVyLnNldCh2YWx1ZSwgb2Zmc2V0KTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0LyoqXHJcblx0XHQgKiBXcml0ZXMgYW4gdW5zaWduZWQsIGJpZy1lbmRpYW4sIDE2LWJpdCBudW1iZXIuXHJcblx0XHQgKiBXcml0ZXMgMCB3aGVuIHZhbHVlIGlzIHVuZGVmaW5lZCBvciBudWxsLlxyXG5cdFx0ICovXHJcblx0XHR3cml0ZUludDE2KG9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKXtcclxuXHRcdFx0aWYgKHZhbHVlIDwgMCB8fCB2YWx1ZSA+IDB4RkZGRilcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYCR7dmFsdWV9IGlzIG91dCBvZiByYW5nZSBmb3IgdWludDE2YCk7XHJcblx0XHRcdHRoaXMuc2V0KG9mZnNldCwgW3ZhbHVlID4+IDgsIHZhbHVlICYgMHhGRl0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQgLyoqXHJcblx0XHQgKiBSZWFkcyBhbiB1bnNpZ25lZCwgYmlnLWVuZGlhbiwgMzItYml0IG51bWJlclxyXG5cdFx0ICovXHJcblx0XHRyZWFkSW50MzIob2Zmc2V0OiBudW1iZXIpe1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5idWZmZXJbb2Zmc2V0XSAqIDB4MTAwMDAwMCBcclxuXHRcdFx0KyB0aGlzLmJ1ZmZlcltvZmZzZXQrMV0gKiAweDEwMDAwIFxyXG5cdFx0XHQrIHRoaXMuYnVmZmVyW29mZnNldCsyXSAqIDB4MTAwIFxyXG5cdFx0XHQrIHRoaXMuYnVmZmVyW29mZnNldCszXTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0LyoqXHJcblx0XHQgKiBXcml0ZXMgYW4gdW5zaWduZWQsIGJpZy1lbmRpYW4sIDMyLWJpdCBudW1iZXJcclxuXHRcdCAqIFdyaXRlcyAwIHdoZW4gdmFsdWUgaXMgdW5kZWZpbmVkIG9yIG51bGwuXHJcblx0XHQgKi9cclxuXHRcdHdyaXRlSW50MzIob2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpe1xyXG5cdFx0XHR2YWx1ZSA9IHZhbHVlID4+PiAwO1xyXG5cdFx0XHR0aGlzLnNldChvZmZzZXQsIFsgdmFsdWUgPj4gMjQsIHZhbHVlID4+IDE2ICYgMHhGRiwgdmFsdWUgPj4gOCAmIDB4RkYsIHZhbHVlICYgMHhGRl0pXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdCAvKipcclxuXHRcdCAgKiBDb252ZXJ0cyBwYXJ0IG9mIHRoZSBidWZmZXIgaW50byBhIFN0cmluZyxcclxuXHRcdCAgKiBhc3N1bWVzIHRoYXQgdGhlIGRhdGEgaXMgdmFsaWQgQVNDSUlcclxuXHRcdCAgKi9cclxuXHRcdHJlYWRBU0NJSShvZmZzZXQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpOiBzdHJpbmd7XHJcblx0XHRcdGxldCBsZW4gPSAwLCB7YnVmZmVyfSA9IHRoaXMsIGQgPSBbXTtcclxuXHRcdFx0d2hpbGUobGVuIDwgbGVuZ3RoKXtcclxuXHRcdFx0XHRsZXQgeCA9IGJ1ZmZlcltvZmZzZXQrbGVuXTtcclxuXHRcdFx0XHRsZW4rKztcdFxyXG5cdFx0XHRcdGQucHVzaCh4KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSguLi5kKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0IC8qKlxyXG5cdFx0ICAqIHJlYWRzIGEgMC10ZXJtaW5hdGVkIEMtc3RyaW5nXHJcblx0XHQgICovXHJcblx0XHRyZWFkQ1N0cmluZyhvZmZzZXQ6bnVtYmVyKTogc3RyaW5ne1xyXG5cdFx0XHRsZXQgbGVuID0gMCwge2J1ZmZlcn0gPSB0aGlzLCBkID0gW107XHJcblx0XHRcdHdoaWxlKHRydWUpe1xyXG5cdFx0XHRcdGxldCB4ID0gYnVmZmVyW29mZnNldCtsZW5dO1xyXG5cdFx0XHRcdGlmICh4ID09PSAwKVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0bGVuKys7XHRcclxuXHRcdFx0XHRkLnB1c2goeCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoLi4uZCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdCAvKipcclxuXHRcdCAgKiBXcml0ZXMgYW4gQVNDSUkgU3RyaW5nXHJcblx0XHQgICovXHJcblx0XHR3cml0ZUFTQ0lJKG9mZnNldDogbnVtYmVyLCB2YWx1ZTogc3RyaW5nKXtcclxuXHRcdFx0bGV0IGNvZGVzID0gW107XHJcblx0XHRcdGZvciAobGV0IGk9MDsgaTx2YWx1ZS5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0Y29kZXMucHVzaCh2YWx1ZS5jaGFyQ29kZUF0KGkpKVxyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuc2V0KG9mZnNldCwgY29kZXMpO1xyXG5cdFx0fVxyXG5cdFx0IFxyXG5cdFx0ICAvKipcclxuXHRcdCAgKiBSZXNpemVzIHRoZSBhdmFpbGFibGUgbWVtb3J5XHJcblx0XHQgICovXHRcdCBcclxuXHRcdHNldEVuZE1lbShuZXdFbmRNZW06IG51bWJlcikgOiBib29sZWFuIHtcclxuXHRcdFx0aWYgKG5ld0VuZE1lbSA+IHRoaXMubWF4U2l6ZSlcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQgLyoqXHJcblx0XHQgICogQ29weSBhIHBhcnQgb2YgdGhlIG1lbW9yeSBpbnRvIGEgbmV3IGJ1ZmZlci5cclxuXHRcdCAgKiBcclxuXHRcdCAgKiBUaGUgbGVuZ3RoIGNhbiBiZSBtb3JlIHRoYW4gdGhlcmUgaXMgZGF0YVxyXG5cdFx0ICAqIGluIHRoZSBvcmlnaW5hbCBidWZmZXIuIEluIHRoaXMgY2FzZSB0aGVcclxuXHRcdCAgKiBuZXcgYnVmZmVyIHdpbGwgY29udGFpbiB1bnNwZWNpZmllZCBkYXRhXHJcblx0XHQgICogYXQgdGhlIGVuZC5cclxuXHRcdCAgKi9cclxuXHRcdGNvcHkob2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKSA6IE1lbW9yeUFjY2VzcyB7XHJcblx0XHRcdC8vIFRPRE86IHJhbmdlIGNoZWNrXHJcblx0XHRcdGlmIChsZW5ndGggPiB0aGlzLm1heFNpemUpXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBNZW1vcnkgcmVxdWVzdCBmb3IgJHtsZW5ndGh9IGJ5dGVzIGV4Y2VlZHMgbGltaXQgb2YgJHt0aGlzLm1heFNpemV9YCk7XHJcblx0XHRcdGxldCByZXN1bHQgPSBuZXcgTWVtb3J5QWNjZXNzKGxlbmd0aCk7XHJcblx0XHRcdHJlc3VsdC5idWZmZXIuc2V0KHRoaXMuYnVmZmVyLnN1YmFycmF5KG9mZnNldCwgb2Zmc2V0K2xlbmd0aCkpO1xyXG5cdFx0XHRyZXN1bHQubWF4U2l6ZSA9IHRoaXMubWF4U2l6ZTtcclxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0IC8qKlxyXG5cdFx0ICAgKiByZXR1cm5zIHRoZSBudW1iZXIgb2YgYnl0ZXMgYXZhaWxhYmxlXHJcblx0XHQgICAqL1xyXG5cdFx0c2l6ZSgpe1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5idWZmZXIubGVuZ3RoO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG5cdFxyXG59XHJcblxyXG5cclxuXHJcbiIsIi8vIFdyaXR0ZW4gaW4gMjAxNSBieSBUaGlsbyBQbGFueiBcclxuLy8gVG8gdGhlIGV4dGVudCBwb3NzaWJsZSB1bmRlciBsYXcsIEkgaGF2ZSBkZWRpY2F0ZWQgYWxsIGNvcHlyaWdodCBhbmQgcmVsYXRlZCBhbmQgbmVpZ2hib3JpbmcgcmlnaHRzIFxyXG4vLyB0byB0aGlzIHNvZnR3YXJlIHRvIHRoZSBwdWJsaWMgZG9tYWluIHdvcmxkd2lkZS4gVGhpcyBzb2Z0d2FyZSBpcyBkaXN0cmlidXRlZCB3aXRob3V0IGFueSB3YXJyYW50eS4gXHJcbi8vIGh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL3B1YmxpY2RvbWFpbi96ZXJvLzEuMC9cclxuXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9J01lbW9yeUFjY2Vzcy50cycgLz5cclxuXHJcbi8qKlxyXG4gKiBSZXByZXNlbnRzIHRoZSBST00gYW5kIFJBTSBvZiBhIEdsdWx4IGdhbWUgaW1hZ2UuXHJcbiAqL1xyXG5cclxubW9kdWxlIEZ5cmVWTSB7XHJcblxyXG5cdC8vIEhlYWRlciBzaXplIGFuZCBmaWVsZCBvZmZzZXRzXHJcblx0Y29uc3QgZW51bSBHTFVMWF9IRFIge1xyXG5cdFx0U0laRSA9IDM2LFxyXG4gICAgICAgIE1BR0lDX09GRlNFVCA9IDAsXHJcblx0XHRWRVJTSU9OX09GRlNFVCA9IDQsXHJcbiAgICAgICAgUkFNU1RBUlRfT0ZGU0VUID0gOCxcclxuICAgICAgICBFWFRTVEFSVF9PRkZTRVQgPSAxMixcclxuICAgICAgICBFTkRNRU1fT0ZGU0VUID0gMTYsXHJcbiAgICAgICAgU1RBQ0tTSVpFX09GRlNFVCA9IDIwLFxyXG4gICAgICAgIFNUQVJURlVOQ19PRkZTRVQgPSAyNCxcclxuICAgICAgICBERUNPRElOR1RCTF9PRkZTRVQgPSAyOCxcclxuICAgICAgICBDSEVDS1NVTV9PRkZTRVQgPSAzMlxyXG5cdH07XHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgR2x1bHhIZWFkZXIge1xyXG5cdFx0bWFnaWM/OiBzdHJpbmc7XHJcblx0XHR2ZXJzaW9uPzogbnVtYmVyO1xyXG5cdFx0cmFtU3RhcnQ/OiBudW1iZXI7XHJcblx0XHRleHRTdGFydD86IG51bWJlcjtcclxuXHRcdGVuZE1lbT8gOiBudW1iZXI7XHJcblx0XHRzdGFja1NpemU/OiBudW1iZXI7XHJcblx0XHRzdGFydEZ1bmM/OiBudW1iZXI7XHJcblx0XHRkZWNvZGluZ1RibD86IG51bWJlcjtcclxuXHRcdGNoZWNrc3VtPzogbnVtYmVyO1xyXG5cdH1cclxuXHRcclxuXHJcblxyXG5cdGV4cG9ydCBjbGFzcyBVbHhJbWFnZXtcclxuXHRcdFxyXG5cdFx0cHJpdmF0ZSBtZW1vcnk6IE1lbW9yeUFjY2VzcztcclxuXHRcdHByaXZhdGUgcmFtc3RhcnQ6IG51bWJlcjtcclxuXHRcdHByaXZhdGUgb3JpZ2luYWw6IE1lbW9yeUFjY2VzcztcclxuXHRcdFxyXG5cdFx0Y29uc3RydWN0b3Iob3JpZ2luYWw6IE1lbW9yeUFjY2Vzcyl7XHJcblx0XHRcdHRoaXMub3JpZ2luYWwgPSBvcmlnaW5hbDtcclxuXHRcdFx0dGhpcy5sb2FkRnJvbU9yaWdpbmFsKCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHByaXZhdGUgbG9hZEZyb21PcmlnaW5hbCgpe1xyXG5cdFx0XHRsZXQgc3RyZWFtID0gdGhpcy5vcmlnaW5hbDtcclxuXHRcdFx0Ly8gcmVhZCB0aGUgaGVhZGVyLCB0byBmaW5kIG91dCBob3cgbXVjaCBtZW1vcnkgd2UgbmVlZFxyXG5cdFx0XHRsZXQgaGVhZGVyID0gc3RyZWFtLmNvcHkoMCwgR0xVTFhfSERSLlNJWkUpO1xyXG5cdFx0XHRsZXQgbWFnaWMgPSBoZWFkZXIucmVhZEFTQ0lJKDAsIDQpO1xyXG5cdFx0XHRpZiAobWFnaWMgIT09ICdHbHVsJyl7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGAudWx4IGZpbGUgaGFzIHdyb25nIG1hZ2ljIG51bWJlciAke21hZ2ljfWApO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgZW5kbWVtID0gaGVhZGVyLnJlYWRJbnQzMihHTFVMWF9IRFIuRU5ETUVNX09GRlNFVCk7XHJcblx0XHRcdGlmIChlbmRtZW0gPCBHTFVMWF9IRFIuU0laRSl7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIGVuZE1lbSAke2VuZG1lbX0gaW4gLnVseCBmaWxlLiBUb28gc21hbGwgdG8gZXZlbiBmaXQgdGhlIGhlYWRlci5gKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBub3cgcmVhZCB0aGUgd2hvbGUgdGhpbmdcclxuXHRcdFx0dGhpcy5tZW1vcnkgPSBzdHJlYW0uY29weSgwLCBlbmRtZW0pO1xyXG5cdFx0XHQvLyBUT0RPOiB2ZXJpZnkgY2hlY2tzdW1cclxuXHRcdFx0dGhpcy5yYW1zdGFydCA9IGhlYWRlci5yZWFkSW50MzIoR0xVTFhfSERSLlJBTVNUQVJUX09GRlNFVCk7XHJcblx0XHRcdGlmICh0aGlzLnJhbXN0YXJ0ID4gZW5kbWVtKXtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgcmFtU3RhcnQgJHt0aGlzLnJhbXN0YXJ0fSBiZXlvbmQgZW5kTWVtICR7ZW5kbWVtfS5gKTtcclxuXHRcdFx0fVx0XHRcdFxyXG5cdFx0fVxyXG5cdFxyXG5cdFx0Z2V0TWFqb3JWZXJzaW9uKCk6IG51bWJlcntcclxuXHRcdFx0cmV0dXJuIHRoaXMubWVtb3J5LnJlYWRJbnQxNihHTFVMWF9IRFIuVkVSU0lPTl9PRkZTRVQpO1xyXG5cdFx0fVxyXG5cdFxyXG5cdFx0Z2V0TWlub3JWZXJzaW9uKCk6IG51bWJlcntcclxuXHRcdFx0cmV0dXJuIHRoaXMubWVtb3J5LnJlYWRJbnQxNihHTFVMWF9IRFIuVkVSU0lPTl9PRkZTRVQrMikgPj4gODtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Z2V0U3RhY2tTaXplKCk6IG51bWJlciB7XHJcblx0XHRcdHJldHVybiB0aGlzLm1lbW9yeS5yZWFkSW50MzIoR0xVTFhfSERSLlNUQUNLU0laRV9PRkZTRVQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRnZXRFbmRNZW0oKTogbnVtYmVyIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMubWVtb3J5LnNpemUoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Z2V0UmFtQWRkcmVzcyhyZWxhdGl2ZUFkZHJlc3M6IG51bWJlcik6IG51bWJlcntcclxuXHRcdFx0cmV0dXJuIHRoaXMucmFtc3RhcnQgKyByZWxhdGl2ZUFkZHJlc3M7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogc2V0cyB0aGUgYWRkcmVzcyBhdCB3aGljaCBtZW1vcnkgZW5kcy5cclxuXHRcdCAqIFRoaXMgY2FuIGJlIGNoYW5nZWQgYnkgdGhlIGdhbWUgd2l0aCBzZXRtZW1zaXplLFxyXG5cdFx0ICogb3IgbWFuYWdlZCBhdXRvbWF0aWNhbGx5IGJlIHRoZSBoZWFwIGFsbG9jYXRvci5cclxuXHRcdCAqL1xyXG5cdFx0c2V0RW5kTWVtKHZhbHVlOiBudW1iZXIpe1xyXG5cdFx0XHQvLyByb3VuZCB1cCB0byB0aGUgbmV4dCBtdWx0aXBsZSBvZiAyNTZcclxuXHRcdFx0aWYgKHZhbHVlICUgMjU2ICE9IDApe1xyXG5cdFx0XHRcdHZhbHVlID0gKHZhbHVlICsgMjU1KSAmIDB4RkZGRkZGMDA7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMubWVtb3J5LnNpemUoKSAhPSB2YWx1ZSl7XHJcblx0XHRcdFx0dGhpcy5tZW1vcnkgPSB0aGlzLm1lbW9yeS5jb3B5KDAsIHZhbHVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRnZXRTdGFydEZ1bmMoKTogbnVtYmVyIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMubWVtb3J5LnJlYWRJbnQzMihHTFVMWF9IRFIuU1RBUlRGVU5DX09GRlNFVCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGdldERlY29kaW5nVGFibGUoKTogbnVtYmVyIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMubWVtb3J5LnJlYWRJbnQzMihHTFVMWF9IRFIuREVDT0RJTkdUQkxfT0ZGU0VUKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0c2F2ZVRvUXVldHphbCgpOiBRdWV0emFsIHtcclxuXHRcdFx0bGV0IHF1ZXR6YWwgPSBuZXcgUXVldHphbCgpO1xyXG5cdFx0XHQvLyAnSUZoZCcgaWRlbnRpZmllcyB0aGUgZmlyc3QgMTI4IGJ5dGVzIG9mIHRoZSBnYW1lIGZpbGVcclxuXHRcdFx0cXVldHphbC5zZXRDaHVuaygnSUZoZCcsIHRoaXMub3JpZ2luYWwuY29weSgwLCAxMjgpLmJ1ZmZlcik7XHJcblx0XHRcdC8vICdDTWVtJyBvciAnVU1lbScgYXJlIHRoZSBjb21wcmVzc2VkL3VuY29tcHJlc3NlZCBjb250ZW50cyBvZiBSQU1cclxuICAgICAgICAgICBcdC8vIFRPRE86IGltcGxlbWVudCBjb21wcmVzc2lvblxyXG5cdFx0XHRsZXQgcmFtU2l6ZSA9IHRoaXMuZ2V0RW5kTWVtKCkgLSB0aGlzLnJhbXN0YXJ0O1xyXG5cdFx0XHRsZXQgdW1lbSA9IG5ldyBNZW1vcnlBY2Nlc3MocmFtU2l6ZSs0KTtcclxuXHRcdFx0dW1lbS53cml0ZUludDMyKDAsIHJhbVNpemUpO1xyXG5cdFx0XHR1bWVtLmJ1ZmZlci5zZXQobmV3IFVpbnQ4QXJyYXkodGhpcy5tZW1vcnkuYnVmZmVyKS5zdWJhcnJheSh0aGlzLnJhbXN0YXJ0LCB0aGlzLnJhbXN0YXJ0K3JhbVNpemUpLCA0KTtcclxuXHRcdFx0cXVldHphbC5zZXRDaHVuayhcIlVNZW1cIiwgdW1lbS5idWZmZXIpO1xyXG5cdFx0XHRyZXR1cm4gcXVldHphbDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmVhZEJ5dGUoYWRkcmVzczogbnVtYmVyKSA6IG51bWJlciB7XHJcblx0XHRcdHJldHVybiB0aGlzLm1lbW9yeS5yZWFkQnl0ZShhZGRyZXNzKTtcclxuXHRcdH1cclxuXHRcclxuXHRcdHJlYWRJbnQxNihhZGRyZXNzOiBudW1iZXIpIDogbnVtYmVyIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMubWVtb3J5LnJlYWRJbnQxNihhZGRyZXNzKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmVhZEludDMyKGFkZHJlc3M6IG51bWJlcikgOiBudW1iZXIge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5tZW1vcnkucmVhZEludDMyKGFkZHJlc3MpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZWFkQ1N0cmluZyhhZGRyZXNzOiBudW1iZXIpOiBzdHJpbmcge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5tZW1vcnkucmVhZENTdHJpbmcoYWRkcmVzcyk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHdyaXRlSW50MzIoYWRkcmVzczogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKSB7XHJcblx0XHRcdGlmIChhZGRyZXNzIDwgdGhpcy5yYW1zdGFydClcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFdyaXRpbmcgaW50byBST00hIG9mZnNldDogJHthZGRyZXNzfWApO1xyXG5cdFx0XHR0aGlzLm1lbW9yeS53cml0ZUludDMyKGFkZHJlc3MsIHZhbHVlKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0d3JpdGVCeXRlcyhhZGRyZXNzOiBudW1iZXIsIC4uLmJ5dGVzOiBudW1iZXJbXSl7XHJcblx0XHRcdGlmIChhZGRyZXNzIDwgdGhpcy5yYW1zdGFydClcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFdyaXRpbmcgaW50byBST00hIG9mZnNldDogJHthZGRyZXNzfWApO1xyXG5cdFx0XHRmb3IgKGxldCBpPTA7IGk8Ynl0ZXMubGVuZ3RoOyBpKyspe1xyXG5cdFx0XHRcdHRoaXMubWVtb3J5LndyaXRlQnl0ZShhZGRyZXNzK2ksIGJ5dGVzW2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFxyXG5cdFx0d3JpdGUocnVsZTpPcGNvZGVSdWxlLCBhZGRyZXNzOm51bWJlciwgdmFsdWU6bnVtYmVyKXtcclxuXHRcdFx0c3dpdGNoKHJ1bGUpe1xyXG5cdFx0XHRcdGNhc2UgT3Bjb2RlUnVsZS5JbmRpcmVjdDhCaXQ6XHJcblx0XHRcdFx0XHR0aGlzLndyaXRlQnl0ZXMoYWRkcmVzcywgdmFsdWUpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdGNhc2UgT3Bjb2RlUnVsZS5JbmRpcmVjdDE2Qml0OlxyXG5cdFx0XHRcdFx0dGhpcy53cml0ZUJ5dGVzKGFkZHJlc3MsIHZhbHVlID4+OCwgdmFsdWUgJiAweEZGKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0dGhpcy53cml0ZUludDMyKGFkZHJlc3MsIHZhbHVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdCAqIEBwYXJhbSBsaW1pdDogdGhlIG1heGltdW0gbnVtYmVyIG9mIGJ5dGVzIHRvIHdyaXRlXHJcblx0XHQgKiByZXR1cm5zIHRoZSBudW1iZXIgb2YgYnl0ZXMgd3JpdHRlblxyXG5cdFx0ICovXHJcblx0XHR3cml0ZUFTQ0lJKGFkZHJlc3M6IG51bWJlciwgdGV4dDogc3RyaW5nLCBsaW1pdDogbnVtYmVyKTogbnVtYmVye1xyXG5cdFx0XHRsZXQgYnl0ZXMgPSBbXTtcclxuXHRcdFx0Zm9yIChsZXQgaT0wOyBpPHRleHQubGVuZ3RoICYmIGk8IGxpbWl0OyBpKyspe1xyXG5cdFx0XHRcdGxldCBjID0gdGV4dC5jaGFyQ29kZUF0KGkpO1xyXG5cdFx0XHRcdGlmIChjID4gMjU1KXtcclxuXHRcdFx0XHRcdGMgPSA2MzsgLy8gJz8nXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGJ5dGVzLnB1c2goYyk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy53cml0ZUJ5dGVzKGFkZHJlc3MsIC4uLmJ5dGVzKTtcclxuXHRcdFx0cmV0dXJuIGJ5dGVzLmxlbmd0aDtcclxuXHRcdH1cclxuXHRcclxuXHRcdHN0YXRpYyB3cml0ZUhlYWRlcihmaWVsZHM6IEdsdWx4SGVhZGVyLCBtOiBNZW1vcnlBY2Nlc3MsIG9mZnNldD0wKXtcclxuXHRcdFx0bS53cml0ZUFTQ0lJKG9mZnNldCwgZmllbGRzLm1hZ2ljIHx8ICdHbHVsJyk7XHJcblx0XHRcdG0ud3JpdGVJbnQzMihvZmZzZXQgKyBHTFVMWF9IRFIuVkVSU0lPTl9PRkZTRVQsIGZpZWxkcy52ZXJzaW9uKTtcclxuXHRcdFx0bS53cml0ZUludDMyKG9mZnNldCArIEdMVUxYX0hEUi5SQU1TVEFSVF9PRkZTRVQsIGZpZWxkcy5yYW1TdGFydCk7XHJcblx0XHRcdG0ud3JpdGVJbnQzMihvZmZzZXQgKyBHTFVMWF9IRFIuRVhUU1RBUlRfT0ZGU0VULCBmaWVsZHMuZXh0U3RhcnQpO1xyXG5cdFx0XHRtLndyaXRlSW50MzIob2Zmc2V0ICsgR0xVTFhfSERSLkVORE1FTV9PRkZTRVQsIGZpZWxkcy5lbmRNZW0pO1xyXG5cdFx0XHRtLndyaXRlSW50MzIob2Zmc2V0ICsgR0xVTFhfSERSLlNUQUNLU0laRV9PRkZTRVQsIGZpZWxkcy5zdGFja1NpemUpO1xyXG5cdFx0XHRtLndyaXRlSW50MzIob2Zmc2V0ICsgR0xVTFhfSERSLlNUQVJURlVOQ19PRkZTRVQsIGZpZWxkcy5zdGFydEZ1bmMpO1xyXG5cdFx0XHRtLndyaXRlSW50MzIob2Zmc2V0ICsgR0xVTFhfSERSLkRFQ09ESU5HVEJMX09GRlNFVCwgZmllbGRzLmRlY29kaW5nVGJsKTtcclxuXHRcdFx0bS53cml0ZUludDMyKG9mZnNldCArIEdMVUxYX0hEUi5DSEVDS1NVTV9PRkZTRVQsIGZpZWxkcy5jaGVja3N1bSk7XHJcblx0XHR9XHJcblx0XHJcblx0XHJcblx0ICAgIC8qKiBSZWxvYWRzIHRoZSBnYW1lIGZpbGUsIGRpc2NhcmRpbmcgYWxsIGNoYW5nZXMgdGhhdCBoYXZlIGJlZW4gbWFkZVxyXG4gICAgICAgICogdG8gUkFNIGFuZCByZXN0b3JpbmcgdGhlIG1lbW9yeSBtYXAgdG8gaXRzIG9yaWdpbmFsIHNpemUuXHJcblx0XHQqIFxyXG5cdFx0KiBVc2UgdGhlIG9wdGlvbmFsIFwicHJvdGVjdGlvblwiIHBhcmFtZXRlcnMgdG8gcHJlc2VydmUgYSBSQU0gcmVnaW9uXHJcblx0XHQqL1xyXG5cdFx0cmV2ZXJ0KHByb3RlY3Rpb25TdGFydD0wLCBwcm90ZWN0aW9uTGVuZ3RoPTApe1xyXG5cdFx0XHRsZXQgcHJvdCA9IHRoaXMuY29weVByb3RlY3RlZFJhbShwcm90ZWN0aW9uU3RhcnQsIHByb3RlY3Rpb25MZW5ndGgpO1xyXG5cdFx0XHR0aGlzLmxvYWRGcm9tT3JpZ2luYWwoKTtcdFxyXG5cdFx0XHRpZiAocHJvdCl7XHJcblx0XHRcdFx0bGV0IGQgPSBbXTtcclxuXHRcdFx0XHRmb3IobGV0IGk9MDsgaTxwcm90ZWN0aW9uTGVuZ3RoOyBpKyspe1xyXG5cdFx0XHRcdFx0ZC5wdXNoKHByb3QucmVhZEJ5dGUoaSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLndyaXRlQnl0ZXMocHJvdGVjdGlvblN0YXJ0LCAuLi5kKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRwcml2YXRlIGNvcHlQcm90ZWN0ZWRSYW0ocHJvdGVjdGlvblN0YXJ0LCBwcm90ZWN0aW9uTGVuZ3RoKSA6IE1lbW9yeUFjY2VzcyB7XHJcblx0XHRcdGxldCBwcm90IDogTWVtb3J5QWNjZXNzPSBudWxsO1xyXG5cdFx0XHRpZiAocHJvdGVjdGlvbkxlbmd0aCA+IDApe1xyXG5cdFx0XHRcdGlmIChwcm90ZWN0aW9uU3RhcnQgKyBwcm90ZWN0aW9uTGVuZ3RoID4gdGhpcy5nZXRFbmRNZW0oKSl7XHJcblx0XHRcdFx0XHRwcm90ZWN0aW9uTGVuZ3RoID0gdGhpcy5nZXRFbmRNZW0oKSAtIHByb3RlY3Rpb25TdGFydDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gY2FuIG9ubHkgcHJvdGVjdCBSQU1cclxuXHRcdFx0XHRsZXQgc3RhcnQgPSBwcm90ZWN0aW9uU3RhcnQgLSB0aGlzLnJhbXN0YXJ0O1xyXG5cdFx0XHRcdGlmIChzdGFydCA8IDApe1xyXG5cdFx0XHRcdFx0cHJvdGVjdGlvbkxlbmd0aCArPSBzdGFydDtcclxuXHRcdFx0XHRcdHN0YXJ0ID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cHJvdCA9IHRoaXMubWVtb3J5LmNvcHkoc3RhcnQgKyB0aGlzLnJhbXN0YXJ0LCBwcm90ZWN0aW9uTGVuZ3RoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcHJvdDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmVzdG9yZUZyb21RdWV0emFsKHF1ZXR6YWw6IFF1ZXR6YWwsIHByb3RlY3Rpb25TdGFydD0wLCBwcm90ZWN0aW9uTGVuZ3RoPTApe1xyXG5cdFx0XHQvLyBUT0RPOiBzdXBwb3J0IGNvbXByZXNzZWQgUkFNXHJcblx0XHRcdGxldCBuZXdSYW0gPSBxdWV0emFsLmdldENodW5rKCdVTWVtJyk7XHJcblx0XHRcdGlmIChuZXdSYW0pe1xyXG5cdFx0XHRcdGxldCBwcm90ID0gdGhpcy5jb3B5UHJvdGVjdGVkUmFtKHByb3RlY3Rpb25TdGFydCwgcHJvdGVjdGlvbkxlbmd0aCk7XHJcblx0XHRcdFxyXG5cdFx0XHRcdGxldCByID0gbmV3IE1lbW9yeUFjY2VzcygwKTtcclxuXHRcdFx0XHRyLmJ1ZmZlcj0gbmV3IFVpbnQ4QXJyYXkobmV3UmFtKTtcclxuXHRcdFx0XHRsZXQgbGVuZ3RoID0gci5yZWFkSW50MzIoMCk7XHJcblx0XHRcdFx0dGhpcy5zZXRFbmRNZW0obGVuZ3RoICsgdGhpcy5yYW1zdGFydCk7XHJcblx0XHRcdFx0bGV0IGk9NDtcclxuXHRcdFx0XHRsZXQgaj10aGlzLnJhbXN0YXJ0O1xyXG5cdFx0XHRcdHdoaWxlKGk8bmV3UmFtLmJ5dGVMZW5ndGgpe1xyXG5cdFx0XHRcdFx0dGhpcy5tZW1vcnkud3JpdGVCeXRlKGorKywgci5yZWFkQnl0ZShpKyspKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKHByb3Qpe1xyXG5cdFx0XHRcdFx0bGV0IGQgPSBbXTtcclxuXHRcdFx0XHRcdGZvcihsZXQgaT0wOyBpPHByb3RlY3Rpb25MZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0XHRcdGQucHVzaChwcm90LnJlYWRCeXRlKGkpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHRoaXMud3JpdGVCeXRlcyhwcm90ZWN0aW9uU3RhcnQsIC4uLmQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiTWlzc2luZyBDTWVtL1VNZW0gYmxvY2tzXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHR9XHJcblx0XHJcbn0iLCIvLyBzbGlnaHRseSBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2JlYXRnYW1taXQvYmFzZTY0LWpzXHJcblxyXG5tb2R1bGUgQmFzZTY0IHtcclxuXHJcbiAgdmFyIGxvb2t1cCA9IFtdXHJcbiAgdmFyIHJldkxvb2t1cCA9IFtdXHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICB2YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgbG9va3VwW2ldID0gY29kZVtpXVxyXG4gICAgICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcclxuICAgIH1cclxuXHJcbiAgICByZXZMb29rdXBbJy0nLmNoYXJDb2RlQXQoMCldID0gNjJcclxuICAgIHJldkxvb2t1cFsnXycuY2hhckNvZGVBdCgwKV0gPSA2M1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpXHJcblxyXG4gIGV4cG9ydCBmdW5jdGlvbiB0b0J5dGVBcnJheShiNjQpOiBVaW50OEFycmF5IHtcclxuICAgIHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXHJcbiAgICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxyXG5cclxuICAgIGlmIChsZW4gJSA0ID4gMCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXHJcbiAgICAvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XHJcbiAgICAvLyByZXByZXNlbnQgb25lIGJ5dGVcclxuICAgIC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xyXG4gICAgLy8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxyXG4gICAgcGxhY2VIb2xkZXJzID0gYjY0W2xlbiAtIDJdID09PSAnPScgPyAyIDogYjY0W2xlbiAtIDFdID09PSAnPScgPyAxIDogMFxyXG5cclxuICAgIC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxyXG4gICAgYXJyID0gbmV3IFVpbnQ4QXJyYXkobGVuICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXHJcblxyXG4gICAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xyXG4gICAgbCA9IHBsYWNlSG9sZGVycyA+IDAgPyBsZW4gLSA0IDogbGVuXHJcblxyXG4gICAgdmFyIEwgPSAwXHJcblxyXG4gICAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xyXG4gICAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxOCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildIDw8IDYpIHwgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAzKV1cclxuICAgICAgYXJyW0wrK10gPSAodG1wID4+IDE2KSAmIDB4RkZcclxuICAgICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxyXG4gICAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcclxuICAgIH1cclxuXHJcbiAgICBpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XHJcbiAgICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXHJcbiAgICAgIGFycltMKytdID0gdG1wICYgMHhGRlxyXG4gICAgfSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcclxuICAgICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDQpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXHJcbiAgICAgIGFycltMKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcclxuICAgICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFyclxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0KG51bSkge1xyXG4gICAgcmV0dXJuIGxvb2t1cFtudW0gPj4gMTggJiAweDNGXSArIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICsgbG9va3VwW251bSAmIDB4M0ZdXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBlbmNvZGVDaHVuayh1aW50OCwgc3RhcnQsIGVuZCkge1xyXG4gICAgdmFyIHRtcFxyXG4gICAgdmFyIG91dHB1dCA9IFtdXHJcbiAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gMykge1xyXG4gICAgICB0bXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXHJcbiAgICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG91dHB1dC5qb2luKCcnKVxyXG4gIH1cclxuXHJcbiAgZXhwb3J0IGZ1bmN0aW9uIGZyb21CeXRlQXJyYXkodWludDgpIHtcclxuICAgIHZhciB0bXBcclxuICAgIHZhciBsZW4gPSB1aW50OC5sZW5ndGhcclxuICAgIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xyXG4gICAgdmFyIG91dHB1dCA9ICcnXHJcbiAgICB2YXIgcGFydHMgPSBbXVxyXG4gICAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXHJcblxyXG4gICAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxyXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbjIgPSBsZW4gLSBleHRyYUJ5dGVzOyBpIDwgbGVuMjsgaSArPSBtYXhDaHVua0xlbmd0aCkge1xyXG4gICAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKHVpbnQ4LCBpLCAoaSArIG1heENodW5rTGVuZ3RoKSA+IGxlbjIgPyBsZW4yIDogKGkgKyBtYXhDaHVua0xlbmd0aCkpKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcclxuICAgIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XHJcbiAgICAgIHRtcCA9IHVpbnQ4W2xlbiAtIDFdXHJcbiAgICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDJdXHJcbiAgICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdXHJcbiAgICAgIG91dHB1dCArPSAnPT0nXHJcbiAgICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcclxuICAgICAgdG1wID0gKHVpbnQ4W2xlbiAtIDJdIDw8IDgpICsgKHVpbnQ4W2xlbiAtIDFdKVxyXG4gICAgICBvdXRwdXQgKz0gbG9va3VwW3RtcCA+PiAxMF1cclxuICAgICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl1cclxuICAgICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDIpICYgMHgzRl1cclxuICAgICAgb3V0cHV0ICs9ICc9J1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnRzLnB1c2gob3V0cHV0KVxyXG5cclxuICAgIHJldHVybiBwYXJ0cy5qb2luKCcnKVxyXG4gIH1cclxuXHJcbn1cclxuIiwiLy8gV3JpdHRlbiBpbiAyMDE1IGJ5IFRoaWxvIFBsYW56IFxyXG4vLyBUbyB0aGUgZXh0ZW50IHBvc3NpYmxlIHVuZGVyIGxhdywgSSBoYXZlIGRlZGljYXRlZCBhbGwgY29weXJpZ2h0IGFuZCByZWxhdGVkIGFuZCBuZWlnaGJvcmluZyByaWdodHMgXHJcbi8vIHRvIHRoaXMgc29mdHdhcmUgdG8gdGhlIHB1YmxpYyBkb21haW4gd29ybGR3aWRlLiBUaGlzIHNvZnR3YXJlIGlzIGRpc3RyaWJ1dGVkIHdpdGhvdXQgYW55IHdhcnJhbnR5LiBcclxuLy8gaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvcHVibGljZG9tYWluL3plcm8vMS4wL1xyXG5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD0nTWVtb3J5QWNjZXNzLnRzJyAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vYjY0LnRzXCIgLz5cclxuXHJcblxyXG5tb2R1bGUgRnlyZVZNIHtcclxuXHRcclxuXHRcclxuXHRcclxuXHQvLy8gSW1wbGVtZW50cyB0aGUgUXVldHphbCBzYXZlZC1nYW1lIGZpbGUgc3BlY2lmaWNhdGlvbiBieSBob2xkaW5nIGEgbGlzdCBvZlxyXG4gICAgLy8vIHR5cGVkIGRhdGEgY2h1bmtzIHdoaWNoIGNhbiBiZSByZWFkIGZyb20gb3Igd3JpdHRlbiB0byBzdHJlYW1zLlxyXG4gICAgLy8vIGh0dHA6Ly93d3cuaWZhcmNoaXZlLm9yZy9pZi1hcmNoaXZlL2luZm9jb20vaW50ZXJwcmV0ZXJzL3NwZWNpZmljYXRpb24vc2F2ZWZpbGVfMTQudHh0XHJcblx0ZXhwb3J0IGNsYXNzIFF1ZXR6YWwge1xyXG5cdFx0XHJcblx0XHRwcml2YXRlIGNodW5rcyA6IHsgWyAgbmFtZSA6IHN0cmluZyBdIDogVWludDhBcnJheSB9ID0ge307XHJcblx0XHRcclxuXHRcdHNldENodW5rKG5hbWU6IHN0cmluZywgdmFsdWU6IFVpbnQ4QXJyYXkpe1xyXG5cdFx0XHRpZiAobmFtZS5sZW5ndGggIT0gNCl7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIGNodW5rIGlkICR7bmFtZX0sIG11c3QgYmUgZm91ciBBU0NJSSBjaGFyc2ApO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuY2h1bmtzW25hbWVdID0gdmFsdWU7IFxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRnZXRDaHVuayhuYW1lOiBzdHJpbmcpOiBVaW50OEFycmF5IHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuY2h1bmtzW25hbWVdO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRnZXRJRmhkQ2h1bmsoKTogVWludDhBcnJheSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmdldENodW5rKCdJRmhkJylcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0XHJcblx0XHRzZXJpYWxpemUoKSA6IFVpbnQ4QXJyYXl7XHJcblx0XHRcdC8vIGRldGVybWluZSB0aGUgYnVmZmVyIHNpemVcclxuXHRcdFx0bGV0IHNpemUgPSAxMjsgIC8vIHRocmVlIGludDMyIGhlYWRlcnNcclxuXHRcdFx0bGV0IHsgY2h1bmtzIH0gPSB0aGlzO1xyXG5cdFx0XHRmb3IgKGxldCBuYW1lIGluIGNodW5rcykge1xyXG5cdFx0XHRcdHNpemUgKz0gNDsgIC8vIHRoZSBrZXlcclxuXHRcdFx0XHRzaXplICs9IDQ7ICAvLyB0aGUgdmFsdWUgbGVuZ3RoXHJcblx0XHRcdFx0c2l6ZSArPSBjaHVua3NbbmFtZV0uYnl0ZUxlbmd0aDsgXHRcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgZmlsZUxlbmd0aCA9IHNpemUgLSA4O1xyXG5cdFx0XHRpZiAoc2l6ZSAlIDIpe1xyXG5cdFx0XHRcdHNpemUgKys7ICAvLyBwYWRkaW5nXHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0bGV0IG0gPSBuZXcgTWVtb3J5QWNjZXNzKHNpemUpO1xyXG5cdFx0XHRtLndyaXRlQnl0ZShzaXplLTEsIDApO1xyXG5cdFx0XHRtLndyaXRlQVNDSUkoMCwgJ0ZPUk0nKTsgLy8gSUZGIHRhZ1xyXG5cdFx0XHRtLndyaXRlSW50MzIoNCwgZmlsZUxlbmd0aCk7IFxyXG5cdFx0XHRtLndyaXRlQVNDSUkoOCwgJ0lGWlMnKTsgLy8gRk9STSBzdWItSUQgZm9yIFF1ZXR6YWxcclxuXHRcdFx0bGV0IHBvcyA9IDEyO1xyXG5cdFx0XHRmb3IgKGxldCBuYW1lIGluIGNodW5rcykge1xyXG5cdFx0XHRcdG0ud3JpdGVBU0NJSShwb3MsIG5hbWUpO1xyXG5cdFx0XHRcdGxldCB2YWx1ZSA9IGNodW5rc1tuYW1lXTtcclxuXHRcdFx0XHRsZXQgbGVuID0gIHZhbHVlLmJ5dGVMZW5ndGg7XHJcblx0XHRcdFx0bS53cml0ZUludDMyKHBvcys0LCBsZW4pO1xyXG5cdFx0XHRcdG0uYnVmZmVyLnNldChuZXcgVWludDhBcnJheSh2YWx1ZSksIHBvcys4KTtcclxuXHRcdFx0XHRwb3MgKz0gOCArIGxlbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIG0uYnVmZmVyO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzdGF0aWMgbG9hZChidWZmZXI6IFVpbnQ4QXJyYXkpOiBRdWV0emFsIHtcclxuXHRcdFx0bGV0IHEgPSBuZXcgUXVldHphbCgpO1xyXG5cdFx0XHRsZXQgbSA9IG5ldyBNZW1vcnlBY2Nlc3MoMCk7XHJcblx0XHRcdG0uYnVmZmVyID0gYnVmZmVyO1xyXG5cdFx0XHRsZXQgdHlwZSA9IG0ucmVhZEFTQ0lJKDAsIDQpO1xyXG5cdFx0XHRpZiAodHlwZSAhPT0gJ0ZPUk0nICYmIHR5cGUgIT09ICdMSVNUJyAmJiB0eXBlICE9PSAnQ0FUXycpe1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgaW52YWxpZCBJRkYgdHlwZSAke3R5cGV9YCk7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGxlbmd0aCA9IG0ucmVhZEludDMyKDQpO1xyXG5cdFx0XHRpZiAoYnVmZmVyLmJ5dGVMZW5ndGggPCA4ICsgbGVuZ3RoKXtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJRdWV0emFsIGZpbGUgaXMgdG9vIHNob3J0IGZvciAke2xlbmd0aH0gYnl0ZXNcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0dHlwZSA9IG0ucmVhZEFTQ0lJKDgsIDQpO1xyXG5cdFx0XHRpZiAodHlwZSAhPT0gJ0lGWlMnKXtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgSUZGIHN1Yi10eXBlICR7dHlwZX0uIE5vdCBhIFF1ZXR6YWwgZmlsZWApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBwb3MgPSAxMjtcclxuXHRcdFx0bGV0IGxpbWl0ID0gOCArIGxlbmd0aDtcclxuXHRcdFx0d2hpbGUgKHBvcyA8IGxpbWl0KXtcclxuXHRcdFx0XHRsZXQgbmFtZSA9IG0ucmVhZEFTQ0lJKHBvcywgNCk7XHJcblx0XHRcdFx0bGVuZ3RoID0gbS5yZWFkSW50MzIocG9zKzQpO1xyXG5cdFx0XHRcdGxldCB2YWx1ZSA9IG0uYnVmZmVyLnN1YmFycmF5KHBvcys4LCBwb3MrOCtsZW5ndGgpO1xyXG5cdFx0XHRcdHEuc2V0Q2h1bmsobmFtZSwgdmFsdWUpO1xyXG5cdFx0XHRcdHBvcyArPSA4ICsgbGVuZ3RoO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBxO1xyXG5cdFx0fVxyXG5cdFxyXG5cdFx0LyoqXHJcblx0XHQgKiBjb252ZW5pZW5jZSBtZXRob2QgdG8gZW5jb2RlIGEgUXVldHphbCBmaWxlIGFzIEJhc2U2NFxyXG5cdFx0ICovXHJcblx0XHRiYXNlNjRFbmNvZGUoKXtcclxuXHRcdFx0cmV0dXJuIEJhc2U2NC5mcm9tQnl0ZUFycmF5KG5ldyBVaW50OEFycmF5KHRoaXMuc2VyaWFsaXplKCkpKVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdCAqIGNvbnZlbmllbmNlIG1ldGhvZCB0byBkZWNvZGUgYSBRdWV0emFsIGZpbGUgZnJvbSBCYXNlNjRcclxuXHRcdCAqL1xyXG5cdFx0c3RhdGljIGJhc2U2NERlY29kZShiYXNlNjQ6IHN0cmluZykgOiBRdWV0emFsIHtcclxuXHRcdFx0cmV0dXJuIFF1ZXR6YWwubG9hZChCYXNlNjQudG9CeXRlQXJyYXkoYmFzZTY0KSlcclxuXHRcdH1cclxuXHRcclxuXHR9XHJcblx0XHJcbn0iLCIvLyBXcml0dGVuIGZyb20gMjAxNSB0byAyMDE2IGJ5IFRoaWxvIFBsYW56IGFuZCBBbmRyZXcgUGxvdGtpblxyXG4vLyBUbyB0aGUgZXh0ZW50IHBvc3NpYmxlIHVuZGVyIGxhdywgSSBoYXZlIGRlZGljYXRlZCBhbGwgY29weXJpZ2h0IGFuZCByZWxhdGVkIGFuZCBuZWlnaGJvcmluZyByaWdodHMgXHJcbi8vIHRvIHRoaXMgc29mdHdhcmUgdG8gdGhlIHB1YmxpYyBkb21haW4gd29ybGR3aWRlLiBUaGlzIHNvZnR3YXJlIGlzIGRpc3RyaWJ1dGVkIHdpdGhvdXQgYW55IHdhcnJhbnR5LiBcclxuLy8gaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvcHVibGljZG9tYWluL3plcm8vMS4wL1xyXG5cclxuXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9J09wY29kZXMudHMnIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9J091dHB1dC50cycgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD0nVWx4SW1hZ2UudHMnIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9J1F1ZXR6YWwudHMnIC8+XHJcblxyXG5tb2R1bGUgRnlyZVZNIHtcclxuXHRcclxuXHRleHBvcnQgY29uc3QgZW51bSBWZXJzaW9ucyB7XHJcblx0XHR0ZXJwID0gMSxcclxuXHRcdGdsdWx4ID0gMHgwMDAzMDEwMlxyXG5cdH1cclxuXHRcclxuXHQvKipcclxuXHQgKiBEZXNjcmliZXMgdGhlIHR5cGUgb2YgR2xrIHN1cHBvcnQgb2ZmZXJlZCBieSB0aGUgaW50ZXJwcmV0ZXIuXHJcblx0ICovXHJcblx0ZXhwb3J0IGNvbnN0IGVudW0gR2xrTW9kZSB7XHJcblx0XHQvLyBObyBHbGsgc3VwcG9ydC5cclxuXHRcdE5vbmUsXHJcblx0XHQvLyBBIG1pbmltYWwgR2xrIGltcGxlbWVudGF0aW9uLCB3aXRoIEkvTyBmdW5jdGlvbnMgbWFwcGVkIHRvIHRoZSBjaGFubmVsIHN5c3RlbS5cclxuICAgICAgICBXcmFwcGVyXHJcblx0fVxyXG5cdFxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIEEgZGVsZWdhdGUgdGhhdCBoYW5kbGVzIHRoZSBMaW5lV2FudGVkIGV2ZW50XHJcblx0ICovXHJcblx0IGV4cG9ydCBpbnRlcmZhY2UgTGluZVdhbnRlZEV2ZW50SGFuZGxlciB7XHJcblx0XHQgKGNhbGxiYWNrOiBMaW5lUmVhZHlDYWxsYmFjaykgOiB2b2lkXHJcblx0IH1cclxuXHRcclxuXHQgZXhwb3J0IGludGVyZmFjZSBMaW5lUmVhZHlDYWxsYmFjayB7XHJcblx0XHQgKGxpbmU6IHN0cmluZykgOiB2b2lkXHJcblx0IH1cclxuXHQgXHJcblx0IC8qKlxyXG5cdCAqIEEgZGVsZWdhdGUgdGhhdCBoYW5kbGVzIHRoZSBLZXlXYW50ZWQgZXZlbnRcclxuXHQgKlxyXG5cdCAqIEFsc28gdXNlcyBMaW5lUmVhZHlDYWxsYmFjay4gT25seSB0aGUgZmlyc3QgY2hhcmFjdGVyXHJcblx0ICogd2lsbCBiZSB1c2VkLlxyXG5cdCAqL1xyXG5cdCBleHBvcnQgaW50ZXJmYWNlIEtleVdhbnRlZEV2ZW50SGFuZGxlciB7XHJcblx0XHQgKGNhbGxiYWNrOiBMaW5lUmVhZHlDYWxsYmFjaykgOiB2b2lkXHJcblx0IH1cclxuXHRcclxuXHRcclxuXHQvKipcclxuXHQgKiBBIGRlbGVnYXRlIHRoYXQgaGFuZGxlcyB0aGUgT3V0cHV0UmVhZHkgZXZlbnRcclxuXHQgKi9cclxuXHRcclxuXHRleHBvcnQgaW50ZXJmYWNlIE91dHB1dFJlYWR5RXZlbnRIYW5kbGVye1xyXG5cdFx0KHBhY2thZ2U6IENoYW5uZWxEYXRhKSA6IHZvaWRcclxuXHR9XHJcblx0XHRcclxuXHQvLyBBIGRlbGVnYXRlIHRoYXQgcmVjZWl2ZXMgYSBRdWV0emFsIHdoZW4gdGhlIHVzZXJcclxuXHQvLyByZXF1ZXN0cyB0byBzYXZlIHRoZSBnYW1lXHJcblx0ZXhwb3J0IGludGVyZmFjZSBTYXZlR2FtZUV2ZW50SGFuZGxlciB7XHJcblx0XHQocXVldHphbDogUXVldHphbCwgY2FsbGJhY2s6IFNhdmVkR2FtZUNhbGxiYWNrKSA6IHZvaWRcclxuXHR9XHJcblx0ZXhwb3J0IGludGVyZmFjZSBTYXZlZEdhbWVDYWxsYmFjayB7XHJcblx0XHQoc3VjY2VzczogYm9vbGVhbik7XHJcblx0fVxyXG5cdFxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgTG9hZEdhbWVFdmVudEhhbmRsZXIge1xyXG5cdFx0KGNhbGxiYWNrOiBRdWV0emFsUmVhZHlDYWxsYmFjaykgOiB2b2lkXHJcblx0fVxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgUXVldHphbFJlYWR5Q2FsbGJhY2sge1xyXG5cdFx0KHF1ZXR6YWw6IFF1ZXR6YWwpO1xyXG5cdH1cclxuICAgIC8qKiBcclxuXHQgKiAgRGVzY3JpYmVzIHRoZSB0YXNrIHRoYXQgdGhlIGludGVycHJldGVyIGlzIGN1cnJlbnRseSBwZXJmb3JtaW5nLlxyXG4gICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBlbnVtIEV4ZWN1dGlvbk1vZGVcclxuICAgIHtcclxuICAgICAgICAvLy8gV2UgYXJlIHJ1bm5pbmcgZnVuY3Rpb24gY29kZS4gUEMgcG9pbnRzIHRvIHRoZSBuZXh0IGluc3RydWN0aW9uLlxyXG4gICAgICAgIENvZGUsXHJcbiAgICAgICAgLy8vIFdlIGFyZSBwcmludGluZyBhIG51bGwtdGVybWluYXRlZCBzdHJpbmcgKEUwKS4gUEMgcG9pbnRzIHRvIHRoZVxyXG4gICAgICAgIC8vLyBuZXh0IGNoYXJhY3Rlci5cclxuICAgICAgICBDU3RyaW5nLFxyXG4gICAgICAgIC8vLyBXZSBhcmUgcHJpbnRpbmcgYSBjb21wcmVzc2VkIHN0cmluZyAoRTEpLiBQQyBwb2ludHMgdG8gdGhlIG5leHRcclxuICAgICAgICAvLy8gY29tcHJlc3NlZCBieXRlLCBhbmQgcHJpbnRpbmdEaWdpdCBpcyB0aGUgYml0IHBvc2l0aW9uICgwLTcpLlxyXG4gICAgICAgIENvbXByZXNzZWRTdHJpbmcsXHJcbiAgICAgICAgLy8vIFdlIGFyZSBwcmludGluZyBhIFVuaWNvZGUgc3RyaW5nIChFMikuIFBDIHBvaW50cyB0byB0aGUgbmV4dFxyXG4gICAgICAgIC8vLyBjaGFyYWN0ZXIuXHJcbiAgICAgICAgVW5pY29kZVN0cmluZyxcclxuICAgICAgICAvLy8gV2UgYXJlIHByaW50aW5nIGEgZGVjaW1hbCBudW1iZXIuIFBDIGNvbnRhaW5zIHRoZSBudW1iZXIsIGFuZFxyXG4gICAgICAgIC8vLyBwcmludGluZ0RpZ2l0IGlzIHRoZSBuZXh0IGRpZ2l0LCBzdGFydGluZyBhdCAwIChmb3IgdGhlIGZpcnN0XHJcbiAgICAgICAgLy8vIGRpZ2l0IG9yIG1pbnVzIHNpZ24pLlxyXG4gICAgICAgIE51bWJlcixcclxuICAgICAgICAvLy8gV2UgYXJlIHJldHVybmluZyBjb250cm9sIHRvIDxzZWUgY3JlZj1cIkVuZ2luZS5OZXN0ZWRDYWxsXCIvPlxyXG4gICAgICAgIC8vLyBhZnRlciBlbmdpbmUgY29kZSBoYXMgY2FsbGVkIGEgR2x1bHggZnVuY3Rpb24uXHJcbiAgICAgICAgUmV0dXJuLFxyXG4gICAgfVxyXG5cdFxyXG5cdFxyXG5cdGV4cG9ydCBjb25zdCBlbnVtIExvYWRPcGVyYW5kVHlwZSB7XHJcblx0XHR6ZXJvID0gMCxcclxuXHRcdGJ5dGUgPSAxLFxyXG5cdFx0aW50MTYgPSAyLFxyXG5cdFx0aW50MzIgPSAzLFxyXG5cdFx0cHRyXzggPSA1LFxyXG5cdFx0cHRyXzE2ID0gNixcclxuXHRcdHB0cl8zMiA9IDcsXHJcblx0XHRzdGFjayA9IDgsXHJcblx0XHRsb2NhbF84ID0gOSxcclxuXHRcdGxvY2FsXzE2ID0gMTAsXHJcblx0XHRsb2NhbF8zMiA9IDExLFxyXG5cdFx0cmFtXzggPSAxMyxcclxuXHRcdHJhbV8xNiA9IDE0LFxyXG5cdFx0cmFtXzMyID0gMTVcclxuXHR9XHJcblx0XHJcblx0ZXhwb3J0IGNvbnN0IGVudW0gU3RvcmVPcGVyYW5kVHlwZSB7XHJcblx0XHRkaXNjYXJkID0gMCxcclxuXHRcdHB0cl84ID0gNSxcclxuXHRcdHB0cl8xNiA9IDYsXHJcblx0XHRwdHJfMzIgPSA3LFxyXG5cdFx0c3RhY2sgPSA4LFxyXG5cdFx0bG9jYWxfOCA9IDksXHJcblx0XHRsb2NhbF8xNiA9IDEwLFxyXG5cdFx0bG9jYWxfMzIgPSAxMSxcclxuXHRcdHJhbV84ID0gMTMsXHJcblx0XHRyYW1fMTYgPSAxNCxcclxuXHRcdHJhbV8zMiA9IDE1XHJcblx0fVxyXG5cdFxyXG5cdGV4cG9ydCBjb25zdCBlbnVtIENhbGxUeXBlIHtcclxuXHRcdHN0YWNrID0gMHhDMCxcclxuXHRcdGxvY2FsU3RvcmFnZSA9IDB4QzFcclxuXHR9XHJcblx0XHJcblx0Ly8gQ2FsbCBzdHViXHJcblx0ZXhwb3J0IGNvbnN0IGVudW0gR0xVTFhfU1RVQiB7XHJcblx0XHQvLyBEZXN0VHlwZSB2YWx1ZXMgZm9yIGZ1bmN0aW9uIGNhbGxzXHJcblx0XHRTVE9SRV9OVUxMID0gMCxcclxuXHRcdFNUT1JFX01FTSA9IDEsXHJcblx0XHRTVE9SRV9MT0NBTCA9IDIsXHJcblx0XHRTVE9SRV9TVEFDSyA9IDMsXHJcblx0XHQvLyBEZXN0VHlwZSB2YWx1ZXMgZm9yIHN0cmluZyBwcmludGluZ1xyXG5cdFx0UkVTVU1FX0hVRkZTVFIgPSAxMCxcclxuXHRcdFJFU1VNRV9GVU5DID0gMTEsXHJcblx0XHRSRVNVTUVfTlVNQkVSID0gMTIsXHJcblx0XHRSRVNVTUVfQ1NUUiA9IDEzLFxyXG5cdFx0UkVTVU1FX1VOSVNUUiA9IDE0XHJcblx0fVxyXG5cdFxyXG5cdGV4cG9ydCBjb25zdCBlbnVtIE9wY29kZVJ1bGUge1xyXG5cdFx0Ly8gTm8gc3BlY2lhbCB0cmVhdG1lbnRcclxuXHRcdE5vbmUsXHJcblx0XHQvLyBJbmRpcmVjdCBvcGVyYW5kcyB3b3JrIHdpdGggc2luZ2xlIGJ5dGVzXHJcblx0XHRJbmRpcmVjdDhCaXQsXHJcblx0XHQvLyBJbmRpcmVjdCBvcGVyYW5kcyB3b3JrIHdpdGggMTYtYml0IHdvcmRzXHJcblx0XHRJbmRpcmVjdDE2Qml0LFxyXG5cdFx0Ly8gSGFzIGFuIGFkZGl0aW9uYWwgb3BlcmFuZCB0aGF0IHJlc2VtYmxlcyBhIHN0b3JlLCBidXQgd2hpY2hcclxuICAgICAgICAvLyBpcyBub3QgYWN0dWFsbHkgcGFzc2VkIG91dCBieSB0aGUgb3Bjb2RlIGhhbmRsZXIuIEluc3RlYWQsIHRoZVxyXG4gICAgICAgIC8vIGhhbmRsZXIgcmVjZWl2ZXMgdHdvIHZhbHVlcywgRGVzdFR5cGUgYW5kIERlc3RBZGRyLCB3aGljaCBtYXlcclxuICAgICAgICAvLyBiZSB3cml0dGVuIGludG8gYSBjYWxsIHN0dWIgc28gdGhlIHJlc3VsdCBjYW4gYmUgc3RvcmVkIGxhdGVyLlxyXG5cdFx0RGVsYXllZFN0b3JlLFxyXG5cdFx0Ly8gU3BlY2lhbCBjYXNlIGZvciBvcF9jYXRjaC4gVGhpcyBvcGNvZGUgaGFzIGEgbG9hZCBvcGVyYW5kIFxyXG4gICAgICAgIC8vICh0aGUgYnJhbmNoIG9mZnNldCkgYW5kIGEgZGVsYXllZCBzdG9yZSwgYnV0IHRoZSBzdG9yZSBjb21lcyBmaXJzdC5cclxuICAgICAgICAvLyBhcmdzWzBdIGFuZCBbMV0gYXJlIHRoZSBkZWxheWVkIHN0b3JlLCBhbmQgYXJnc1syXSBpcyB0aGUgbG9hZC5cclxuXHRcdENhdGNoXHJcblx0fVxyXG5cdFx0XHJcblx0Y2xhc3MgQ2FsbFN0dWIge1xyXG5cdFx0ICAgIC8vLyBUaGUgdHlwZSBvZiBzdG9yYWdlIGxvY2F0aW9uIChmb3IgZnVuY3Rpb24gY2FsbHMpIG9yIHRoZVxyXG4gICAgICAgICAgICAvLy8gcHJldmlvdXMgdGFzayAoZm9yIHN0cmluZyBwcmludGluZykuXHJcbiAgICAgICAgICAgIGRlc3RUeXBlIDogbnVtYmVyXHJcbiAgICAgICAgICAgIC8vLyBUaGUgc3RvcmFnZSBhZGRyZXNzIChmb3IgZnVuY3Rpb24gY2FsbHMpIG9yIHRoZSBkaWdpdFxyXG4gICAgICAgICAgICAvLy8gYmVpbmcgZXhhbWluZWQgKGZvciBzdHJpbmcgcHJpbnRpbmcpLlxyXG4gICAgICAgICAgICBkZXN0QWRkciA6IG51bWJlclxyXG4gICAgICAgICAgICAvLy8gVGhlIGFkZHJlc3Mgb2YgdGhlIG9wY29kZSBvciBjaGFyYWN0ZXIgYXQgd2hpY2ggdG8gcmVzdW1lLlxyXG4gICAgICAgICAgICBQQyA6IG51bWJlclxyXG4gICAgICAgICAgICAvLy8gVGhlIHN0YWNrIGZyYW1lIGluIHdoaWNoIHRoZSBmdW5jdGlvbiBjYWxsIG9yIHN0cmluZyBwcmludGluZ1xyXG4gICAgICAgICAgICAvLy8gd2FzIHBlcmZvcm1lZC5cclxuICAgICAgICAgICAgZnJhbWVQdHIgOiBudW1iZXJcclxuXHR9XHJcblx0XHJcblx0Ly8gY29lcmNlIHVpbnQzMiBudW1iZXIgaW50byAgKHNpZ25lZCEpIGludDMyIHJhbmdlXHJcblx0ZnVuY3Rpb24gaW50MzIoeDogbnVtYmVyKSA6bnVtYmVye1xyXG5cdFx0aWYgKHggPj0gMHg4MDAwMDAwMCl7XHJcblx0XHRcdHggPSAtICgweEZGRkZGRkZGIC0geCArIDEpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHg7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGludDE2KHg6IG51bWJlcikgOm51bWJlcntcclxuXHRcdGlmICh4ID49IDB4ODAwMCl7XHJcblx0XHRcdHggPSAtICgweEZGRkYgLSB4ICsgMSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4geDtcclxuXHR9XHJcblx0ZnVuY3Rpb24gaW50OCh4OiBudW1iZXIpIDpudW1iZXJ7XHJcblx0XHRpZiAoeCA+PSAweDgwKXtcclxuXHRcdFx0eCA9IC0gKDB4RkYgLSB4ICsgMSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4geDtcclxuXHR9XHJcblx0ZnVuY3Rpb24gdWludDgoeDogbnVtYmVyKSA6bnVtYmVye1xyXG5cdFx0aWYgKHggPCAwKXtcclxuXHRcdFx0eCA9IDI1NSArIHggKyAxO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHggJSAyNTY7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIHRvQVNDSUkoeDpudW1iZXIpe1xyXG5cdFx0cmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoXHJcblx0XHRcdHggPj4gMjQsXHJcblx0XHRcdCh4ID4+IDE2KSAmIDB4RkYsXHJcblx0XHRcdCh4ID4+IDgpICYgMHhGRixcclxuXHRcdFx0eCAmIDB4RkYpO1xyXG5cdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHJcblx0ZXhwb3J0IGNsYXNzIEVuZ2luZXtcclxuXHRcdFxyXG5cdFx0aW1hZ2U6IFVseEltYWdlO1xyXG5cdFx0cHJpdmF0ZSBzdGFjazogTWVtb3J5QWNjZXNzO1xyXG5cdFx0cHJpdmF0ZSBkZWNvZGluZ1RhYmxlOiBudW1iZXI7XHJcblx0XHRwcml2YXRlIFNQOiBudW1iZXI7XHJcblx0XHRwcml2YXRlIEZQOiBudW1iZXI7XHJcblx0XHRwcml2YXRlIFBDOiBudW1iZXI7XHJcblx0XHRwcml2YXRlIGZyYW1lTGVuOiBudW1iZXI7XHJcblx0XHRwcml2YXRlIGxvY2Fsc1BvczogbnVtYmVyO1xyXG5cdFx0cHJpdmF0ZSBleGVjTW9kZTogRXhlY3V0aW9uTW9kZTtcclxuXHRcdHByaXZhdGUgb3Bjb2RlczogT3Bjb2RlW107XHJcblx0XHRwcml2YXRlIHJ1bm5pbmc6IGJvb2xlYW47XHJcblx0XHRwcml2YXRlIG91dHB1dFN5c3RlbTogSU9TeXN0ZW07XHJcblx0XHRwcml2YXRlIGZpbHRlckFkZHJlc3M6IG51bWJlcjtcclxuXHRcdHByaXZhdGUgb3V0cHV0QnVmZmVyID0gbmV3IE91dHB1dEJ1ZmZlcigpO1xyXG5cdFx0cHJpdmF0ZSBoZWFwOiBIZWFwQWxsb2NhdG9yO1xyXG5cdFx0Ly8gY291bnRlcnMgdG8gbWVhc3VyZSBwZXJmb3JtYW5jZVxyXG5cdFx0cHJpdmF0ZSBjeWNsZSA9IDA7XHRcclxuXHRcdHByaXZhdGUgc3RhcnRUaW1lID0gMDtcclxuXHRcdFxyXG5cdFx0cHJpdmF0ZSBwcmludGluZ0RpZ2l0ID0gMDsgLy8gYml0IG51bWJlciBmb3IgY29tcHJlc3NlZCBzdHJpbmdzLCBkaWdpdCBmb3IgbnVtYmVyc1xyXG4gICAgICAgIHByaXZhdGUgcHJvdGVjdGlvblN0YXJ0ID0gMDtcclxuXHRcdHByaXZhdGUgcHJvdGVjdGlvbkxlbmd0aCA9IDA7XHJcblx0XHRwcml2YXRlIHZlbmVlciA9IHt9XHJcblx0XHRcclxuXHRcdC8vIGlmIHR1cm5lZCBvZmYsIG5vIEZ5cmVWTSBmdW5jdGlvbnMgYXJlIG1hZGUgYXZhaWxhYmxlLCBqdXN0IHN0YW5kYXJkIEdsdWx4IHN0dWZmXHJcblx0XHRlbmFibGVGeXJlVk0gPSB0cnVlO1xyXG5cdFx0XHJcblx0XHRnbGtNb2RlIDogR2xrTW9kZSA9IEdsa01vZGUuTm9uZTtcclxuXHRcdFxyXG5cdFx0b3V0cHV0UmVhZHk6IE91dHB1dFJlYWR5RXZlbnRIYW5kbGVyO1xyXG5cdFx0bGluZVdhbnRlZDogTGluZVdhbnRlZEV2ZW50SGFuZGxlcjtcclxuXHRcdGtleVdhbnRlZDogS2V5V2FudGVkRXZlbnRIYW5kbGVyO1xyXG5cdFx0c2F2ZVJlcXVlc3RlZDogU2F2ZUdhbWVFdmVudEhhbmRsZXI7XHJcblx0XHRsb2FkUmVxdWVzdGVkOiBMb2FkR2FtZUV2ZW50SGFuZGxlcjtcclxuXHRcdFxyXG5cdFx0XHJcblx0XHRjb25zdHJ1Y3RvcihnYW1lRmlsZTogVWx4SW1hZ2Upe1xyXG5cdFx0XHRsZXQgbWFqb3IgPSBnYW1lRmlsZS5nZXRNYWpvclZlcnNpb24oKTtcclxuXHRcdFx0aWYgKG1ham9yIDwgMiB8fCBtYWpvciA+IDMpXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiR2FtZSB2ZXJzaW9uIGlzIG91dCBvZiB0aGUgc3VwcG9ydGVkIHJhbmdlXCIpO1xyXG5cdFx0XHRsZXQgbWlub3IgPSBnYW1lRmlsZS5nZXRNaW5vclZlcnNpb24oKTtcclxuXHRcdFx0aWYgKG1ham9yID09IDIgJiYgbWlub3IgPCAwKVxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkdhbWUgdmVyc2lvbiBpcyBvdXQgb2YgdGhlIHN1cHBvcnRlZCByYW5nZVwiKTtcclxuXHRcdFx0aWYgKG1ham9yID09IDMgJiYgbWlub3IgPiAxKVxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkdhbWUgdmVyc2lvbiBpcyBvdXQgb2YgdGhlIHN1cHBvcnRlZCByYW5nZVwiKTtcclxuXHRcdFx0dGhpcy5pbWFnZSA9IGdhbWVGaWxlO1xyXG5cdFx0XHR0aGlzLnN0YWNrID0gbmV3IE1lbW9yeUFjY2VzcyhnYW1lRmlsZS5nZXRTdGFja1NpemUoKSAqIDQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdCAqIGNsZWFycyB0aGUgc3RhY2sgYW5kIGluaXRpYWxpemVzIFZNIHJlZ2lzdGVyc1xyXG5cdFx0ICogZnJvbSB2YWx1ZXMgZm91bmQgaW4gUkFNXHJcblx0XHQgKi9cclxuXHRcdCBib290c3RyYXAoKXtcclxuXHRcdFx0IHRoaXMub3Bjb2RlcyA9IE9wY29kZXMuaW5pdE9wY29kZXMoKTtcclxuXHRcdFx0IGxldCBtYWluZnVuYyA9IHRoaXMuaW1hZ2UuZ2V0U3RhcnRGdW5jKCk7XHJcblx0XHRcdCB0aGlzLmRlY29kaW5nVGFibGUgPSB0aGlzLmltYWdlLmdldERlY29kaW5nVGFibGUoKTtcclxuXHRcdFx0IHRoaXMuU1AgPSB0aGlzLkZQID0gdGhpcy5mcmFtZUxlbiA9IHRoaXMubG9jYWxzUG9zID0gMDtcclxuXHRcdFx0IHRoaXMub3V0cHV0U3lzdGVtID0gSU9TeXN0ZW0uTnVsbDtcclxuXHRcdFx0IHRoaXMuZW50ZXJGdW5jdGlvbihtYWluZnVuYyk7XHJcblx0XHRcdCBcclxuXHRcdCB9XHJcblx0XHQgXHJcblx0XHQgLyoqXHJcblx0XHQgICogIFB1c2hlcyBhIGZyYW1lIGZvciBhIGZ1bmN0aW9uIGNhbGwsIHVwZGF0aW5nIEZQLCBTUCwgYW5kIFBDLlxyXG4gICAgICAgXHQgICogIChBIGNhbGwgc3R1YiBzaG91bGQgaGF2ZSBhbHJlYWR5IGJlZW4gcHVzaGVkLilcclxuXHRcdCAgKi9cclxuXHRcdCBwcml2YXRlIGVudGVyRnVuY3Rpb24oYWRkcmVzczogbnVtYmVyLCAuLi5hcmdzOiBudW1iZXJbXSl7XHJcblx0XHRcdCBsZXQge2ltYWdlLCBzdGFja30gPSB0aGlzO1xyXG5cdFx0XHQgdGhpcy5leGVjTW9kZSA9IEV4ZWN1dGlvbk1vZGUuQ29kZTtcclxuXHRcdFx0IC8vIHB1c2ggYSBjYWxsIGZyYW1lXHJcblx0XHRcdCB0aGlzLkZQID0gdGhpcy5TUDtcclxuXHRcdFx0IHRoaXMucHVzaCgwKTsgLy8gdGVtcG9yYXJ5IEZyYW1lTGVuXHJcblx0XHRcdCB0aGlzLnB1c2goMCk7IC8vIHRlbXBvcmFyeSBMb2NhbHNQb3NcclxuXHRcdFx0IFxyXG5cdFx0XHQgLy8gY29weSBsb2NhbHMgaW5mbyBpbnRvIHRoZSBmcmFtZVxyXG5cdFx0XHQgbGV0IGxvY2FsU2l6ZSA9IDA7XHJcblx0XHRcdCBmb3IobGV0IGk9IGFkZHJlc3MrMTsgdHJ1ZTsgaSs9Mil7XHJcblx0XHRcdFx0IGxldCB0eXBlID0gaW1hZ2UucmVhZEJ5dGUoaSk7XHJcblx0XHRcdFx0IGxldCBjb3VudCA9IGltYWdlLnJlYWRCeXRlKGkrMSk7XHJcblx0XHRcdFx0IHRoaXMucHVzaEJ5dGUodHlwZSk7XHJcblx0XHRcdFx0IHRoaXMucHVzaEJ5dGUoY291bnQpO1xyXG5cdFx0XHRcdCBpZiAodHlwZSA9PT0gMCB8fCBjb3VudCA9PT0gMCl7XHJcblx0XHRcdFx0XHQgdGhpcy5QQyA9IGkgKyAyO1xyXG5cdFx0XHRcdFx0IGJyZWFrO1xyXG5cdFx0XHRcdCB9XHJcblx0XHRcdFx0IGlmIChsb2NhbFNpemUgJSB0eXBlID4gMCl7XHJcblx0XHRcdFx0XHQgbG9jYWxTaXplICs9ICh0eXBlIC0gKGxvY2FsU2l6ZSAlIHR5cGUpKTtcclxuXHRcdFx0XHQgfVxyXG5cdFx0XHRcdCBsb2NhbFNpemUgKz0gdHlwZSAqIGNvdW50O1xyXG5cdFx0XHQgfVxyXG5cdFx0XHQgLy8gcGFkZGluZ1xyXG5cdFx0XHQgd2hpbGUodGhpcy5TUCAlNCA+IDApe1xyXG5cdFx0XHRcdCB0aGlzLnB1c2hCeXRlKDApO1xyXG5cdFx0XHQgfVxyXG5cdFx0XHRcclxuXHRcdFx0IGxldCBzcCA9IHRoaXMuU1A7XHJcblx0XHRcdCBsZXQgZnAgPSB0aGlzLkZQO1xyXG5cdFx0XHQgdGhpcy5sb2NhbHNQb3MgPSBzcCAtIGZwO1xyXG5cdFx0XHQgLy8gZmlsbCBpbiBsb2NhbHNQb3NcclxuXHRcdFx0IHN0YWNrLndyaXRlSW50MzIoZnAgKyA0LCB0aGlzLmxvY2Fsc1Bvcyk7XHJcblx0XHRcdCBcclxuXHRcdFx0IGxldCBsYXN0T2Zmc2V0ID0gMDtcclxuXHRcdFx0XHRcclxuXHRcdFx0IGlmIChhcmdzICYmIGFyZ3MubGVuZ3RoKXtcclxuXHRcdFx0XHQgLy8gY29weSBpbml0aWFsIHZhbHVlcyBhcyBhcHByb3ByaWF0ZVxyXG5cdFx0XHRcdCBsZXQgb2Zmc2V0ID0gMDtcclxuXHRcdFx0XHQgbGV0IHNpemUgPSAwO1xyXG5cdFx0XHRcdCBsZXQgY291bnQgPSAwO1xyXG5cdFx0XHRcdCBhZGRyZXNzKys7XHJcblx0XHRcdFx0IGZvcihsZXQgYXJnbnVtPTA7IGFyZ251bTxhcmdzLmxlbmd0aDsgYXJnbnVtKyspe1xyXG5cdFx0XHRcdFx0IGlmIChjb3VudCA9PT0gMCl7XHJcblx0XHRcdFx0XHRcdCBzaXplID0gaW1hZ2UucmVhZEJ5dGUoYWRkcmVzcysrKTtcclxuXHRcdFx0XHRcdFx0IGNvdW50ID0gaW1hZ2UucmVhZEJ5dGUoYWRkcmVzcysrKTtcclxuXHRcdFx0XHRcdFx0IGlmIChzaXplID09PSAwIHx8IGNvdW50ID09PSAwKSBicmVhaztcclxuXHRcdFx0XHRcdFx0IGlmIChvZmZzZXQgJSBzaXplID4gMCl7XHJcblx0XHRcdFx0XHRcdFx0IG9mZnNldCArPSAoc2l6ZSAtIChvZmZzZXQgJSBzaXplKSk7XHJcblx0XHRcdFx0XHRcdCB9XHJcblx0XHRcdFx0XHQgfVxyXG5cdFx0XHRcdFx0IC8vIHplcm8gYW55IHBhZGRpbmcgc3BhY2UgYmV0d2VlbiBsb2NhbHNcclxuXHRcdFx0XHRcdCBmb3IgKGxldCBpPWxhc3RPZmZzZXQ7IGk8b2Zmc2V0OyBpKyspe1xyXG5cdFx0XHRcdFx0XHQgc3RhY2sud3JpdGVCeXRlKHNwK2ksIDApO1xyXG5cdFx0XHRcdFx0IH1cclxuXHRcdFx0XHRcdCBcclxuXHRcdFx0XHRcdCBzd2l0Y2goc2l6ZSl7XHJcblx0XHRcdFx0XHRcdCBjYXNlIDE6XHJcblx0XHRcdFx0XHRcdCBcdHN0YWNrLndyaXRlQnl0ZShzcCtvZmZzZXQsIGFyZ3NbYXJnbnVtXSk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdCBjYXNlIDI6XHJcblx0XHRcdFx0XHRcdCBcdHN0YWNrLndyaXRlSW50MTYoc3Arb2Zmc2V0LCBhcmdzW2FyZ251bV0pO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHQgY2FzZSA0OlxyXG5cdFx0XHRcdFx0XHQgICAgc3RhY2sud3JpdGVJbnQzMihzcCtvZmZzZXQsIGFyZ3NbYXJnbnVtXSk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdCBkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHQgICAgdGhyb3cgbmV3IEVycm9yKGBJbGxlZ2FsIGNhbGwgcGFyYW0gc2l6ZSAke3NpemV9IGF0IHBvc2l0aW9uICR7YXJnbnVtfWApO1xyXG5cdFx0XHRcdFx0IH1cclxuXHRcdFx0XHRcdCBvZmZzZXQgKz0gc2l6ZTtcclxuXHRcdFx0XHRcdCBsYXN0T2Zmc2V0ID0gb2Zmc2V0O1xyXG5cdFx0XHRcdFx0IGNvdW50LS07XHJcblx0XHRcdFx0IH1cclxuXHRcdFx0XHQgXHJcblx0XHRcdFx0IFxyXG5cdFx0XHQgfVxyXG5cdFx0ICAgICAvLyB6ZXJvIGFueSByZW1haW5pbmcgbG9jYWwgc3BhY2VcclxuXHRcdFx0IGZvcihsZXQgaT1sYXN0T2Zmc2V0OyBpPGxvY2FsU2l6ZTsgaSsrKXtcclxuXHRcdFx0XHRcdHN0YWNrLndyaXRlQnl0ZShzcCtpLCAwKTtcclxuXHRcdFx0IH1cclxuXHRcdFx0IFxyXG5cdFx0XHQgc3AgKz0gbG9jYWxTaXplO1xyXG5cdFx0XHQgLy8gcGFkZGluZ1xyXG5cdFx0XHQgd2hpbGUoc3AlNCA+IDApe1xyXG5cdFx0XHRcdCBzdGFjay53cml0ZUJ5dGUoc3ArKywgMCk7XHJcblx0XHRcdCB9XHJcblx0XHRcdCB0aGlzLmZyYW1lTGVuID0gc3AgLSBmcDtcclxuXHRcdFx0IHN0YWNrLndyaXRlSW50MzIoZnAsIHNwIC0gZnApO1xyXG5cdFx0XHQgdGhpcy5TUCA9IHNwO1xyXG5cdFx0IH1cclxuXHRcdCBcclxuXHRcdCBwcml2YXRlIHB1c2godmFsdWU6IG51bWJlcil7XHJcblx0XHRcdCB0aGlzLnN0YWNrLndyaXRlSW50MzIodGhpcy5TUCwgdmFsdWUpO1xyXG5cdFx0XHQgdGhpcy5TUCArPSA0O1xyXG5cdFx0IH1cclxuXHRcdCBcclxuXHRcdCBwcml2YXRlIHBvcCgpOiBudW1iZXIge1xyXG5cdFx0XHQgdGhpcy5TUCAtPSA0O1xyXG5cdFx0XHQgcmV0dXJuIHRoaXMuc3RhY2sucmVhZEludDMyKHRoaXMuU1ApO1xyXG5cdFx0IH1cclxuXHRcdCBcclxuXHRcdCBwcml2YXRlIHB1c2hCeXRlKHZhbHVlOiBudW1iZXIpe1xyXG5cdFx0XHQgdGhpcy5zdGFjay53cml0ZUJ5dGUodGhpcy5TUCsrLCB2YWx1ZSk7XHJcblx0XHQgfVxyXG5cdFx0IFxyXG5cdFx0IHByaXZhdGUgcHVzaENhbGxTdHViKGRlc3RUeXBlOiBudW1iZXIsIGRlc3RBZGRyOiBudW1iZXIsIFBDOiBudW1iZXIsIGZyYW1lUHRyOiBudW1iZXIpe1xyXG5cdFx0XHQgdGhpcy5wdXNoKGRlc3RUeXBlKTtcclxuXHRcdFx0IHRoaXMucHVzaChkZXN0QWRkcik7XHJcblx0XHRcdCB0aGlzLnB1c2goUEMpO1xyXG5cdFx0XHQgdGhpcy5wdXNoKGZyYW1lUHRyKTtcclxuXHRcdCB9XHJcblx0XHQgXHJcblx0XHQgcHJpdmF0ZSBwb3BDYWxsU3R1YigpOiBDYWxsU3R1YntcclxuXHRcdFx0IGxldCBzdHViID0gbmV3IENhbGxTdHViKCk7XHJcblx0XHRcdCBzdHViLmZyYW1lUHRyID0gdGhpcy5wb3AoKTtcclxuXHRcdFx0IHN0dWIuUEMgPSB0aGlzLnBvcCgpO1xyXG5cdFx0XHQgc3R1Yi5kZXN0QWRkciA9IHRoaXMucG9wKCk7XHJcblx0XHRcdCBzdHViLmRlc3RUeXBlID0gdGhpcy5wb3AoKTtcclxuXHRcdFx0IHJldHVybiBzdHViO1xyXG5cdFx0IH1cclxuXHRcdCBcclxuXHRcdCBcclxuXHRcdCAvKipcclxuXHRcdCAgKiBleGVjdXRlcyBhIHNpbmdsZSBjeWNsZVxyXG5cdFx0ICAqL1xyXG5cdFx0ICBzdGVwKCl7XHJcblx0XHRcdCAgbGV0IHtpbWFnZX0gPSB0aGlzO1xyXG5cdFx0XHQgIHRoaXMuY3ljbGUrKztcclxuXHRcdFx0ICBzd2l0Y2godGhpcy5leGVjTW9kZSl7XHJcblx0XHRcdFx0ICBjYXNlIEV4ZWN1dGlvbk1vZGUuQ29kZTpcclxuXHRcdFx0XHQgIFx0Ly8gZGVjb2RlIG9wY29kZSBudW1iZXJcclxuXHRcdFx0XHRcdGxldCBvcG51bSA9IGltYWdlLnJlYWRCeXRlKHRoaXMuUEMpO1xyXG5cdFx0XHRcdFx0aWYgKG9wbnVtID49IDB4QzApe1xyXG5cdFx0XHRcdFx0XHRvcG51bSA9IGltYWdlLnJlYWRJbnQzMih0aGlzLlBDKSAtIDB4QzAwMDAwMDA7XHJcblx0XHRcdFx0XHRcdHRoaXMuUEMgKz0gNDtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAob3BudW0gPj0gMHg4MCl7XHJcblx0XHRcdFx0XHRcdG9wbnVtID0gaW1hZ2UucmVhZEludDE2KHRoaXMuUEMpIC0gMHg4MDAwO1xyXG5cdFx0XHRcdFx0XHR0aGlzLlBDICs9IDI7XHJcblx0XHRcdFx0XHR9IGVsc2V7XHJcblx0XHRcdFx0XHRcdHRoaXMuUEMrKztcclxuXHRcdFx0XHRcdH0gXHJcblx0XHRcdFx0XHQvLyBsb29rIHVwIG9wY29kZSBpbmZvXHJcblx0XHRcdFx0XHRsZXQgb3Bjb2RlID0gdGhpcy5vcGNvZGVzW29wbnVtXTtcclxuXHRcdFx0XHRcdGlmICghb3Bjb2RlKXtcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnJlY29nbml6ZWQgb3Bjb2RlICR7b3BudW19YCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vIGRlY29kZSBsb2FkLW9wZXJhbmRzXHJcblx0XHRcdFx0XHRsZXQgb3Bjb3VudCA9IG9wY29kZS5sb2FkQXJncyArIG9wY29kZS5zdG9yZUFyZ3M7XHJcblx0XHRcdFx0XHRsZXQgb3BlcmFuZHMgPSBbXTtcclxuXHRcdFx0XHRcdGlmIChvcGNvZGUucnVsZSA9PT0gT3Bjb2RlUnVsZS5EZWxheWVkU3RvcmUpXHJcblx0XHRcdFx0XHRcdG9wY291bnQrKztcclxuXHRcdFx0XHRcdGVsc2UgaWYgKG9wY29kZS5ydWxlID09PSBPcGNvZGVSdWxlLkNhdGNoKVxyXG5cdFx0XHRcdFx0XHRvcGNvdW50Kz0gMjtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0bGV0IG9wZXJhbmRQb3MgPSBNYXRoLmZsb29yKCB0aGlzLlBDICsgKG9wY291bnQrMSkgLyAyKTtcclxuXHRcdFx0XHRcdGZvciAobGV0IGk9MDsgaTxvcGNvZGUubG9hZEFyZ3M7IGkrKyl7XHJcblx0XHRcdFx0XHRcdGxldCB0eXBlO1xyXG5cdFx0XHRcdFx0XHRpZiAoaSUyID09PSAwKXtcclxuXHRcdFx0XHRcdFx0XHR0eXBlID0gaW1hZ2UucmVhZEJ5dGUodGhpcy5QQykgJiAweEY7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdHR5cGUgPSAoaW1hZ2UucmVhZEJ5dGUodGhpcy5QQysrKSA+PiA0KSAmIDB4RjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRvcGVyYW5kUG9zICs9IHRoaXMuZGVjb2RlTG9hZE9wZXJhbmQob3Bjb2RlLCB0eXBlLCBvcGVyYW5kcywgb3BlcmFuZFBvcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vIGRlY29kZSBzdG9yZS1vcGVyYW5kc1xyXG5cdFx0XHRcdFx0bGV0IHN0b3JlUG9zID0gdGhpcy5QQztcclxuXHRcdFx0XHRcdGxldCByZXN1bHRUeXBlcyA9IFtdO1xyXG5cdFx0XHRcdFx0bGV0IHJlc3VsdEFkZHJzID0gW107XHJcblx0XHRcdFx0XHRmb3IobGV0IGk9MDsgaTxvcGNvZGUuc3RvcmVBcmdzOyBpKyspe1xyXG5cdFx0XHRcdFx0XHRsZXQgdHlwZSA9IGkgKyBvcGNvZGUubG9hZEFyZ3M7XHJcblx0XHRcdFx0XHRcdGlmICh0eXBlJTIgPT09IDApe1xyXG5cdFx0XHRcdFx0XHRcdHR5cGUgPSBpbWFnZS5yZWFkQnl0ZSh0aGlzLlBDKSAmIDB4RjtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0dHlwZSA9IChpbWFnZS5yZWFkQnl0ZSh0aGlzLlBDKyspID4+IDQpICYgMHhGO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHJlc3VsdFR5cGVzW2ldID0gdHlwZTtcclxuXHRcdFx0XHRcdFx0b3BlcmFuZFBvcyArPSB0aGlzLmRlY29kZVN0b3JlT3BlcmFuZChvcGNvZGUsIHR5cGUsIHJlc3VsdEFkZHJzLCBvcGVyYW5kUG9zKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHJcblx0XHRcdFx0XHRpZihvcGNvZGUucnVsZSA9PT0gT3Bjb2RlUnVsZS5EZWxheWVkU3RvcmUgfHwgb3Bjb2RlLnJ1bGUgPT09IE9wY29kZVJ1bGUuQ2F0Y2gpe1xyXG5cdFx0XHRcdFx0XHRsZXQgdHlwZSA9IG9wY29kZS5sb2FkQXJncyArIG9wY29kZS5zdG9yZUFyZ3M7XHJcblx0XHRcdFx0XHRcdGlmICh0eXBlJTIgPT09IDApe1xyXG5cdFx0XHRcdFx0XHRcdHR5cGUgPSBpbWFnZS5yZWFkQnl0ZSh0aGlzLlBDKSAmIDB4RjtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0dHlwZSA9IChpbWFnZS5yZWFkQnl0ZSh0aGlzLlBDKyspID4+IDQpICYgMHhGO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG9wZXJhbmRQb3MgKz0gdGhpcy5kZWNvZGVEZWxheWVkU3RvcmVPcGVyYW5kKG9wY29kZSwgdHlwZSwgb3BlcmFuZHMsIG9wZXJhbmRQb3MpO1x0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKG9wY29kZS5ydWxlID09PSBPcGNvZGVSdWxlLkNhdGNoKXtcclxuXHRcdFx0XHRcdFx0Ly8gZGVjb2RlIGZpbmFsIGxvYWQgb3BlcmFuZCBmb3IgQGNhdGNoXHJcblx0XHRcdFx0XHRcdGxldCB0eXBlID0gb3Bjb2RlLmxvYWRBcmdzICsgb3Bjb2RlLnN0b3JlQXJncyArIDE7XHJcblx0XHRcdFx0XHRcdGlmICh0eXBlJTIgPT09IDApe1xyXG5cdFx0XHRcdFx0XHRcdHR5cGUgPSBpbWFnZS5yZWFkQnl0ZSh0aGlzLlBDKSAmIDB4RjtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0dHlwZSA9IChpbWFnZS5yZWFkQnl0ZSh0aGlzLlBDKyspID4+IDQpICYgMHhGO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG9wZXJhbmRQb3MgKz0gdGhpcy5kZWNvZGVMb2FkT3BlcmFuZChvcGNvZGUsIHR5cGUsIG9wZXJhbmRzLCBvcGVyYW5kUG9zKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblxyXG4vL1x0XHRcdFx0XHRjb25zb2xlLmluZm8ob3Bjb2RlLm5hbWUsIG9wZXJhbmRzLCB0aGlzLlBDLCBvcGVyYW5kUG9zKTtcclxuXHJcblx0XHJcblx0XHRcdFx0XHQvLyBjYWxsIG9wY29kZSBpbXBsZW1lbnRhdGlvblxyXG5cdFx0XHRcdFx0dGhpcy5QQyA9IG9wZXJhbmRQb3M7IC8vIGFmdGVyIHRoZSBsYXN0IG9wZXJhbmNcdFx0XHRcdFxyXG5cdFx0XHRcdFx0bGV0IHJlc3VsdCA9IG9wY29kZS5oYW5kbGVyLmFwcGx5KHRoaXMsIG9wZXJhbmRzKTtcclxuXHRcdFx0XHRcdGlmIChyZXN1bHRUeXBlcy5sZW5ndGggPT09IDEgfHwgcmVzdWx0ID09PSAnd2FpdCcpe1xyXG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBbIHJlc3VsdCBdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQvLyBzdG9yZSByZXN1bHRzXHJcblx0XHRcdFx0XHRpZiAocmVzdWx0KXtcclxuXHRcdFx0XHRcdFx0Ly8gZm9yIGFzeW5jaHJvbm91cyBpbnB1dCwgd2UgbmVlZCB0byBzdG9wIHJpZ2h0IG5vd1xyXG5cdFx0XHRcdFx0XHQvLyB1bnRpbCB3ZSBhcmUgYXNrZWQgdG8gcmVzdW1lXHJcblx0XHRcdFx0XHRcdGlmICgnd2FpdCcgPT09IHJlc3VsdFswXSl7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5yZXN1bWVBZnRlcldhaXRfcmVzdWx0VHlwZXMgPSByZXN1bHRUeXBlcztcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnJlc3VtZUFmdGVyV2FpdF9yZXN1bHRBZGRycyA9IHJlc3VsdEFkZHJzO1xyXG5cdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiAnd2FpdCc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHR0aGlzLnN0b3JlUmVzdWx0cyhvcGNvZGUucnVsZSwgcmVzdWx0VHlwZXMsIHJlc3VsdEFkZHJzLCByZXN1bHQgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdCAgXHRicmVhaztcclxuXHRcdFx0XHQgIGNhc2UgRXhlY3V0aW9uTW9kZS5Db21wcmVzc2VkU3RyaW5nOlxyXG5cdFx0XHRcdCAgXHQvLyBUT0RPOiBuYXRpdmUgZGVjb2RpbmcgdGFibGVcclxuXHRcdFx0XHRcdE5leHRDb21wcmVzc2VkQ2hhci5jYWxsKHRoaXMpO1xyXG5cdFx0XHRcdFx0YnJlYWs7IFxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0ICBjYXNlIEV4ZWN1dGlvbk1vZGUuQ1N0cmluZzpcclxuXHRcdFx0XHQgIFx0TmV4dENTdHJpbmdDaGFyLmNhbGwodGhpcyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdCAgY2FzZSBFeGVjdXRpb25Nb2RlLlVuaWNvZGVTdHJpbmc6XHJcblx0XHRcdFx0ICBcdE5leHRVbmlTdHJpbmdDaGFyLmNhbGwodGhpcyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdCAgY2FzZSBFeGVjdXRpb25Nb2RlLk51bWJlcjpcclxuXHRcdFx0XHQgIFx0TmV4dERpZ2l0LmNhbGwodGhpcyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0ICBcclxuXHRcdFx0XHQgIGRlZmF1bHQ6XHJcblx0XHRcdFx0ICBcdHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgZXhlY3V0aW9uIG1vZGUgJHt0aGlzLmV4ZWNNb2RlfWApO1xyXG5cdFx0XHQgIH1cclxuXHRcdCAgfVxyXG5cdFx0ICBcclxuXHRcdCAgLyoqXHJcblx0XHQgICAqIFN0YXJ0cyB0aGUgaW50ZXJwcmV0ZXIuXHJcblx0XHQgICAqIFRoaXMgbWV0aG9kIGRvZXMgbm90IHJldHVybiB1bnRpbCB0aGUgZ2FtZSBmaW5pc2hlcywgZWl0aGVyIGJ5XHJcbiAgICAgICAgICAgKiByZXR1cm5pbmcgZnJvbSB0aGUgbWFpbiBmdW5jdGlvbiBvciB3aXRoIHRoZSBxdWl0IG9wY29kZVxyXG5cdFx0ICAgKiAodW5sZXNzIGl0IGlzIHBsYWNlZCBpbnRvIFwid2FpdGluZ1wiIG1vZGUgZm9yIGFzeW5jaHJvbm91c1xyXG5cdFx0ICAgKiB1c2VyIGlucHV0LiBJbiB0aGlzIGNhc2UsIHRoZXJlIHdpbGwgYmUgYSBjYWxsYmFjayB0aGF0IHJlc3VtZXNcclxuXHRcdCAgICogZXhlY3V0aW9uKVxyXG5cdFx0ICAgKi9cclxuXHRcdCAgcnVuKCl7XHJcblx0XHRcdCAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0ICB0aGlzLmJvb3RzdHJhcCgpO1xyXG5cdFx0XHQgIHRoaXMucmVzdW1lQWZ0ZXJXYWl0KCk7XHJcblx0XHQgIH1cclxuXHRcdCAgXHJcblx0XHQgIFxyXG5cdFx0ICAvKipcclxuXHRcdCAgICogQHJldHVybiBob3cgbWFueSBleHRyYSBieXRlcyB3ZXJlIHJlYWQgKHNvIHRoYXQgb3BlcmFuZFBvcyBjYW4gYmUgYWR2YW5jZWQpXHJcblx0XHQgICAqL1xyXG5cdFx0ICBwcml2YXRlIGRlY29kZUxvYWRPcGVyYW5kKG9wY29kZTogT3Bjb2RlLCB0eXBlOm51bWJlciwgb3BlcmFuZHM6IG51bWJlcltdLCBvcGVyYW5kUG9zOiBudW1iZXIpe1xyXG5cdFx0XHQgIGxldCB7aW1hZ2UsIHN0YWNrLCBGUCwgbG9jYWxzUG9zLCBmcmFtZUxlbn0gPSB0aGlzO1xyXG5cdFx0XHQgIGZ1bmN0aW9uIGxvYWRMb2NhbChhZGRyZXNzOiBudW1iZXIpe1xyXG5cdFx0XHRcdFx0YWRkcmVzcyArPSBGUCArIGxvY2Fsc1BvcztcclxuXHRcdFx0XHRcdGxldCBtYXhBZGRyZXNzID0gRlAgKyBmcmFtZUxlbjtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0IHN3aXRjaChvcGNvZGUucnVsZSl7XHJcblx0XHRcdFx0XHRcdGNhc2UgT3Bjb2RlUnVsZS5JbmRpcmVjdDhCaXQ6IFxyXG5cdFx0XHRcdFx0XHRcdGlmIChhZGRyZXNzID4gbWF4QWRkcmVzcylcclxuXHRcdFx0XHRcdFx0XHQgICAgdGhyb3cgbmV3IEVycm9yKFwiUmVhZGluZyBvdXRzaWRlIGxvY2FsIHN0b3JhZ2UgYm91bmRzXCIpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBzdGFjay5yZWFkQnl0ZShhZGRyZXNzKTtcclxuXHRcdFx0XHRcdFx0Y2FzZSBPcGNvZGVSdWxlLkluZGlyZWN0MTZCaXQ6IFxyXG5cdFx0XHRcdFx0XHRcdGlmIChhZGRyZXNzKzEgPiBtYXhBZGRyZXNzKVxyXG5cdFx0XHRcdFx0XHRcdCAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZWFkaW5nIG91dHNpZGUgbG9jYWwgc3RvcmFnZSBib3VuZHNcIik7XHJcblx0XHRcdFx0XHRcdCAgICByZXR1cm4gc3RhY2sucmVhZEludDE2KGFkZHJlc3MpO1xyXG5cdFx0XHRcdFx0XHRkZWZhdWx0OiBcclxuXHRcdFx0XHRcdFx0XHRpZiAoYWRkcmVzcyszID4gbWF4QWRkcmVzcylcclxuXHRcdFx0XHRcdFx0XHQgICAgdGhyb3cgbmV3IEVycm9yKFwiUmVhZGluZyBvdXRzaWRlIGxvY2FsIHN0b3JhZ2UgYm91bmRzXCIpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBzdGFjay5yZWFkSW50MzIoYWRkcmVzcyk7XHJcblx0XHRcdFx0XHR9IFxyXG5cdFx0XHQgIH1cclxuXHRcdFx0ICBcclxuXHRcdFx0ICBmdW5jdGlvbiBsb2FkSW5kaXJlY3QoYWRkcmVzczogbnVtYmVyKXtcclxuXHRcdFx0XHQgIFxyXG5cdFx0XHRcdFx0c3dpdGNoKG9wY29kZS5ydWxlKXtcclxuXHRcdFx0XHRcdFx0Y2FzZSBPcGNvZGVSdWxlLkluZGlyZWN0OEJpdDogcmV0dXJuIGltYWdlLnJlYWRCeXRlKGFkZHJlc3MpO1xyXG5cdFx0XHRcdFx0XHRjYXNlIE9wY29kZVJ1bGUuSW5kaXJlY3QxNkJpdDogcmV0dXJuIGltYWdlLnJlYWRJbnQxNihhZGRyZXNzKTtcclxuXHRcdFx0XHRcdFx0ZGVmYXVsdDogcmV0dXJuIGltYWdlLnJlYWRJbnQzMihhZGRyZXNzKTtcclxuXHRcdFx0XHRcdH1cdFx0ICBcclxuXHRcdFx0ICB9XHJcblxyXG5cdFx0XHQgIHN3aXRjaCh0eXBlKXtcclxuXHRcdFx0XHQgIC8vIGltbWVkaWF0ZXNcclxuXHRcdFx0XHQgIGNhc2UgTG9hZE9wZXJhbmRUeXBlLnplcm86IG9wZXJhbmRzLnB1c2goMCk7IHJldHVybiAwO1xyXG5cdFx0XHRcdCAgY2FzZSBMb2FkT3BlcmFuZFR5cGUuYnl0ZTogb3BlcmFuZHMucHVzaChpbnQ4KGltYWdlLnJlYWRCeXRlKG9wZXJhbmRQb3MpKSk7IHJldHVybiAxO1xyXG5cdFx0XHRcdCAgY2FzZSBMb2FkT3BlcmFuZFR5cGUuaW50MTY6IG9wZXJhbmRzLnB1c2goaW50MTYoaW1hZ2UucmVhZEludDE2KG9wZXJhbmRQb3MpKSk7IHJldHVybiAyO1xyXG5cdFx0XHRcdCAgY2FzZSBMb2FkT3BlcmFuZFR5cGUuaW50MzI6IG9wZXJhbmRzLnB1c2goaW50MzIoaW1hZ2UucmVhZEludDMyKG9wZXJhbmRQb3MpKSk7IHJldHVybiA0O1xyXG5cdFx0XHRcdCAgLy8gaW5kaXJlY3RcclxuXHRcdFx0XHQgIGNhc2UgTG9hZE9wZXJhbmRUeXBlLnB0cl84OiBvcGVyYW5kcy5wdXNoKGxvYWRJbmRpcmVjdChpbWFnZS5yZWFkQnl0ZShvcGVyYW5kUG9zKSkpOyByZXR1cm4gMTtcclxuXHRcdFx0XHQgIGNhc2UgTG9hZE9wZXJhbmRUeXBlLnB0cl8xNjogb3BlcmFuZHMucHVzaChsb2FkSW5kaXJlY3QoaW1hZ2UucmVhZEludDE2KG9wZXJhbmRQb3MpKSk7IHJldHVybiAyO1xyXG5cdFx0XHRcdCAgY2FzZSBMb2FkT3BlcmFuZFR5cGUucHRyXzMyOiBvcGVyYW5kcy5wdXNoKGxvYWRJbmRpcmVjdChpbWFnZS5yZWFkSW50MzIob3BlcmFuZFBvcykpKTsgcmV0dXJuIDQ7XHJcblx0XHRcdFx0ICAvLyBzdGFja1xyXG5cdFx0XHRcdCAgY2FzZSBMb2FkT3BlcmFuZFR5cGUuc3RhY2s6IFxyXG5cdFx0XHRcdCAgXHQgaWYgKHRoaXMuU1AgPD0gdGhpcy5GUCArIHRoaXMuZnJhbWVMZW4pXHJcblx0XHRcdCBcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlN0YWNrIHVuZGVyZmxvd1wiKTtcclxuXHRcdFx0XHQgIFx0b3BlcmFuZHMucHVzaCh0aGlzLnBvcCgpKTsgXHJcblx0XHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0XHQgIC8vIGluZGlyZWN0IGZyb20gUkFNXHJcblx0XHRcdFx0ICBjYXNlIExvYWRPcGVyYW5kVHlwZS5yYW1fODogb3BlcmFuZHMucHVzaChsb2FkSW5kaXJlY3QoaW1hZ2UuZ2V0UmFtQWRkcmVzcyhpbWFnZS5yZWFkQnl0ZShvcGVyYW5kUG9zKSkpKTsgcmV0dXJuIDE7XHJcblx0XHRcdFx0ICBjYXNlIExvYWRPcGVyYW5kVHlwZS5yYW1fMTY6IG9wZXJhbmRzLnB1c2gobG9hZEluZGlyZWN0KGltYWdlLmdldFJhbUFkZHJlc3MoaW1hZ2UucmVhZEludDE2KG9wZXJhbmRQb3MpKSkpOyByZXR1cm4gMjtcclxuXHRcdFx0XHQgIGNhc2UgTG9hZE9wZXJhbmRUeXBlLnJhbV8zMjogb3BlcmFuZHMucHVzaChsb2FkSW5kaXJlY3QoaW1hZ2UuZ2V0UmFtQWRkcmVzcyhpbWFnZS5yZWFkSW50MzIob3BlcmFuZFBvcykpKSk7IHJldHVybiA0O1xyXG5cdFx0XHRcdCAgLy8gbG9jYWwgc3RvcmFnZVxyXG5cdFx0XHRcdCAgY2FzZSBMb2FkT3BlcmFuZFR5cGUubG9jYWxfODogb3BlcmFuZHMucHVzaChsb2FkTG9jYWwoaW1hZ2UucmVhZEJ5dGUob3BlcmFuZFBvcykpKTsgcmV0dXJuIDE7XHJcblx0XHRcdFx0ICBjYXNlIExvYWRPcGVyYW5kVHlwZS5sb2NhbF8xNjogb3BlcmFuZHMucHVzaChsb2FkTG9jYWwoaW1hZ2UucmVhZEludDE2KG9wZXJhbmRQb3MpKSk7IHJldHVybiAyO1xyXG5cdFx0XHRcdCAgY2FzZSBMb2FkT3BlcmFuZFR5cGUubG9jYWxfMzI6IG9wZXJhbmRzLnB1c2gobG9hZExvY2FsKGltYWdlLnJlYWRJbnQzMihvcGVyYW5kUG9zKSkpOyByZXR1cm4gNDtcclxuXHJcblx0XHRcdFx0ICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoYHVuc3VwcG9ydGVkIGxvYWQgb3BlcmFuZCB0eXBlICR7dHlwZX1gKTtcclxuXHRcdFx0ICB9XHJcblx0XHRcdCAgXHJcblx0XHQgIH1cclxuXHRcdCAgXHJcblx0XHQgIC8qKlxyXG5cdFx0ICAgKiBAcmV0dXJuIGhvdyBtYW55IGV4dHJhIGJ5dGVzIHdlcmUgcmVhZCAoc28gdGhhdCBvcGVyYW5kUG9zIGNhbiBiZSBhZHZhbmNlZClcclxuXHRcdCAgICovXHJcblx0XHQgIHByaXZhdGUgZGVjb2RlU3RvcmVPcGVyYW5kKG9wY29kZTogT3Bjb2RlLCB0eXBlOm51bWJlciwgb3BlcmFuZHM6IG51bWJlcltdLCBvcGVyYW5kUG9zOiBudW1iZXIpe1xyXG5cdFx0XHQgIHN3aXRjaCh0eXBlKXtcclxuXHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5kaXNjYXJkOiBcclxuXHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5zdGFjazpcclxuXHRcdFx0XHQgIFx0XHRyZXR1cm4gMDsgXHJcblx0XHRcdFx0ICBjYXNlIFN0b3JlT3BlcmFuZFR5cGUucHRyXzg6IFxyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLmxvY2FsXzg6XHJcblx0XHRcdFx0ICBcdFx0b3BlcmFuZHMucHVzaCh0aGlzLmltYWdlLnJlYWRCeXRlKG9wZXJhbmRQb3MpKTsgXHJcblx0XHRcdFx0XHRcdHJldHVybiAxO1xyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLnB0cl8xNjpcclxuXHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5sb2NhbF8xNjogXHJcblx0XHRcdFx0ICBcdFx0b3BlcmFuZHMucHVzaCh0aGlzLmltYWdlLnJlYWRJbnQxNihvcGVyYW5kUG9zKSk7IFxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gMjtcclxuXHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5wdHJfMzI6IFxyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLmxvY2FsXzMyOlxyXG5cdFx0XHRcdCAgXHRcdG9wZXJhbmRzLnB1c2godGhpcy5pbWFnZS5yZWFkSW50MzIob3BlcmFuZFBvcykpOyBcclxuXHRcdFx0XHRcdCBcdHJldHVybiA0O1xyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLnJhbV84OlxyXG5cdFx0XHRcdCAgXHRcdG9wZXJhbmRzLnB1c2godGhpcy5pbWFnZS5nZXRSYW1BZGRyZXNzKHRoaXMuaW1hZ2UucmVhZEJ5dGUob3BlcmFuZFBvcykpKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIDE7ICBcclxuXHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5yYW1fMTY6XHJcblx0XHRcdFx0ICBcdFx0b3BlcmFuZHMucHVzaCh0aGlzLmltYWdlLmdldFJhbUFkZHJlc3ModGhpcy5pbWFnZS5yZWFkSW50MTYob3BlcmFuZFBvcykpKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIDI7ICBcclxuXHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5yYW1fMzI6XHJcblx0XHRcdFx0ICBcdFx0b3BlcmFuZHMucHVzaCh0aGlzLmltYWdlLmdldFJhbUFkZHJlc3ModGhpcy5pbWFnZS5yZWFkSW50MzIob3BlcmFuZFBvcykpKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIDQ7ICBcclxuXHRcdFx0XHQgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgc3RvcmUgb3BlcmFuZCB0eXBlICR7dHlwZX1gKTtcclxuXHRcdFx0ICB9XHJcblx0XHQgIH1cclxuXHRcdCAgXHJcblx0XHQgIC8qKlxyXG5cdFx0ICAgKiBAcmV0dXJuIGhvdyBtYW55IGV4dHJhIGJ5dGVzIHdlcmUgcmVhZCAoc28gdGhhdCBvcGVyYW5kUG9zIGNhbiBiZSBhZHZhbmNlZClcclxuXHRcdCAgICovXHJcblx0XHQgIHByaXZhdGUgZGVjb2RlRGVsYXllZFN0b3JlT3BlcmFuZChvcGNvZGU6IE9wY29kZSwgdHlwZTpudW1iZXIsIG9wZXJhbmRzOiBudW1iZXJbXSwgb3BlcmFuZFBvczogbnVtYmVyKXtcclxuXHRcdFx0ICBzd2l0Y2godHlwZSl7XHJcblx0XHRcdFx0ICBjYXNlIFN0b3JlT3BlcmFuZFR5cGUuZGlzY2FyZDogXHJcblx0XHRcdFx0ICBcdG9wZXJhbmRzLnB1c2goR0xVTFhfU1RVQi5TVE9SRV9OVUxMKTtcclxuXHRcdFx0XHRcdG9wZXJhbmRzLnB1c2goMCk7XHJcblx0XHRcdFx0ICBcdHJldHVybiAwO1xyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLnB0cl84OiBcclxuXHRcdFx0XHQgIFx0b3BlcmFuZHMucHVzaChHTFVMWF9TVFVCLlNUT1JFX01FTSk7XHJcblx0XHRcdFx0XHRvcGVyYW5kcy5wdXNoKHRoaXMuaW1hZ2UucmVhZEJ5dGUob3BlcmFuZFBvcykpO1xyXG5cdFx0XHRcdCAgXHRyZXR1cm4gMTtcclxuXHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5wdHJfMTY6IFxyXG5cdFx0XHRcdCAgXHRvcGVyYW5kcy5wdXNoKEdMVUxYX1NUVUIuU1RPUkVfTUVNKTtcclxuXHRcdFx0XHRcdG9wZXJhbmRzLnB1c2godGhpcy5pbWFnZS5yZWFkSW50MTYob3BlcmFuZFBvcykpO1xyXG5cdFx0XHRcdCAgXHRyZXR1cm4gMjtcclxuXHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5wdHJfMzI6IFxyXG5cdFx0XHRcdCAgXHRvcGVyYW5kcy5wdXNoKEdMVUxYX1NUVUIuU1RPUkVfTUVNKTtcclxuXHRcdFx0XHRcdG9wZXJhbmRzLnB1c2godGhpcy5pbWFnZS5yZWFkSW50MzIob3BlcmFuZFBvcykpOyBcclxuXHRcdFx0XHRcdHJldHVybiA0O1xyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLnN0YWNrOlxyXG5cdFx0XHRcdCAgXHRvcGVyYW5kcy5wdXNoKEdMVUxYX1NUVUIuU1RPUkVfU1RBQ0spO1xyXG5cdFx0XHRcdFx0b3BlcmFuZHMucHVzaCgwKTtcclxuXHRcdFx0XHRcdHJldHVybiAwOyAgXHJcblx0XHRcdFx0ICBjYXNlIFN0b3JlT3BlcmFuZFR5cGUubG9jYWxfODpcclxuXHRcdFx0XHQgICAgb3BlcmFuZHMucHVzaChHTFVMWF9TVFVCLlNUT1JFX0xPQ0FMKTtcclxuXHRcdFx0XHRcdG9wZXJhbmRzLnB1c2godGhpcy5pbWFnZS5yZWFkQnl0ZShvcGVyYW5kUG9zKSk7XHJcblx0XHRcdFx0ICBcdHJldHVybiAxO1xyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLmxvY2FsXzE2OiBcclxuXHRcdFx0XHQgIFx0b3BlcmFuZHMucHVzaChHTFVMWF9TVFVCLlNUT1JFX0xPQ0FMKTtcclxuXHRcdFx0XHRcdG9wZXJhbmRzLnB1c2godGhpcy5pbWFnZS5yZWFkSW50MTYob3BlcmFuZFBvcykpO1xyXG5cdFx0XHRcdCAgXHRyZXR1cm4gMjtcclxuXHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5sb2NhbF8zMjogXHJcblx0XHRcdFx0ICBcdG9wZXJhbmRzLnB1c2goR0xVTFhfU1RVQi5TVE9SRV9MT0NBTCk7XHJcblx0XHRcdFx0XHRvcGVyYW5kcy5wdXNoKHRoaXMuaW1hZ2UucmVhZEludDMyKG9wZXJhbmRQb3MpKTsgXHJcblx0XHRcdFx0XHRyZXR1cm4gNDtcclxuXHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5yYW1fODpcclxuXHRcdFx0XHQgICAgb3BlcmFuZHMucHVzaChHTFVMWF9TVFVCLlNUT1JFX01FTSk7XHJcblx0XHRcdFx0XHRvcGVyYW5kcy5wdXNoKHRoaXMuaW1hZ2UuZ2V0UmFtQWRkcmVzcyh0aGlzLmltYWdlLnJlYWRCeXRlKG9wZXJhbmRQb3MpKSk7XHJcblx0XHRcdFx0ICBcdHJldHVybiAxO1xyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLnJhbV8xNjogXHJcblx0XHRcdFx0ICBcdG9wZXJhbmRzLnB1c2goR0xVTFhfU1RVQi5TVE9SRV9NRU0pO1xyXG5cdFx0XHRcdFx0b3BlcmFuZHMucHVzaCh0aGlzLmltYWdlLmdldFJhbUFkZHJlc3ModGhpcy5pbWFnZS5yZWFkSW50MTYob3BlcmFuZFBvcykpKTtcclxuXHRcdFx0XHQgIFx0cmV0dXJuIDI7XHJcblx0XHRcdFx0ICBjYXNlIFN0b3JlT3BlcmFuZFR5cGUucmFtXzMyOiBcclxuXHRcdFx0XHQgIFx0b3BlcmFuZHMucHVzaChHTFVMWF9TVFVCLlNUT1JFX01FTSk7XHJcblx0XHRcdFx0XHRvcGVyYW5kcy5wdXNoKHRoaXMuaW1hZ2UuZ2V0UmFtQWRkcmVzcyh0aGlzLmltYWdlLnJlYWRJbnQzMihvcGVyYW5kUG9zKSkpOyBcclxuXHRcdFx0XHRcdHJldHVybiA0O1x0XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHQgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgZGVsYXllZCBzdG9yZSBvcGVyYW5kIHR5cGUgJHt0eXBlfWApO1xyXG5cdFx0XHQgIH1cclxuXHRcdCAgfVxyXG5cdFx0ICBcclxuXHRcdCAgXHJcblx0XHQgIHByaXZhdGUgcGVyZm9ybURlbGF5ZWRTdG9yZSh0eXBlOm51bWJlciwgYWRkcmVzczogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKXtcclxuXHRcdFx0ICBzd2l0Y2godHlwZSl7XHJcblx0XHRcdFx0ICBjYXNlIEdMVUxYX1NUVUIuU1RPUkVfTlVMTDogcmV0dXJuO1xyXG5cdFx0XHRcdCAgY2FzZSBHTFVMWF9TVFVCLlNUT1JFX01FTTogdGhpcy5pbWFnZS53cml0ZUludDMyKGFkZHJlc3MsIHZhbHVlKTsgcmV0dXJuO1xyXG5cdFx0XHRcdCAgY2FzZSBHTFVMWF9TVFVCLlNUT1JFX0xPQ0FMOiB0aGlzLnN0YWNrLndyaXRlSW50MzIodGhpcy5GUCArIHRoaXMubG9jYWxzUG9zICsgYWRkcmVzcywgdmFsdWUpOyByZXR1cm47XHJcblx0XHRcdFx0ICBjYXNlIEdMVUxYX1NUVUIuU1RPUkVfU1RBQ0s6IHRoaXMucHVzaCh2YWx1ZSk7IHJldHVybjtcclxuXHRcdFx0XHQgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgZGVsYXllZCBzdG9yZSBtb2RlICR7dHlwZX1gKTtcclxuXHRcdFx0ICB9XHJcblx0XHQgIH1cclxuXHRcdCAgXHJcblx0XHQgIFxyXG5cdFx0ICBwcml2YXRlIHN0b3JlUmVzdWx0cyhydWxlOiBPcGNvZGVSdWxlLCByZXN1bHRUeXBlczogbnVtYmVyW10sIHJlc3VsdEFkZHJzOiBudW1iZXJbXSwgcmVzdWx0czogbnVtYmVyW10pe1xyXG5cdFx0XHQgZm9yIChsZXQgaT0wOyBpPHJlc3VsdHMubGVuZ3RoOyBpKyspe1xyXG5cdFx0XHRcdCAgbGV0IHZhbHVlID0gcmVzdWx0c1tpXTtcclxuXHRcdFx0XHQgIGxldCB0eXBlID0gcmVzdWx0VHlwZXNbaV07XHJcblx0XHRcdFx0ICBzd2l0Y2godHlwZSl7XHJcblx0XHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5kaXNjYXJkOiByZXR1cm47XHJcblx0XHRcdFx0XHQgIGNhc2UgNTogY2FzZSA2OiBjYXNlIDc6IGNhc2UgMTM6IGNhc2UgMTQ6IGNhc2UgMTU6XHJcblx0XHRcdFx0XHQgIFx0Ly8gd3JpdGUgdG8gbWVtb3J5XHJcblx0XHRcdFx0XHRcdHRoaXMuaW1hZ2Uud3JpdGUocnVsZSwgcmVzdWx0QWRkcnNbaV0sIHZhbHVlKTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5zdGFjazpcclxuXHRcdFx0XHRcdCAgXHQvLyBwdXNoIG9udG8gc3RhY2tcclxuXHRcdFx0XHRcdFx0dGhpcy5wdXNoKHZhbHVlKTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5sb2NhbF84OlxyXG5cdFx0XHRcdFx0ICBjYXNlIFN0b3JlT3BlcmFuZFR5cGUubG9jYWxfMTY6XHJcblx0XHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5sb2NhbF8zMjpcclxuXHRcdFx0XHRcdFx0Ly8gd3JpdGUgdG8gbG9jYWwgc3RvcmFnZVxyXG5cdFx0XHRcdFx0XHRsZXQgYWRkcmVzcyA9IHJlc3VsdEFkZHJzW2ldICsgdGhpcy5GUCArIHRoaXMubG9jYWxzUG9zO1xyXG5cdFx0XHRcdFx0XHRsZXQgbGltaXQgPSB0aGlzLkZQICsgdGhpcy5mcmFtZUxlbjtcclxuXHRcdFx0XHRcdFx0c3dpdGNoKHJ1bGUpe1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgT3Bjb2RlUnVsZS5JbmRpcmVjdDhCaXQ6XHJcblx0XHRcdFx0XHRcdFx0XHRpZihhZGRyZXNzID49IGxpbWl0KVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ3cml0aW5nIG91dHNpZGUgbG9jYWwgc3RvcmFnZSBib3VuZHNcIik7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnN0YWNrLndyaXRlQnl0ZShhZGRyZXNzLCB2YWx1ZSk7XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRjYXNlIE9wY29kZVJ1bGUuSW5kaXJlY3QxNkJpdDpcclxuXHRcdFx0XHRcdFx0XHRcdGlmKGFkZHJlc3MrMSA+PSBsaW1pdClcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwid3JpdGluZyBvdXRzaWRlIGxvY2FsIHN0b3JhZ2UgYm91bmRzXCIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zdGFjay53cml0ZUludDE2KGFkZHJlc3MsIHZhbHVlKTtcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdFx0XHRpZihhZGRyZXNzKzMgPj0gbGltaXQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIndyaXRpbmcgb3V0c2lkZSBsb2NhbCBzdG9yYWdlIGJvdW5kc1wiKTtcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc3RhY2sud3JpdGVJbnQzMihhZGRyZXNzLCB2YWx1ZSk7XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcdFx0XHRcdFx0ICBcclxuXHRcdFx0XHRcdCAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBzdG9yZSByZXN1bHQgbW9kZSAke3R5cGV9IGZvciByZXN1bHQgJHtpfSBvZiAke3Jlc3VsdHN9YCk7XHJcblx0XHRcdFx0ICB9XHRcclxuXHRcdFx0ICB9XHJcblx0XHQgIH1cclxuXHRcdCAgXHJcblx0XHQgIHByaXZhdGUgbGVhdmVGdW5jdGlvbihyZXRWYWw6IG51bWJlcil7XHJcblx0XHRcdFx0aWYgKHRoaXMuRlAgPT09IDApe1xyXG5cdFx0XHRcdFx0Ly8gdG9wLWxldmVsIGZ1bmN0aW9uXHJcblx0XHRcdFx0XHR0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5TUCA9IHRoaXMuRlA7XHJcblx0XHRcdFx0dGhpcy5yZXN1bWVGcm9tQ2FsbFN0dWIocmV0VmFsKTtcclxuXHRcdCAgfVxyXG5cdFx0ICBcclxuXHRcdCAgcHJpdmF0ZSByZXN1bWVGcm9tQ2FsbFN0dWIocmVzdWx0OiBudW1iZXIpe1xyXG5cdFx0XHQgIGxldCBzdHViID0gdGhpcy5wb3BDYWxsU3R1YigpO1xyXG5cdFx0XHQgIFxyXG5cdFx0XHQgIHRoaXMuUEMgPSBzdHViLlBDO1xyXG5cdFx0XHQgIHRoaXMuZXhlY01vZGUgPSBFeGVjdXRpb25Nb2RlLkNvZGU7XHJcblx0XHRcdCAgXHJcblx0XHRcdCAgbGV0IG5ld0ZQID0gc3R1Yi5mcmFtZVB0cjtcclxuXHRcdFx0ICBsZXQgbmV3RnJhbWVMZW4gPSB0aGlzLnN0YWNrLnJlYWRJbnQzMihuZXdGUCk7XHJcblx0XHRcdCAgbGV0IG5ld0xvY2Fsc1BvcyA9IHRoaXMuc3RhY2sucmVhZEludDMyKG5ld0ZQKzQpO1xyXG5cdFx0XHQgIFxyXG5cdFx0XHQgIHN3aXRjaChzdHViLmRlc3RUeXBlKXtcclxuXHRcdFx0XHQgIGNhc2UgR0xVTFhfU1RVQi5TVE9SRV9OVUxMOiBicmVhaztcclxuXHRcdFx0XHQgIGNhc2UgR0xVTFhfU1RVQi5TVE9SRV9NRU06XHJcblx0XHRcdFx0ICBcdFx0dGhpcy5pbWFnZS53cml0ZUludDMyKHN0dWIuZGVzdEFkZHIsIHJlc3VsdCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdCAgY2FzZSBHTFVMWF9TVFVCLlNUT1JFX0xPQ0FMOlxyXG5cdFx0XHRcdCAgXHRcdHRoaXMuc3RhY2sud3JpdGVJbnQzMihuZXdGUCArIG5ld0xvY2Fsc1Bvcysgc3R1Yi5kZXN0QWRkciwgcmVzdWx0KTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0ICBjYXNlIEdMVUxYX1NUVUIuU1RPUkVfU1RBQ0s6XHJcblx0XHRcdFx0ICBcdFx0dGhpcy5wdXNoKHJlc3VsdCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdCAgY2FzZSBHTFVMWF9TVFVCLlJFU1VNRV9GVU5DOlxyXG5cdFx0XHRcdCAgXHRcdC8vIHJlc3VtZSBleGVjdXRpbmcgaW4gdGhlIHNhbWUgY2FsbCBmcmFtZVxyXG4gICAgICAgICAgICAgICAgICAgIFx0Ly8gcmV0dXJuIHRvIGF2b2lkIGNoYW5naW5nIEZQXHJcbiAgICAgICAgICAgICAgICAgICAgXHRyZXR1cm47XHJcblx0XHRcdFx0ICBjYXNlIEdMVUxYX1NUVUIuUkVTVU1FX0NTVFI6XHJcbiAgICAgICAgICAgICAgICAgICAgXHQvLyByZXN1bWUgcHJpbnRpbmcgYSBDLXN0cmluZ1xyXG4gICAgICAgICAgICAgICAgICAgIFx0dGhpcy5leGVjTW9kZSA9IEV4ZWN1dGlvbk1vZGUuQ1N0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBcdGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICBjYXNlIEdMVUxYX1NUVUIuUkVTVU1FX1VOSVNUUjpcclxuICAgICAgICAgICAgICAgICAgIFx0ICAgIC8vIHJlc3VtZSBwcmludGluZyBhIFVuaWNvZGUgc3RyaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgXHR0aGlzLmV4ZWNNb2RlID0gRXhlY3V0aW9uTW9kZS5Vbmljb2RlU3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgY2FzZSBHTFVMWF9TVFVCLlJFU1VNRV9OVU1CRVI6XHJcbiAgICAgICAgICAgICAgICAgICAgXHQvLyByZXN1bWUgcHJpbnRpbmcgYSBkZWNpbWFsIG51bWJlclxyXG4gICAgICAgICAgICAgICAgICAgIFx0dGhpcy5leGVjTW9kZSA9IEV4ZWN1dGlvbk1vZGUuTnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIFx0dGhpcy5wcmludGluZ0RpZ2l0ID0gc3R1Yi5kZXN0QWRkcjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgY2FzZSBHTFVMWF9TVFVCLlJFU1VNRV9IVUZGU1RSOlxyXG4gICAgICAgICAgICAgICAgICAgIFx0Ly8gcmVzdW1lIHByaW50aW5nIGEgY29tcHJlc3NlZCBzdHJpbmdcclxuICAgICAgICAgICAgICAgICAgICBcdHRoaXMuZXhlY01vZGUgPSBFeGVjdXRpb25Nb2RlLkNvbXByZXNzZWRTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgXHR0aGlzLnByaW50aW5nRGlnaXQgPSBzdHViLmRlc3RBZGRyO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1x0XHRcclxuXHRcdFx0XHQgIC8vIFRPRE86IHRoZSBvdGhlciByZXR1cm4gbW9kZXNcclxuXHRcdFx0XHQgIGRlZmF1bHQ6XHJcblx0XHRcdFx0ICBcdFx0dGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCByZXR1cm4gbW9kZSAke3N0dWIuZGVzdFR5cGV9YCk7XHJcblx0XHRcdCAgfVxyXG5cdFx0XHQgIFxyXG5cdFx0XHQgIHRoaXMuRlAgPSBuZXdGUDtcclxuXHRcdFx0ICB0aGlzLmZyYW1lTGVuID0gbmV3RnJhbWVMZW47XHJcblx0XHRcdCAgdGhpcy5sb2NhbHNQb3MgPSBuZXdMb2NhbHNQb3M7XHJcblx0XHQgIH1cdFx0ICBcclxuXHRcdCAgXHJcblx0XHQgIHRha2VCcmFuY2goanVtcFZlY3RvcjogbnVtYmVyKXtcclxuXHRcdFx0XHRpZiAoanVtcFZlY3RvciA9PT0gMCB8fCBqdW1wVmVjdG9yID09PSAxKXtcclxuXHRcdFx0XHRcdHRoaXMubGVhdmVGdW5jdGlvbihqdW1wVmVjdG9yKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHRoaXMuUEMgKz0ganVtcFZlY3RvciAtIDI7XHJcblx0XHRcdFx0fVxyXG5cdFx0ICB9XHJcblx0XHQgIFxyXG5cdFx0ICBwZXJmb3JtQ2FsbChhZGRyZXNzOiBudW1iZXIsIGFyZ3M6IG51bWJlcltdLCBkZXN0VHlwZTpudW1iZXIsIGRlc3RBZGRyOiBudW1iZXIsIHN0dWJQQzogbnVtYmVyLCB0YWlsQ2FsbCA9IGZhbHNlKXtcclxuXHRcdFx0ICBcdC8vIGludGVyY2VwdCB2ZW5lZXIgY2FsbHNcclxuXHRcdFx0XHRsZXQgdmVuZWVyID0gdGhpcy52ZW5lZXJbYWRkcmVzc107XHJcblx0XHRcdFx0aWYgKHZlbmVlcikge1xyXG5cdFx0XHRcdFx0dGhpcy5wZXJmb3JtRGVsYXllZFN0b3JlKGRlc3RUeXBlLCBkZXN0QWRkciwgdmVuZWVyLmFwcGx5KHRoaXMsIGFyZ3MpKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ICBcclxuXHRcdFx0XHRpZiAodGFpbENhbGwpe1xyXG5cdFx0XHRcdFx0Ly8gcG9wIHRoZSBjdXJyZW50IGZyYW1lIGFuZCB1c2UgdGhlIGNhbGwgc3R1YiBiZWxvdyBpdFxyXG5cdFx0XHRcdFx0dGhpcy5TUCA9IHRoaXMuRlA7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQvLyB1c2UgYSBuZXcgY2FsbCBzdHViXHJcblx0XHRcdFx0XHR0aGlzLnB1c2hDYWxsU3R1YihkZXN0VHlwZSwgZGVzdEFkZHIsIHN0dWJQQywgdGhpcy5GUCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0XHRsZXQgdHlwZSA9IHRoaXMuaW1hZ2UucmVhZEJ5dGUoYWRkcmVzcyk7XHJcblx0XHRcdFx0aWYgKHR5cGUgPT09IENhbGxUeXBlLnN0YWNrKXtcclxuXHRcdFx0XHRcdHRoaXMuZW50ZXJGdW5jdGlvbihhZGRyZXNzKTtcclxuXHRcdFx0XHRcdGlmICghYXJncyl7XHJcblx0XHRcdFx0XHRcdHRoaXMucHVzaCgwKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRmb3IobGV0IGk9YXJncy5sZW5ndGgtMTsgaT49MDsgaS0tKVxyXG5cdFx0XHRcdFx0XHRcdHRoaXMucHVzaChhcmdzW2ldKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5wdXNoKGFyZ3MubGVuZ3RoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09IENhbGxUeXBlLmxvY2FsU3RvcmFnZSl7XHJcblx0XHRcdFx0XHRpZiAoIWFyZ3MpIHsgYXJncyA9IFtdIH1cclxuXHRcdFx0XHRcdHRoaXMuZW50ZXJGdW5jdGlvbihhZGRyZXNzLCAuLi5hcmdzKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGZ1bmN0aW9uIGNhbGwgdHlwZSAke3R5cGV9YCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0ICB9XHJcblx0XHQgIFxyXG5cdFx0ICBzdHJlYW1DaGFyQ29yZSh4OiBudW1iZXIpe1xyXG5cdFx0XHQgICB0aGlzLnN0cmVhbVVuaUNoYXJDb3JlKHggJiAweEZGKTtcclxuXHRcdCAgfVxyXG5cdFx0ICBcclxuXHRcdCAgc3RyZWFtVW5pQ2hhckNvcmUoeDogbnVtYmVyKXtcclxuXHRcdFx0ICAgIGlmICh0aGlzLm91dHB1dFN5c3RlbSA9PT0gSU9TeXN0ZW0uRmlsdGVyKXtcclxuXHRcdFx0XHRcdHRoaXMucGVyZm9ybUNhbGwodGhpcy5maWx0ZXJBZGRyZXNzLCBbIHggXSwgR0xVTFhfU1RVQi5TVE9SRV9OVUxMLCAwLCB0aGlzLlBDLCBmYWxzZSk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRTZW5kQ2hhclRvT3V0cHV0LmNhbGwodGhpcywgeCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0ICB9XHJcblxyXG4gXHRcdCAgc3RyZWFtTnVtQ29yZSh4OiBudW1iZXIpe1xyXG5cdFx0XHQgICAgeCA9IHggfCAwO1xyXG5cdFx0XHQgICAgaWYgKHRoaXMub3V0cHV0U3lzdGVtID09PSBJT1N5c3RlbS5GaWx0ZXIpe1xyXG5cdFx0XHRcdFx0dGhpcy5wdXNoQ2FsbFN0dWIoR0xVTFhfU1RVQi5SRVNVTUVfRlVOQywgMCwgdGhpcy5QQywgdGhpcy5GUCk7XHJcblx0XHRcdFx0XHRsZXQgbnVtID0geC50b1N0cmluZygpO1xyXG5cdFx0XHRcdFx0dGhpcy5wZXJmb3JtQ2FsbCh0aGlzLmZpbHRlckFkZHJlc3MsIFsgbnVtLmNoYXJDb2RlQXQoMCkgXSwgR0xVTFhfU1RVQi5SRVNVTUVfTlVNQkVSLCAxLCB4LCBmYWxzZSk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRTZW5kU3RyaW5nVG9PdXRwdXQuY2FsbCh0aGlzLCB4LnRvU3RyaW5nKCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdCAgfVxyXG5cclxuXHRcdCAgc3RyZWFtU3RyQ29yZShhZGRyZXNzOiBudW1iZXIpe1xyXG5cdFx0XHQgIGlmICh0aGlzLm91dHB1dFN5c3RlbSA9PSBJT1N5c3RlbS5OdWxsKSByZXR1cm47XHJcblx0XHRcdCAgbGV0IHR5cGUgPSB0aGlzLmltYWdlLnJlYWRCeXRlKGFkZHJlc3MpO1xyXG5cdFx0XHQgIFxyXG5cdFx0XHQgIGlmICh0eXBlID09PSAweEUxICYmICF0aGlzLmRlY29kaW5nVGFibGUpXHJcblx0XHRcdCAgXHRcdHRocm93IG5ldyBFcnJvcihcIk5vIHN0cmluZyBkZWNvZGluZyB0YWJsZSBpcyBzZXRcIik7XHJcblx0XHRcdCAgXHRcclxuXHRcdFx0ICAvLyBUT0RPOiBuYXRpdmUgZGVjb2RpbmcgdGFibGVcclxuXHRcdFx0ICAvLyBmb3Igbm93LCBqdXN0IGZhbGwgYmFjayB0byB1c2luZyBFeGVjdXRpb25Nb2RlLkNvbXByZXNzZWRTdHJpbmdcdCAgXHJcblx0XHRcdCAgbGV0IGZhbGxiYWNrRW5jb2RpbmcgPSAodHlwZSA9PT0gMHhFMSk7XHJcblx0XHRcdCAgXHJcblx0XHRcdCAgaWYgKHRoaXMub3V0cHV0U3lzdGVtID09IElPU3lzdGVtLkZpbHRlciB8fCBmYWxsYmFja0VuY29kaW5nKXtcclxuXHRcdFx0XHQgIHRoaXMucHVzaENhbGxTdHViKEdMVUxYX1NUVUIuUkVTVU1FX0ZVTkMsIDAsIHRoaXMuUEMsIHRoaXMuRlApO1xyXG5cdFx0XHRcdCAgc3dpdGNoKHR5cGUpe1xyXG5cdFx0XHRcdFx0ICBjYXNlIDB4RTA6XHJcblx0XHRcdFx0XHQgIFx0dGhpcy5leGVjTW9kZSA9IEV4ZWN1dGlvbk1vZGUuQ1N0cmluZztcclxuXHRcdFx0XHRcdFx0dGhpcy5QQyA9IGFkZHJlc3MrMTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdCAgICAgIGNhc2UgMHhFMTpcclxuXHRcdFx0XHRcdCAgXHR0aGlzLmV4ZWNNb2RlID0gRXhlY3V0aW9uTW9kZS5Db21wcmVzc2VkU3RyaW5nO1xyXG5cdFx0XHRcdFx0XHR0aGlzLlBDID0gYWRkcmVzcysxO1xyXG5cdFx0XHRcdFx0XHR0aGlzLnByaW50aW5nRGlnaXQgPSAwO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHQgIGNhc2UgMHhFMjpcclxuXHRcdFx0XHRcdCAgXHR0aGlzLmV4ZWNNb2RlID0gRXhlY3V0aW9uTW9kZS5Vbmljb2RlU3RyaW5nO1xyXG5cdFx0XHRcdFx0XHR0aGlzLlBDID0gYWRkcmVzcys0O1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHQgIGRlZmF1bHQ6XHJcblx0XHRcdFx0XHQgIFx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHN0cmluZyB0eXBlICR7dHlwZX0gYXQgJHthZGRyZXNzfWApO1xyXG5cdFx0XHRcdCAgfVxyXG5cdFx0XHQgIH1cclxuXHRcdFx0ICBcclxuXHRcdFx0ICBzd2l0Y2godHlwZSl7XHJcblx0XHRcdFx0ICBjYXNlIDB4RTA6XHJcblx0XHRcdFx0ICBcdFNlbmRTdHJpbmdUb091dHB1dC5jYWxsKHRoaXMsIHRoaXMuaW1hZ2UucmVhZENTdHJpbmcoYWRkcmVzcysxKSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0ICBkZWZhdWx0OlxyXG5cdFx0XHRcdFx0ICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc3RyaW5nIHR5cGUgJHt0eXBlfSBhdCAke2FkZHJlc3N9YCk7XHJcblx0XHRcdCAgfVxyXG5cdFx0ICB9XHJcblxyXG5cclxuXHRcdCAgLy8gIFNlbmRzIHRoZSBxdWV1ZWQgb3V0cHV0IHRvIHRoZSBPdXRwdXRSZWFkeSBldmVudCBoYW5kbGVyLlxyXG4gICAgICBcdCAgcHJpdmF0ZSBkZWxpdmVyT3V0cHV0KCl7XHJcblx0XHRcdCBpZiAodGhpcy5vdXRwdXRSZWFkeSl7XHJcblx0XHRcdCBcdGxldCBwYWNrID0gdGhpcy5vdXRwdXRCdWZmZXIuZmx1c2goKTtcclxuXHRcdFx0IFx0dGhpcy5vdXRwdXRSZWFkeShwYWNrKTtcclxuXHRcdFx0IH1cclxuXHRcdCAgfVxyXG5cdFx0ICBcclxuXHRcdCAgXHJcblx0XHQgIHNhdmVUb1F1ZXR6YWwoZGVzdFR5cGUsIGRlc3RBZGRyKSA6IFF1ZXR6YWx7XHJcblx0XHRcdCAgXHJcblx0XHRcdCAgbGV0IHF1ZXR6YWwgPSB0aGlzLmltYWdlLnNhdmVUb1F1ZXR6YWwoKTtcclxuXHRcdFx0ICBcclxuXHRcdFx0ICAvLyAnU3RrcycgaXMgdGhlIGNvbnRlbnRzIG9mIHRoZSBzdGFjaywgd2l0aCBhIHN0dWIgb24gdG9wXHJcbiAgICAgICAgICAgICAgLy8gaWRlbnRpZnlpbmcgdGhlIGRlc3RpbmF0aW9uIG9mIHRoZSBzYXZlIG9wY29kZS5cclxuICAgICAgICAgXHQgIHRoaXMucHVzaENhbGxTdHViKGRlc3RUeXBlLCBkZXN0QWRkciwgdGhpcy5QQywgdGhpcy5GUCk7XHJcblx0XHRcdCAgbGV0IHRyaW1tZWQgPSB0aGlzLnN0YWNrLmNvcHkoMCwgdGhpcy5TUCk7XHJcblx0XHRcdCAgcXVldHphbC5zZXRDaHVuaygnU3RrcycsIHRyaW1tZWQuYnVmZmVyKTtcclxuXHRcdCAgICAgIHRoaXMucG9wQ2FsbFN0dWIoKTtcclxuXHRcdFx0ICBcclxuXHRcdFx0ICAvLyAnTUFsbCcgaXMgdGhlIGxpc3Qgb2YgaGVhcCBibG9ja3NcclxuXHRcdFx0ICBpZiAodGhpcy5oZWFwKXtcclxuXHRcdFx0XHQgIHF1ZXR6YWwuc2V0Q2h1bmsoJ01BbGwnLCB0aGlzLmhlYXAuc2F2ZSgpKTtcclxuXHRcdFx0ICB9XHJcblx0XHRcdCAgXHJcblx0XHRcdCAgcmV0dXJuIHF1ZXR6YWw7XHJcblx0XHRcdCAgXHJcblx0XHQgIH1cclxuXHRcdCAgXHJcblx0XHQgIGxvYWRGcm9tUXVldHphbChxdWV0emFsOiBRdWV0emFsKXtcclxuXHRcdFx0ICAvLyBtYWtlIHN1cmUgdGhlIHNhdmUgZmlsZSBtYXRjaGVzIHRoZSBnYW1lIGZpbGVcclxuICAgICAgICAgICBcdCAgbGV0IGlmaGQxID0gbmV3IFVpbnQ4QXJyYXkocXVldHphbC5nZXRJRmhkQ2h1bmsoKSk7XHJcblx0XHRcdCAgaWYgKGlmaGQxLmJ5dGVMZW5ndGggIT09IDEyOCl7XHJcblx0XHRcdCAgXHR0aHJvdyBuZXcgRXJyb3IoJ01pc3Npbmcgb3IgaW52YWxpZCBJRmhkIGJsb2NrJyk7XHJcblx0XHRcdCAgfVxyXG5cdFx0XHQgIGxldCB7aW1hZ2V9ID0gdGhpcztcclxuXHRcdFx0ICBmb3IgKGxldCBpPTA7IGk8MTI4OyBpKyspe1xyXG5cdFx0XHRcdCAgaWYgKGlmaGQxW2ldICE9PSBpbWFnZS5yZWFkQnl0ZShpKSlcclxuXHRcdFx0XHQgIFx0dGhyb3cgbmV3IEVycm9yKFwiU2F2ZWQgZ2FtZSBkb2Vzbid0IG1hdGNoIHRoaXMgc3RvcnkgZmlsZVwiKTtcclxuXHRcdFx0ICB9XHJcblx0XHRcdCAgLy8gbG9hZCB0aGUgc3RhY2tcclxuXHRcdFx0ICBsZXQgbmV3U3RhY2sgPSBxdWV0emFsLmdldENodW5rKFwiU3Rrc1wiKTtcclxuXHRcdFx0ICBpZiAoIW5ld1N0YWNrKXtcclxuXHRcdFx0XHQgIHRocm93IG5ldyBFcnJvcihcIk1pc3NpbmcgU3RrcyBibG9ja1wiKTtcclxuXHRcdFx0ICB9XHJcblx0XHRcdCAgdGhpcy5zdGFjay5idWZmZXIuc2V0KG5ldyBVaW50OEFycmF5KG5ld1N0YWNrKSk7XHJcblx0XHRcdCAgdGhpcy5TUCA9IG5ld1N0YWNrLmJ5dGVMZW5ndGg7XHJcblx0XHRcdCAgLy8gcmVzdG9yZSBSQU1cclxuXHRcdFx0ICBpbWFnZS5yZXN0b3JlRnJvbVF1ZXR6YWwocXVldHphbCk7XHJcblx0XHRcdCBcclxuXHRcdFx0ICAvLyBwb3AgYSBjYWxsIHN0dWIgdG8gcmVzdG9yZSByZWdpc3RlcnNcclxuXHRcdFx0ICBsZXQgc3R1YiA9IHRoaXMucG9wQ2FsbFN0dWIoKTtcclxuXHRcdFx0ICB0aGlzLlBDID0gc3R1Yi5QQztcclxuXHRcdFx0ICB0aGlzLkZQID0gc3R1Yi5mcmFtZVB0cjtcclxuXHRcdFx0ICB0aGlzLmZyYW1lTGVuID0gdGhpcy5zdGFjay5yZWFkSW50MzIodGhpcy5GUCk7XHJcblx0XHRcdCAgdGhpcy5sb2NhbHNQb3MgPSB0aGlzLnN0YWNrLnJlYWRJbnQzMih0aGlzLkZQICsgNCk7XHJcblx0XHRcdCAgdGhpcy5leGVjTW9kZSA9IEV4ZWN1dGlvbk1vZGUuQ29kZTtcclxuXHRcdFx0ICBcclxuXHRcdFx0ICAvLyByZXN0b3JlIHRoZSBoZWFwIGlmIGF2YWlsYWJsZVxyXG5cdFx0XHQgIGxldCBoZWFwQ2h1bmsgPSBxdWV0emFsLmdldENodW5rKFwiTUFsbFwiKTtcclxuXHRcdFx0ICBpZiAoaGVhcENodW5rKXtcclxuXHRcdFx0XHQgIHRoaXMuaGVhcCA9IEhlYXBBbGxvY2F0b3IucmVzdG9yZShoZWFwQ2h1bmssIGltYWdlWydtZW1vcnknXSk7XHJcblx0XHRcdCAgfVxyXG5cdFx0XHQgIC8vIGdpdmUgdGhlIG9yaWdpbmFsIHNhdmUgb3Bjb2RlIGEgcmVzdWx0IG9mIC0xXHJcblx0XHRcdCAgLy8gdG8gc2hvdyB0aGF0IGl0J3MgYmVlbiByZXN0b3JlZFxyXG5cdFx0XHQgIHRoaXMucGVyZm9ybURlbGF5ZWRTdG9yZShzdHViLmRlc3RUeXBlLCBzdHViLmRlc3RBZGRyLCAweEZGRkZGRkZGKTtcclxuXHRcdCAgfVxyXG5cdFx0ICBcclxuXHRcdCAgXHJcblxyXG4gICAgICAgICAvKiogIFJlbG9hZHMgdGhlIGluaXRpYWwgY29udGVudHMgb2YgbWVtb3J5IChleGNlcHQgdGhlIHByb3RlY3RlZCBhcmVhKVxyXG4gICAgICAgICAqIGFuZCBzdGFydHMgdGhlIGdhbWUgb3ZlciBmcm9tIHRoZSB0b3Agb2YgdGhlIG1haW4gZnVuY3Rpb24uXHJcblx0XHQgKi9cclxuXHRcdCAgcmVzdGFydCgpe1xyXG5cdFx0XHQgIHRoaXMuaW1hZ2UucmV2ZXJ0KHRoaXMucHJvdGVjdGlvblN0YXJ0LCB0aGlzLnByb3RlY3Rpb25MZW5ndGgpO1xyXG5cdFx0XHQgIHRoaXMuYm9vdHN0cmFwKCk7XHJcblx0XHQgIH1cclxuXHRcdCAgXHJcblx0XHQgIGZ5cmVDYWxsKGNhbGwsIHgsIHkpIDogYW55e1xyXG5cdFx0XHQgIGlmICghdGhpcy5lbmFibGVGeXJlVk0pXHJcblx0XHRcdCAgXHR0aHJvdyBuZXcgRXJyb3IoYEZ5cmVWTSBmdW5jdGlvbmFsaXR5IGhhcyBiZWVuIGRpc2FibGVkYCk7XHJcblx0XHRcdCAgc3dpdGNoKGNhbGwpe1xyXG5cdFx0XHRcdCAgY2FzZSBGeXJlQ2FsbC5SZWFkTGluZTpcclxuXHRcdFx0XHQgIFx0dGhpcy5kZWxpdmVyT3V0cHV0KCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5pbnB1dExpbmUoeCwgeSk7XHJcblx0XHRcdFx0ICBjYXNlIEZ5cmVDYWxsLlJlYWRLZXk6XHJcblx0XHRcdFx0ICBcdHRoaXMuZGVsaXZlck91dHB1dCgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuaW5wdXRDaGFyKCk7XHJcblx0XHRcdFx0ICBjYXNlIEZ5cmVDYWxsLlRvTG93ZXI6XHJcblx0XHRcdFx0ICBcdHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHVpbnQ4KHgpKS50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoMCk7XHJcblx0XHRcdFx0ICBjYXNlIEZ5cmVDYWxsLlRvVXBwZXI6XHJcblx0XHRcdFx0ICBcdHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHVpbnQ4KHgpKS50b1VwcGVyQ2FzZSgpLmNoYXJDb2RlQXQoMCk7XHJcblx0XHRcdFx0ICBjYXNlIEZ5cmVDYWxsLkNoYW5uZWw6XHJcblx0XHRcdFx0ICAgIHggPSB0b0FTQ0lJKHgpO1xyXG5cdFx0XHRcdCAgICB0aGlzLm91dHB1dEJ1ZmZlci5zZXRDaGFubmVsKHgpO1xyXG5cdFx0XHRcdCAgXHRyZXR1cm47XHJcblx0XHRcdFx0ICBjYXNlIEZ5cmVDYWxsLlNldFZlbmVlcjpcclxuXHRcdFx0XHQgIFx0ICByZXR1cm4gc2V0U2xvdEZ5cmUuY2FsbCh0aGlzLCB4LCB5KSA/IDE6IDA7XHJcblx0XHRcdFx0ICBjYXNlIEZ5cmVDYWxsLlNldFN0eWxlOlxyXG5cdFx0XHRcdCAgXHQvLyBpZ25vcmVcclxuXHRcdFx0XHRcdHJldHVybiAxO1xyXG5cdFx0XHRcdCAgY2FzZSBGeXJlQ2FsbC5YTUxGaWx0ZXI6XHJcblx0XHRcdFx0ICBcdC8vIGlnbm9yZVxyXG5cdFx0XHRcdFx0cmV0dXJuIDE7XHJcblx0XHRcdFx0ICBkZWZhdWx0OlxyXG5cdFx0XHRcdCAgXHR0aHJvdyBuZXcgRXJyb3IoYFVucmVjb2duaXplZCBGeXJlVk0gc3lzdGVtIGNhbGwgJHtjYWxsfSgke3h9LCR7eX0pYCk7XHQgIFxyXG5cdFx0XHQgIH1cclxuXHRcdCAgfVxyXG5cclxuXHRcdCAgcHJpdmF0ZSBpbnB1dExpbmUoYWRkcmVzczogbnVtYmVyLCBidWZTaXplOiBudW1iZXIpIDogc3RyaW5ne1xyXG5cdFx0XHRcdC8vIHdlIG5lZWQgYXQgbGVhc3QgNCBieXRlcyB0byBkbyBhbnl0aGluZyB1c2VmdWxcclxuXHRcdFx0XHRpZiAoYnVmU2l6ZSA8IDQpe1xyXG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKFwiYnVmZmVyIHNpemUgJHtidWZTaXplfSB0byBzbWFsbCB0byBpbnB1dCBsaW5lXCIpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQge2ltYWdlfSA9IHRoaXM7XHJcblx0XHRcdFx0bGV0IHJlc3VtZSA9IHRoaXMucmVzdW1lQWZ0ZXJXYWl0LmJpbmQodGhpcyk7XHJcblx0XHRcdFx0Ly8gY2FuJ3QgZG8gYW55dGhpbmcgd2l0aG91dCB0aGlzIGV2ZW50IGhhbmRsZXJcclxuICAgICAgICAgICBcdFx0aWYgKCF0aGlzLmxpbmVXYW50ZWQpe1xyXG5cdFx0XHRcdFx0dGhpcy5pbWFnZS53cml0ZUludDMyKGFkZHJlc3MsIDApO1x0ICAgXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIGFzayB0aGUgYXBwbGljYXRpb24gdG8gcmVhZCBhIGxpbmVcclxuXHRcdFx0XHRsZXQgY2FsbGJhY2sgPSBmdW5jdGlvbihsaW5lOnN0cmluZyl7XHJcblx0XHRcdFx0XHRpZiAobGluZSAmJiBsaW5lLmxlbmd0aCl7XHJcblx0XHRcdFx0XHRcdC8vIFRPRE8/IGhhbmRsZSBVbmljb2RlXHJcblx0XHRcdFx0XHRcdC8vIHdyaXRlIHRoZSBsZW5ndGggZmlyc3RcclxuXHRcdFx0XHRcdFx0aW1hZ2Uud3JpdGVJbnQzMihhZGRyZXNzLCBsaW5lLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRcdC8vIGZvbGxvd2VkIGJ5IHRoZSBjaGFyYWN0ZXIgZGF0YSwgdHJ1bmNhdGVkIHRvIGZpdCB0aGUgYnVmZmVyXHJcbiAgICAgICAgICAgICBcdFx0ICAgXHRpbWFnZS53cml0ZUFTQ0lJKGFkZHJlc3MgKyA0LCBsaW5lLCBidWZTaXplIC0gNCk7ICBcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRpbWFnZS53cml0ZUludDMyKGFkZHJlc3MsIDApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmVzdW1lKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMubGluZVdhbnRlZChjYWxsYmFjayk7XHJcblx0XHRcdFx0cmV0dXJuICd3YWl0JzsgICBcclxuXHRcdCAgfVxyXG5cdFx0ICBcclxuXHRcdCAgcHJpdmF0ZSBpbnB1dENoYXIoKTphbnl7XHJcblx0XHRcdCAgLy8gY2FuJ3QgZG8gYW55dGhpbmcgd2l0aG91dCB0aGlzIGV2ZW50IGhhbmRsZXJcclxuICAgICAgICAgICBcdCAgaWYgKCF0aGlzLmtleVdhbnRlZCl7XHJcblx0XHRcdFx0IHJldHVybiAwO1xyXG5cdFx0XHQgIH1cclxuXHRcdFx0ICBsZXQgcmVzdW1lID0gdGhpcy5yZXN1bWVBZnRlcldhaXQuYmluZCh0aGlzKTtcclxuXHRcdFx0ICBcclxuXHRcdFx0ICAvLyBhc2sgdGhlIGFwcGxpY2F0aW9uIHRvIHJlYWQgYSBjaGFyYWN0ZXJcclxuXHRcdFx0ICBsZXQgY2FsbGJhY2sgPSBmdW5jdGlvbihsaW5lOnN0cmluZyl7XHJcblx0XHRcdFx0XHRpZiAobGluZSAmJiBsaW5lLmxlbmd0aCl7XHJcblx0XHRcdFx0XHRcdHJlc3VtZShbbGluZS5jaGFyQ29kZUF0KDApXSk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0cmVzdW1lKFswXSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQgIHRoaXMua2V5V2FudGVkKGNhbGxiYWNrKTtcclxuXHRcdFx0ICByZXR1cm4gJ3dhaXQnOyAgIFx0XHJcblx0XHQgIH1cclxuXHRcdCAgXHJcblx0XHQgIHByaXZhdGUgcmVzdW1lQWZ0ZXJXYWl0X3Jlc3VsdFR5cGVzIDogbnVtYmVyW107XHJcblx0XHQgIHByaXZhdGUgcmVzdW1lQWZ0ZXJXYWl0X3Jlc3VsdEFkZHJzIDogbnVtYmVyW107XHJcblx0XHQgIFxyXG5cdFx0ICBwcml2YXRlIHJlc3VtZUFmdGVyV2FpdChyZXN1bHQ/OiBudW1iZXJbXSl7XHJcblx0XHRcdCAgdGhpcy5jeWNsZSA9IDA7XHJcblx0XHRcdCAgdGhpcy5zdGFydFRpbWUgPSBEYXRlLm5vdygpO1xyXG5cdFx0XHQgIGlmIChyZXN1bHQpe1xyXG5cdFx0XHRcdCAgdGhpcy5zdG9yZVJlc3VsdHMobnVsbCwgdGhpcy5yZXN1bWVBZnRlcldhaXRfcmVzdWx0VHlwZXMsIHRoaXMucmVzdW1lQWZ0ZXJXYWl0X3Jlc3VsdEFkZHJzLCByZXN1bHQgKTtcclxuXHRcdFx0XHQgIHRoaXMucmVzdW1lQWZ0ZXJXYWl0X3Jlc3VsdEFkZHJzID0gdGhpcy5yZXN1bWVBZnRlcldhaXRfcmVzdWx0VHlwZXMgPSBudWxsO1xyXG5cdFx0XHQgIH1cclxuXHRcdFx0ICBcclxuXHRcdFx0ICB3aGlsZSAodGhpcy5ydW5uaW5nKXtcclxuXHRcdFx0XHQgIGlmKCB0aGlzLnN0ZXAoKSA9PT0gJ3dhaXQnKVxyXG5cdFx0XHRcdCAgXHQgIHJldHVybjtcclxuXHRcdFx0ICB9XHJcblx0XHRcdCAgXHJcblx0XHRcdCAgLy8gc2VuZCBhbnkgb3V0cHV0IHRoYXQgbWF5IGJlIGxlZnRcclxuXHRcdFx0ICB0aGlzLmRlbGl2ZXJPdXRwdXQoKTtcclxuXHRcdCAgfVxyXG5cclxuXHR9XHJcblx0XHRcclxufSIsIi8vIFdyaXR0ZW4gaW4gMjAxNSBhbmQgMjAxNiBieSBUaGlsbyBQbGFueiBcclxuLy8gVG8gdGhlIGV4dGVudCBwb3NzaWJsZSB1bmRlciBsYXcsIEkgaGF2ZSBkZWRpY2F0ZWQgYWxsIGNvcHlyaWdodCBhbmQgcmVsYXRlZCBhbmQgbmVpZ2hib3JpbmcgcmlnaHRzIFxyXG4vLyB0byB0aGlzIHNvZnR3YXJlIHRvIHRoZSBwdWJsaWMgZG9tYWluIHdvcmxkd2lkZS4gVGhpcyBzb2Z0d2FyZSBpcyBkaXN0cmlidXRlZCB3aXRob3V0IGFueSB3YXJyYW50eS4gXHJcbi8vIGh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL3B1YmxpY2RvbWFpbi96ZXJvLzEuMC9cclxuXHJcbi8qKlxyXG4gKiBBIHdyYXBwZXIgYXJvdW5kIEVuZ2luZSB0aGF0IGNhbiBiZSBjb21tdW5pY2F0ZXNcclxuICogdmlhIHNpbXBsZSBKU09OLXNlcmlhbGl6YWJsZSBtZXNzYWdlcy5cclxuICogXHJcbiAqL1xyXG5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD0nRW5naW5lLnRzJyAvPlxyXG5tb2R1bGUgRnlyZVZNe1xyXG4gICAgXHJcblx0ZXhwb3J0IGNvbnN0IGVudW0gRW5naW5lU3RhdGUge1xyXG5cdFx0bG9hZGVkID0gMSxcclxuXHRcdHJ1bm5pbmcgPSAyLFxyXG5cdFx0Y29tcGxldGVkID0gMTAwLFxyXG5cdFx0ZXJyb3IgPSAtMTAwLFxyXG5cdFxyXG5cdFx0d2FpdGluZ0ZvckxpbmVJbnB1dCA9IDUxLFxyXG5cdFx0d2FpdGluZ0ZvcktleUlucHV0ID0gNTIsXHJcblx0XHR3YWl0aW5nRm9yR2FtZVNhdmVkQ29uZmlybWF0aW9uID0gNTMsXHJcblx0XHR3YWl0aW5nRm9yTG9hZFNhdmVHYW1lID0gNTRcdFxyXG5cdH1cclxuXHRcclxuXHRleHBvcnQgaW50ZXJmYWNlIEVuZ2luZVdyYXBwZXJTdGF0ZSB7XHJcblx0XHRzdGF0ZTogRW5naW5lU3RhdGUsXHJcblx0XHRjaGFubmVsRGF0YT86IENoYW5uZWxEYXRhLFxyXG5cdFx0ZXJyb3JNZXNzYWdlPzogc3RyaW5nLFxyXG4gICAgICAgIGdhbWVCZWluZ1NhdmVkPzogUXVldHphbFxyXG5cdH1cclxuXHRcclxuXHRleHBvcnQgY2xhc3MgRW5naW5lV3JhcHBlcntcclxuXHJcblx0XHRwcml2YXRlIGVuZ2luZTogRW5naW5lXHJcbiAgICAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBjYW5TYXZlR2FtZXMgOiBib29sZWFuXHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoZ2FtZUltYWdlOiBNZW1vcnlBY2Nlc3MsIGNhblNhdmVHYW1lczogYm9vbGVhbiA9IGZhbHNlKXtcclxuICAgICAgICAgICAgdGhpcy5jYW5TYXZlR2FtZXMgPSBjYW5TYXZlR2FtZXNcclxuICAgICAgICAgICAgbGV0IGVuZ2luZSA9IHRoaXMuZW5naW5lID0gbmV3IEVuZ2luZShuZXcgVWx4SW1hZ2UoZ2FtZUltYWdlKSlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIHNldCB1cCB0aGUgY2FsbGJhY2tzXHJcbiAgICAgICAgICAgIGVuZ2luZS5vdXRwdXRSZWFkeSA9IFxyXG4gICAgICAgICAgICAgICAgKGNoYW5uZWxEYXRhKSA9PiB7IFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbm5lbERhdGEgPSBjaGFubmVsRGF0YSBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgZW5naW5lLmtleVdhbnRlZCA9XHJcbiAgICAgICAgICAgICAgICAoY2IpID0+IHRoaXMud2FpdFN0YXRlKGNiLCBFbmdpbmVTdGF0ZS53YWl0aW5nRm9yS2V5SW5wdXQpXHJcbiAgICAgICAgICAgIGVuZ2luZS5saW5lV2FudGVkID1cclxuICAgICAgICAgICAgICAgIChjYikgPT4gdGhpcy53YWl0U3RhdGUoY2IsIEVuZ2luZVN0YXRlLndhaXRpbmdGb3JMaW5lSW5wdXQpXHJcbiAgICAgICAgICAgIGVuZ2luZS5zYXZlUmVxdWVzdGVkID1cclxuICAgICAgICAgICAgICAgIChxdWV0emFsLCBjYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5jYW5TYXZlR2FtZXMpIHsgcmV0dXJuIGNiKGZhbHNlKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2FpdFN0YXRlKGNiLCBFbmdpbmVTdGF0ZS53YWl0aW5nRm9yR2FtZVNhdmVkQ29uZmlybWF0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZUJlaW5nU2F2ZWQgPSBxdWV0emFsICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgIGVuZ2luZS5sb2FkUmVxdWVzdGVkID1cclxuICAgICAgICAgICAgICAgIChjYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY2FuU2F2ZUdhbWVzKSB7IHJldHVybiBjYihudWxsKTsgfSBcclxuICAgICAgICAgICAgICAgICAgICAgdGhpcy53YWl0U3RhdGUoY2IsIEVuZ2luZVN0YXRlLndhaXRpbmdGb3JMb2FkU2F2ZUdhbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvKiogXHJcbiAgICAgICAgICogY29udmVuaWVuY2UgbWV0aG9kIHRvIGNvbnN0cnVjdCBmcm9tIGFuIEFycmF5QnVmZmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGxvYWRGcm9tQXJyYXlCdWZmZXIoYXJyYXlCdWZmZXI6IEFycmF5QnVmZmVyLCBjYW5TYXZlR2FtZXM6IGJvb2xlYW4gPSBmYWxzZSkgOiBFbmdpbmVXcmFwcGVyIHtcclxuICAgICAgICAgICAgbGV0IGltYWdlID0gbmV3IEZ5cmVWTS5NZW1vcnlBY2Nlc3MoMCwwKVxyXG4gICAgICAgICAgICBpbWFnZS5idWZmZXIgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcilcclxuXHRcdCAgICBpbWFnZVsnbWF4U2l6ZSddID0gYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aFxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEVuZ2luZVdyYXBwZXIoaW1hZ2UsIGNhblNhdmVHYW1lcylcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29udmVuaWVuY2UgbWV0aG9kIHRvIGNvbnN0cnVjdCBmcm9tIGEgRmlsZVJlYWRlckV2ZW50XHJcbiAgICAgICAgICogKHdoaWNoIGlzIHN1cHBvc2VkIHRvIGhhdmUgYmVlbiBzdWNjZXNzZnVsKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXRpYyBsb2FkRnJvbUZpbGVSZWFkZXJFdmVudChldiwgY2FuU2F2ZUdhbWVzOiBib29sZWFuID0gZmFsc2UpIDogRW5naW5lV3JhcHBlciB7XHJcbiAgICAgICAgICAgIHJldHVybiBFbmdpbmVXcmFwcGVyLmxvYWRGcm9tQXJyYXlCdWZmZXIoZXYudGFyZ2V0WydyZXN1bHQnXSwgY2FuU2F2ZUdhbWVzKVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29udmVuaWVuY2UgbWV0aG9kIHRvIGNvbnN0cnVjdCBmcm9tIGEgQmFzZTY0IGVuY29kZWQgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGdhbWUgaW1hZ2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgbG9hZEZyb21CYXNlNjQoYmFzZTY0OiBzdHJpbmcsIGNhblNhdmVHYW1lczogYm9vbGVhbiA9IGZhbHNlKSA6IEVuZ2luZVdyYXBwZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gRW5naW5lV3JhcHBlci5sb2FkRnJvbUFycmF5QnVmZmVyKEJhc2U2NC50b0J5dGVBcnJheShiYXNlNjQpLmJ1ZmZlciwgY2FuU2F2ZUdhbWVzKVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAvLyB3aGVuIHRoZSBlbmdpbmUgcmV0dXJucyBmcm9tIHByb2Nlc3NpbmdcclxuICAgICAgICAvLyAoYmVjYXVzZSBpdCBpcyB3YWl0aW5nIGZvciBtb3JlIGlucHV0KVxyXG4gICAgICAgIC8vIGl0IHdpbGwgaGF2ZSBpbnZva2VkIG9uZSBvZiBzZXZlcmFsIGNhbGxiYWNrc1xyXG4gICAgICAgIC8vIHdlIHVzZSB0aGVzZSB0byBjYWxjdWxhdGUgdGhlIEVuZ2luZVN0YXRlXHJcbiAgICAgICAgLy8gYW5kIHN0b3JlIHRoZSBjYWxsYmFjayB1c2VkIHRvIHJlc3VtZSBwcm9jZXNzaW5nXHJcbiAgICAgICAgXHJcbiAgICBcdHByaXZhdGUgcmVzdW1lQ2FsbGJhY2s7XHJcbiAgICBcclxuXHRcdHByaXZhdGUgZW5naW5lU3RhdGU6IEVuZ2luZVN0YXRlO1xyXG5cdCAgICBcclxuICAgICAgICBwcml2YXRlIGNoYW5uZWxEYXRhOiBDaGFubmVsRGF0YTtcclxuICAgICAgICBcclxuICAgICAgICBwcml2YXRlIGdhbWVCZWluZ1NhdmVkOiBRdWV0emFsO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHByaXZhdGUgd2FpdFN0YXRlKHJlc3VtZUNhbGxiYWNrLCBzdGF0ZTogRW5naW5lU3RhdGUpe1xyXG4gICAgICAgICAgICB0aGlzLnJlc3VtZUNhbGxiYWNrID0gcmVzdW1lQ2FsbGJhY2tcclxuICAgICAgICAgICAgdGhpcy5lbmdpbmVTdGF0ZSA9IHN0YXRlXHJcbiAgICAgICAgfVxyXG5cdFx0XHJcblx0XHRcclxuXHRcdHJ1bigpIDogRW5naW5lV3JhcHBlclN0YXRle1xyXG5cdFx0XHR0aGlzLmVuZ2luZVN0YXRlPUVuZ2luZVN0YXRlLnJ1bm5pbmc7XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lLnJ1bigpO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUoKTtcclxuXHRcdH1cclxuICAgICAgICBcclxuICAgICAgICBwcml2YXRlIGN1cnJlbnRTdGF0ZSgpIDogRW5naW5lV3JhcHBlclN0YXRlIHtcclxuICAgICAgICAgICAgLy8gY2hlY2sgaWYgdGhlIGdhbWUgaXMgb3ZlclxyXG4gICAgICAgICAgICBpZiAodGhpcy5lbmdpbmVTdGF0ZSA9PT0gRW5naW5lU3RhdGUucnVubmluZ1xyXG4gICAgICAgICAgICAgICYmICEgdGhpcy5lbmdpbmVbJ3J1bm5pbmcnXSApe1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmVuZ2luZVN0YXRlID0gRW5naW5lU3RhdGUuY29tcGxldGVkO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHN3aXRjaCh0aGlzLmVuZ2luZVN0YXRlKXtcclxuICAgICAgICAgICAgICAgIGNhc2UgRW5naW5lU3RhdGUuY29tcGxldGVkOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBFbmdpbmVTdGF0ZS53YWl0aW5nRm9yS2V5SW5wdXQ6XHJcbiAgICAgICAgICAgICAgICBjYXNlIEVuZ2luZVN0YXRlLndhaXRpbmdGb3JMaW5lSW5wdXQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGU6IHRoaXMuZW5naW5lU3RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5uZWxEYXRhOiB0aGlzLmNoYW5uZWxEYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgRW5naW5lU3RhdGUud2FpdGluZ0ZvckdhbWVTYXZlZENvbmZpcm1hdGlvbjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZTogdGhpcy5lbmdpbmVTdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZUJlaW5nU2F2ZWQ6IHRoaXMuZ2FtZUJlaW5nU2F2ZWRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIEVuZ2luZVN0YXRlLndhaXRpbmdGb3JMb2FkU2F2ZUdhbWU6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGU6IHRoaXMuZW5naW5lU3RhdGVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFVuZXhwZWN0ZWQgZW5naW5lIHN0YXRlOiAke3RoaXMuZW5naW5lU3RhdGV9YClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZTogdGhpcy5lbmdpbmVTdGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHRcdFxyXG5cdFx0cmVjZWl2ZUxpbmUobGluZTogc3RyaW5nKSA6IEVuZ2luZVdyYXBwZXJTdGF0ZXtcclxuXHRcdFx0aWYgKHRoaXMuZW5naW5lU3RhdGUgIT09IEVuZ2luZVN0YXRlLndhaXRpbmdGb3JMaW5lSW5wdXQpXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSWxsZWdhbCBzdGF0ZSwgZW5naW5lIGlzIG5vdCB3YWl0aW5nIGZvciBsaW5lIGlucHV0XCIpO1xyXG5cdFx0XHR0aGlzLmVuZ2luZVN0YXRlID0gRW5naW5lU3RhdGUucnVubmluZztcclxuXHRcdFx0dGhpcy5yZXN1bWVDYWxsYmFjayhsaW5lKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmVjZWl2ZUtleShsaW5lOiBzdHJpbmcpIDogRW5naW5lV3JhcHBlclN0YXRle1xyXG5cdFx0XHRpZiAodGhpcy5lbmdpbmVTdGF0ZSAhPT0gRW5naW5lU3RhdGUud2FpdGluZ0ZvcktleUlucHV0KVxyXG5cdFx0XHQgICAgdGhyb3cgbmV3IEVycm9yKFwiSWxsZWdhbCBzdGF0ZSwgZW5naW5lIGlzIG5vdCB3YWl0aW5nIGZvciBrZXkgaW5wdXRcIik7XHJcblxyXG5cdFx0XHR0aGlzLmVuZ2luZVN0YXRlID0gRW5naW5lU3RhdGUucnVubmluZztcclxuXHRcdFx0dGhpcy5yZXN1bWVDYWxsYmFjayhsaW5lKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlKCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJlY2VpdmVTYXZlZEdhbWUocXVldHphbDogUXVldHphbCk6IEVuZ2luZVdyYXBwZXJTdGF0ZXtcclxuXHRcdFx0aWYgKHRoaXMuZW5naW5lU3RhdGUgIT09IEVuZ2luZVN0YXRlLndhaXRpbmdGb3JMb2FkU2F2ZUdhbWUpXHJcblx0XHRcdCAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIHN0YXRlLCBlbmdpbmUgaXMgbm90IHdhaXRpbmcgZm9yIGEgc2F2ZWQgZ2FtZSB0byBiZSBsb2FkZWRcIik7XHJcblx0XHRcdFx0XHJcblx0XHRcdHRoaXMuZW5naW5lU3RhdGUgPSBFbmdpbmVTdGF0ZS5ydW5uaW5nO1xyXG5cdFx0XHR0aGlzLnJlc3VtZUNhbGxiYWNrKHF1ZXR6YWwpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0c2F2ZUdhbWVEb25lKHN1Y2Nlc3M6IGJvb2xlYW4pIDogRW5naW5lV3JhcHBlclN0YXRle1xyXG5cdFx0XHRpZiAodGhpcy5lbmdpbmVTdGF0ZSAhPT0gRW5naW5lU3RhdGUud2FpdGluZ0ZvckdhbWVTYXZlZENvbmZpcm1hdGlvbilcclxuXHRcdFx0ICAgIHRocm93IG5ldyBFcnJvcihcIklsbGVnYWwgc3RhdGUsIGVuZ2luZSBpcyBub3Qgd2FpdGluZyBmb3IgYSBnYW1lIHRvIGJlIHNhdmVkXCIpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR0aGlzLmdhbWVCZWluZ1NhdmVkID0gbnVsbDtcclxuXHRcdFx0dGhpcy5lbmdpbmVTdGF0ZSA9IEVuZ2luZVN0YXRlLnJ1bm5pbmc7XHJcblx0XHRcdHRoaXMucmVzdW1lQ2FsbGJhY2soc3VjY2Vzcyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGdldElGaGQoKTogVWludDhBcnJheXtcclxuXHRcdCAgICByZXR1cm4gdGhpcy5lbmdpbmVbJ2ltYWdlJ11bJ21lbW9yeSddLmNvcHkoMCwgMTI4KS5idWZmZXI7XHJcblx0XHR9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0VW5kb1N0YXRlKCkgOiBRdWV0emFsIHtcclxuICAgICAgICAgICAgbGV0IHVuZG9CdWZmZXJzID0gdGhpcy5lbmdpbmVbJ3VuZG9CdWZmZXJzJ107XHJcbiAgICAgICAgICAgIGlmICh1bmRvQnVmZmVycyAmJiB1bmRvQnVmZmVyc1t1bmRvQnVmZmVycy5sZW5ndGgtMV0pe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZG9CdWZmZXJzW3VuZG9CdWZmZXJzLmxlbmd0aC0xXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29udmVuaWVuY2UgbWV0aG9kIHRvIHJ1biBcInJlc3RvcmVcIiBhbmQgdGhlblxyXG4gICAgICAgICAqIGZlZWQgaXQgdGhlIGdpdmVuIHNhdmVnYW1lXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmVzdG9yZVNhdmVHYW1lKHF1ZXR6YWw6IFF1ZXR6YWwpIDogRW5naW5lV3JhcHBlclN0YXRle1xyXG4gICAgICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLnJlY2VpdmVMaW5lKFwicmVzdG9yZVwiKVxyXG4gICAgICAgICAgICBpZiAoc3RhdGUuc3RhdGUgIT09IEVuZ2luZVN0YXRlLndhaXRpbmdGb3JMb2FkU2F2ZUdhbWUpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIHN0YXRlLCBlbmdpbmUgZGlkIG5vdCByZXNwb25kIHRvIFJFU1RPUkUgY29tbWFuZFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVjZWl2ZVNhdmVkR2FtZShxdWV0emFsKVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb252ZW5pZW5jZSBtZXRob2QgdG8gcnVuIFwic2F2ZVwiXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2F2ZUdhbWUoKSA6IFF1ZXR6YWwge1xyXG4gICAgICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLnJlY2VpdmVMaW5lKFwic2F2ZVwiKVxyXG4gICAgICAgICAgICBpZiAoc3RhdGUuc3RhdGUgIT09IEVuZ2luZVN0YXRlLndhaXRpbmdGb3JHYW1lU2F2ZWRDb25maXJtYXRpb24pXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIHN0YXRlLCBlbmdpbmUgZGlkIG5vdCByZXNwb25kIHRvIFNBVkUgY29tbWFuZFwiKTtcclxuICAgICAgICAgICAgbGV0IGdhbWUgPSBzdGF0ZS5nYW1lQmVpbmdTYXZlZFxyXG4gICAgICAgICAgICB0aGlzLnNhdmVHYW1lRG9uZSh0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm4gZ2FtZVxyXG4gICAgICAgIH1cclxuXHR9XHJcbn0iLCIvKlxyXG4gRnlyZVZNV2ViLnRzXHJcblxyXG4gTWFpbiBNb2R1bGUgdG8gcnVuIEZ5cmVWTSB3ZWIgZW5naW5lIChnbHVseC10eXBlc2NyaXB0KS5cclxuXHJcbiBFeHBvc2VzIE91dHB1dFJlYWR5IGV2ZW50IGZvciB3ZWIgcGFnZSB0byBnZXQgZGF0YS5cclxuIEV4cG9zZXMgc2VuZENvbW1hbmQgZnVuY3Rpb24gZm9yIHdlYiBwYWdlcyB0byBleGVjdXRlIGNvbW1hbmQuXHJcblxyXG4gKi9cclxuXHJcbiAvLy8gPHJlZmVyZW5jZSBwYXRoPSdnbHVseC10eXBlc2NyaXB0L2NvcmUvRW5naW5lV3JhcHBlci50cycgLz5cclxuXHJcbnZhciBmeXJldm0gPSB7fTtcclxuXHJcbmZ1bmN0aW9uIGlzRW50ZXJLZXkoZSkge1xyXG4gICAgcmV0dXJuIGUuY29kZSA9PSBcIkVudGVyXCI7XHJcbn1cclxuZXhwb3J0IG1vZHVsZSBGeXJlVk1XZWIge1xyXG5cclxuICAgIGV4cG9ydCBlbnVtIFN0YXRlcyB7XHJcbiAgICAgICAgSU5JVCxcclxuICAgICAgICBSRVNUT1JFX1NFU1NJT04sXHJcbiAgICAgICAgTkVXX1NFU1NJT04sXHJcbiAgICAgICAgV0FJVElOR19GT1JfS0VZLFxyXG4gICAgICAgIFdBSVRJTkdfRk9SX0xJTkUsXHJcbiAgICAgICAgQ09NTUFORCxcclxuICAgICAgICBTQVZFLFxyXG4gICAgICAgIFVQREFURV9TRVNTSU9OXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGVudW0gU3RvcnlTdGF0dXMge1xyXG4gICAgICAgIENPTlRJTlVFLFxyXG4gICAgICAgIEVOREVEXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIE1hbmFnZXIge1xyXG5cclxuICAgICAgICBDaGFubmVsRGF0YTogRnlyZVZNLkNoYW5uZWxEYXRhO1xyXG4gICAgICAgIFN0YXRlOiBTdGF0ZXM7XHJcbiAgICAgICAgU3RhdHVzOiBTdG9yeVN0YXR1cztcclxuICAgICAgICBPdXRwdXRSZWFkeTogKCkgPT4gdm9pZDtcclxuICAgICAgICBJbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHByaXZhdGUgd3JhcHBlcjogRnlyZVZNLkVuZ2luZVdyYXBwZXI7XHJcbiAgICAgICAgcHJpdmF0ZSBjb250ZW50RGVmaW5pdGlvbjogc3RyaW5nW107XHJcbiAgICAgICAgcHJpdmF0ZSBpZmlkOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIHByaXZhdGUgU2V0U3RhdGUoc3RhdGU6IFN0YXRlcykge1xyXG4gICAgICAgICAgICB0aGlzLlN0YXRlID0gc3RhdGU7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2goc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGVzLklOSVQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Jbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFN0YXRlcy5ORVdfU0VTU0lPTjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLk5ld1Nlc3Npb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGVzLlJFU1RPUkVfU0VTU0lPTjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlJlc3RvcmVTZXNzaW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFN0YXRlcy5XQUlUSU5HX0ZPUl9MSU5FOlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZXMuQ09NTUFORDpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlNlbmRDb21tYW5kKHRoaXMuSW5wdXRFbGVtZW50LnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGVzLlNBVkU6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TYXZlR2FtZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgTG9hZFN0b3J5KHVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLklucHV0RWxlbWVudCA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiRnlyZVZNLk1hbmFnZXIuSW5wdXRFbGVtZW50IG11c3QgYmUgZGVmaW5lZCBiZWZvcmUgbG9hZGluZyBhIHN0b3J5LlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLklucHV0RWxlbWVudC5vbmtleXByZXNzID0gKGUpPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuU3RhdGUgPT0gU3RhdGVzLldBSVRJTkdfRk9SX0tFWSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuU2V0U3RhdGUoU3RhdGVzLkNPTU1BTkQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLlN0YXRlID09IFN0YXRlcy5XQUlUSU5HX0ZPUl9MSU5FKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMyB8fCBpc0VudGVyS2V5KGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2V0U3RhdGUoU3RhdGVzLkNPTU1BTkQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciByZWFkZXIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgcmVhZGVyLm9wZW4oJ0dFVCcsIHVybCk7XHJcbiAgICAgICAgICAgIHJlYWRlci5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xyXG4gICAgICAgICAgICByZWFkZXIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlYWRlci5yZWFkeVN0YXRlID09PSBYTUxIdHRwUmVxdWVzdC5ET05FKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53cmFwcGVyID0gRnlyZVZNLkVuZ2luZVdyYXBwZXIubG9hZEZyb21BcnJheUJ1ZmZlcihyZWFkZXIucmVzcG9uc2UsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBydW4gPSB0aGlzLndyYXBwZXIucnVuKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Qcm9jZXNzUmVzdWx0KHJ1bik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZXRTdGF0ZShTdGF0ZXMuSU5JVCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVhZGVyLnNlbmQoKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBHZXRTYXZlRGF0YSgpIHtcclxuICAgICAgICAgICAgbGV0IHNhdmVLZXkgPSB0aGlzLlNhdmVLZXkoKTtcclxuICAgICAgICAgICAgbGV0IHNhdmVEYXRhID0gbG9jYWxTdG9yYWdlW3NhdmVLZXldO1xyXG4gICAgICAgICAgICBpZiAoc2F2ZURhdGEpIHsgc2F2ZURhdGEgPSBKU09OLnBhcnNlKHNhdmVEYXRhKTsgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2F2ZURhdGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIEluaXQoKSB7XHJcbiAgICAgICAgICAgIGxldCBzYXZlRGF0YSA9IHRoaXMuR2V0U2F2ZURhdGEoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghc2F2ZURhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuU2V0U3RhdGUoU3RhdGVzLk5FV19TRVNTSU9OKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuU2V0U3RhdGUoU3RhdGVzLlJFU1RPUkVfU0VTU0lPTik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgTmV3U2Vzc2lvbigpIHtcclxuICAgICAgICAgICAgbGV0IHNhdmVLZXkgPSB0aGlzLlNhdmVLZXkoKTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlW3NhdmVLZXldID0gSlNPTi5zdHJpbmdpZnkodGhpcy5OZXdTYXZlR2FtZSgpKTtcclxuICAgICAgICAgICAgdGhpcy5VcGRhdGVUdXJuRGF0YSgpO1xyXG4gICAgICAgICAgICB0aGlzLk91dHB1dFJlYWR5KCk7XHJcbiAgICAgICAgICAgIHRoaXMuU2V0U3RhdGUoU3RhdGVzLldBSVRJTkdfRk9SX0xJTkUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBSZXN0b3JlU2Vzc2lvbigpIHtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMud3JhcHBlci5yZWNlaXZlTGluZSgncmVzdG9yZScpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnN0YXRlICE9IEZ5cmVWTS5FbmdpbmVTdGF0ZS53YWl0aW5nRm9yTG9hZFNhdmVHYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciByZXN0b3Jpbmcgc2F2ZWQgZ2FtZScsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuTG9hZFNhdmVkR2FtZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGF0ZSAhPSBGeXJlVk0uRW5naW5lU3RhdGUud2FpdGluZ0ZvckxpbmVJbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgcmVzdG9yaW5nIHNhdmVkIGdhbWUnLCByZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLlNldFN0YXRlKFN0YXRlcy5XQUlUSU5HX0ZPUl9MSU5FKTtcclxuICAgICAgICAgICAgdGhpcy5VcGRhdGVUdXJuRGF0YSgpO1xyXG4gICAgICAgICAgICB0aGlzLk91dHB1dFJlYWR5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgUHJvY2Vzc1Jlc3VsdChyZXN1bHQ6IEZ5cmVWTS5FbmdpbmVXcmFwcGVyU3RhdGUpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5jaGFubmVsRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5DaGFubmVsRGF0YSA9IHJlc3VsdC5jaGFubmVsRGF0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLlVwZGF0ZUNvbnRlbnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgU2VuZENvbW1hbmQoY29tbWFuZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuVXBkYXRlQ29tbWFuZChjb21tYW5kKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY29tbWFuZCk7XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSB0aGlzLndyYXBwZXIucmVjZWl2ZUxpbmUoY29tbWFuZCk7XHJcbiAgICAgICAgICAgIHRoaXMuUHJvY2Vzc0NvbW1hbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBQcm9jZXNzQ29tbWFuZChyZXN1bHQ6IEZ5cmVWTS5FbmdpbmVXcmFwcGVyU3RhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy5TdGF0dXMgPSBGeXJlVk1XZWIuU3RvcnlTdGF0dXMuQ09OVElOVUU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLlByb2Nlc3NSZXN1bHQocmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLlN0YXRlID09IFN0YXRlcy5DT01NQU5EKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlVwZGF0ZVN0b3J5KHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlVwZGF0ZVR1cm5EYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLk91dHB1dFJlYWR5KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKHJlc3VsdC5zdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBGeXJlVk0uRW5naW5lU3RhdGUud2FpdGluZ0ZvcktleUlucHV0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLlN0YXRlID09IFN0YXRlcy5DT01NQU5EKSB7IHRoaXMuU2V0U3RhdGUoU3RhdGVzLlNBVkUpOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7IHRoaXMuU2V0U3RhdGUoU3RhdGVzLldBSVRJTkdfRk9SX0tFWSk7IH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgRnlyZVZNLkVuZ2luZVN0YXRlLndhaXRpbmdGb3JMaW5lSW5wdXQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuU3RhdGUgPT0gU3RhdGVzLkNPTU1BTkQpIHsgdGhpcy5TZXRTdGF0ZShTdGF0ZXMuU0FWRSk7IH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHsgdGhpcy5TZXRTdGF0ZShTdGF0ZXMuV0FJVElOR19GT1JfTElORSk7IH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgRnlyZVZNLkVuZ2luZVN0YXRlLmNvbXBsZXRlZDpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlN0YXR1cyA9IEZ5cmVWTVdlYi5TdG9yeVN0YXR1cy5FTkRFRDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgRnlyZVZNLkVuZ2luZVN0YXRlLndhaXRpbmdGb3JMb2FkU2F2ZUdhbWU6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Mb2FkU2F2ZWRHYW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEZ5cmVWTS5FbmdpbmVTdGF0ZS53YWl0aW5nRm9yR2FtZVNhdmVkQ29uZmlybWF0aW9uOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuVXBkYXRlU2F2ZWRHYW1lKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgTmV3U2F2ZUdhbWUoKSB7XHJcbiAgICAgICAgICAgIGxldCBzdG9yeUluZm8gPSBKU09OLnBhcnNlKHRoaXMuQ2hhbm5lbERhdGFbJ0lORk8nXSk7XHJcbiAgICAgICAgICAgIGxldCBpZmlkID0gdGhpcy5HZXRJRklEKCk7XHJcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gYDxiPlRpdGxlOiA8L2I+JHtzdG9yeUluZm9bJ3N0b3J5VGl0bGUnXX08YnIvPlxyXG4gICAgICAgICAgICAgICAgPGI+SGVhZGxpbmU6IDwvYj4ke3N0b3J5SW5mb1snc3RvcnlIZWFkbGluZSddfWA7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc3Rvcnk6IHtcclxuICAgICAgICAgICAgICAgICAgICAnaWZpZCc6IGlmaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3RpdGxlJzogc3RvcnlJbmZvWydzdG9yeVRpdGxlJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgJ3N0b3J5SW5mbyc6IHN0b3J5SW5mbyxcclxuICAgICAgICAgICAgICAgICAgICAnc3RvcnlGaWxlJzogJydcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnc2Vzc2lvbnMnOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnc2Vzc2lvbic6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd0dXJucyc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb250ZW50JzogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyAndHVybic6IDEsICdjb21tYW5kJzogJycsICdjb250ZW50JzogY29udGVudCB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhJzogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIFNhdmVHYW1lKCkge1xyXG4gICAgICAgICAgICB0aGlzLlByb2Nlc3NDb21tYW5kKHRoaXMud3JhcHBlci5yZWNlaXZlTGluZSgnc2F2ZScpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgTG9hZFNhdmVkR2FtZSgpIHtcclxuICAgICAgICAgICAgbGV0IHNhdmVEYXRhID0gdGhpcy5HZXRTYXZlRGF0YSgpO1xyXG4gICAgICAgICAgICBsZXQgdHVybnMgPSBzYXZlRGF0YVsnc2Vzc2lvbnMnXVswXVsndHVybnMnXTtcclxuICAgICAgICAgICAgbGV0IHNhdmVHYW1lRGF0YSA9IHNhdmVEYXRhWydzZXNzaW9ucyddWzBdWydkYXRhJ11bdHVybnNdWydkYXRhJ107XHJcbiAgICAgICAgICAgIGxldCBxdWV0emFsRGF0YSA9IEZ5cmVWTS5RdWV0emFsLmxvYWQoQmFzZTY0LnRvQnl0ZUFycmF5KHNhdmVHYW1lRGF0YSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy53cmFwcGVyLnJlY2VpdmVTYXZlZEdhbWUocXVldHphbERhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBVcGRhdGVTYXZlZEdhbWUocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGxldCBzYXZlS2V5ID0gdGhpcy5TYXZlS2V5KCk7XHJcbiAgICAgICAgICAgIGxldCBzYXZlRGF0YVN0ciA9IGxvY2FsU3RvcmFnZVtzYXZlS2V5XTtcclxuICAgICAgICAgICAgbGV0IHNhdmVEYXRhID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmICghc2F2ZURhdGFTdHIpIHtcclxuICAgICAgICAgICAgICAgIHNhdmVEYXRhID0gdGhpcy5OZXdTYXZlR2FtZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2F2ZURhdGEgPSBKU09OLnBhcnNlKHNhdmVEYXRhU3RyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHR1cm5zID0gc2F2ZURhdGFbJ3Nlc3Npb25zJ11bMF1bJ3R1cm5zJ107XHJcbiAgICAgICAgICAgIHNhdmVEYXRhWydzZXNzaW9ucyddWzBdWydkYXRhJ11bdHVybnNdID0ge1xyXG4gICAgICAgICAgICAgICAgJ3R1cm4nOiB0dXJucywgJ2RhdGEnOiByZXN1bHQuZ2FtZUJlaW5nU2F2ZWQuYmFzZTY0RW5jb2RlKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVtzYXZlS2V5XSA9IEpTT04uc3RyaW5naWZ5KHNhdmVEYXRhKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuUHJvY2Vzc0NvbW1hbmQodGhpcy53cmFwcGVyLnNhdmVHYW1lRG9uZSh0cnVlKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIExvYWRTZXNzaW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgc2F2ZUtleSA9IHRoaXMuU2F2ZUtleSgpO1xyXG4gICAgICAgICAgICBsZXQgc2F2ZURhdGEgPSBsb2NhbFN0b3JhZ2Vbc2F2ZUtleV07XHJcbiAgICAgICAgICAgIHNhdmVEYXRhID0gSlNPTi5wYXJzZShzYXZlRGF0YSk7XHJcbiAgICAgICAgICAgIGxldCBzZXNzaW9uID0gc2F2ZURhdGFbJ3Nlc3Npb25zJ11bMF07XHJcbiAgICAgICAgICAgIHJldHVybiBzZXNzaW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBTYXZlU2Vzc2lvbihzZXNzaW9uKSB7XHJcbiAgICAgICAgICAgIGxldCBzYXZlS2V5ID0gdGhpcy5TYXZlS2V5KCk7XHJcbiAgICAgICAgICAgIGxldCBzYXZlRGF0YSA9IGxvY2FsU3RvcmFnZVtzYXZlS2V5XTtcclxuICAgICAgICAgICAgc2F2ZURhdGEgPSBKU09OLnBhcnNlKHNhdmVEYXRhKTtcclxuICAgICAgICAgICAgc2F2ZURhdGFbJ3Nlc3Npb25zJ11bMF0gPSBzZXNzaW9uO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Vbc2F2ZUtleV0gPSBKU09OLnN0cmluZ2lmeShzYXZlRGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIFVwZGF0ZUNvbW1hbmQoY29tbWFuZCkge1xyXG4gICAgICAgICAgICBsZXQgc2Vzc2lvbiA9IHRoaXMuTG9hZFNlc3Npb24oKTtcclxuXHJcbiAgICAgICAgICAgIHNlc3Npb25bJ3R1cm5zJ10rKztcclxuXHJcbiAgICAgICAgICAgIHNlc3Npb25bJ2NvbnRlbnQnXS5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHR1cm46IHNlc3Npb25bJ3R1cm5zJ10sXHJcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBjb21tYW5kLFxyXG4gICAgICAgICAgICAgICAgY29udGVudDogJydcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLlNhdmVTZXNzaW9uKHNlc3Npb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBVcGRhdGVTdG9yeShyZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5jaGFubmVsRGF0YSAmJiByZXN1bHQuY2hhbm5lbERhdGFbJ01BSU4nXSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSByZXN1bHQuY2hhbm5lbERhdGFbJ01BSU4nXTtcclxuICAgICAgICAgICAgICAgIGxldCBzZXNzaW9uID0gdGhpcy5Mb2FkU2Vzc2lvbigpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHR1cm4gPSBzZXNzaW9uWyd0dXJucyddO1xyXG4gICAgICAgICAgICAgICAgc2Vzc2lvblsnY29udGVudCddW3R1cm4tMV1bJ2NvbnRlbnQnXSA9IGNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlNhdmVTZXNzaW9uKHNlc3Npb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIFVwZGF0ZVR1cm5EYXRhKCkge1xyXG4gICAgICAgICAgICBsZXQgc2F2ZUtleSA9IHRoaXMuU2F2ZUtleSgpO1xyXG4gICAgICAgICAgICBsZXQgc2F2ZURhdGEgPSBsb2NhbFN0b3JhZ2Vbc2F2ZUtleV07XHJcbiAgICAgICAgICAgIGlmICghc2F2ZURhdGEpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgICAgIHNhdmVEYXRhID0gSlNPTi5wYXJzZShzYXZlRGF0YSk7XHJcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gc2F2ZURhdGFbJ3Nlc3Npb25zJ11bMF1bJ2NvbnRlbnQnXTtcclxuICAgICAgICAgICAgZnlyZXZtWydjb250ZW50J10gPSBjb250ZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBTYXZlS2V5KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5HZXRJRklEKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIEdldElGSUQoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pZmlkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlmaWQgPSB0aGlzLkNoYW5uZWxEYXRhWydJRklEJ10ucmVwbGFjZSgvXFwvL2csICcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pZmlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBHZXRDaGFubmVsTmFtZSh4Om51bWJlcil7XHJcbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKFxyXG4gICAgICAgICAgICAgICAgeCA+PiAyNCxcclxuICAgICAgICAgICAgICAgICh4ID4+IDE2KSAmIDB4RkYsXHJcbiAgICAgICAgICAgICAgICAoeCA+PiA4KSAmIDB4RkYsXHJcbiAgICAgICAgICAgICAgICB4ICYgMHhGRik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIFVwZGF0ZUNvbnRlbnQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkNoYW5uZWxEYXRhW1wiQ01HVFwiXSAhPSB1bmRlZmluZWQgfHwgdGhpcy5jb250ZW50RGVmaW5pdGlvbiAhPSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gV2Ugb25seSBnZXQgdGhlIGNvbnRlbnQgZGVmaW5pdGlvbiBvbiBmaXJzdCB0dXJuLi4uIChtYXkgbmVlZCB0byByZXZpc2l0IHRoaXMpXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudERlZmluaXRpb24gPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50RGVmaW5pdGlvbiA9IEpTT04ucGFyc2UodGhpcy5DaGFubmVsRGF0YVtcIkNNR1RcIl0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGNoYW5uZWxOYW1lIGluIHRoaXMuQ2hhbm5lbERhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgY2g9MDsgY2ggPCB0aGlzLmNvbnRlbnREZWZpbml0aW9uLmxlbmd0aDsgY2grKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hhbm5lbERlZiA9IHRoaXMuY29udGVudERlZmluaXRpb25bY2hdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hhbk5hbWUgPSB0aGlzLkdldENoYW5uZWxOYW1lKGNoYW5uZWxEZWZbJ2lkJ10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hhbk5hbWUgPT0gY2hhbm5lbE5hbWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNoYW5uZWxEZWZbJ2NvbnRlbnRUeXBlJ10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwidGV4dFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeXJldm1bY2hhbm5lbERlZlsnY29udGVudE5hbWUnXV0gPSB0aGlzLkNoYW5uZWxEYXRhW2NoYW5uZWxOYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeXJldm1bY2hhbm5lbERlZlsnY29udGVudE5hbWUnXV0gPSBOdW1iZXIodGhpcy5DaGFubmVsRGF0YVtjaGFubmVsTmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwianNvblwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeXJldm1bY2hhbm5lbERlZlsnY29udGVudE5hbWUnXV0gPSBKU09OLnBhcnNlKHRoaXMuQ2hhbm5lbERhdGFbY2hhbm5lbE5hbWVdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImNzc1wiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmeXJldm1bY2hhbm5lbERlZlsnY29udGVudE5hbWUnXV0gPSB0aGlzLkNoYW5uZWxEYXRhW2NoYW5uZWxOYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19