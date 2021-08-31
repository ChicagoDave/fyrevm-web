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
/// <reference path='glulx-typescript/core/EngineWrapper.ts' />
var fyrevm = {};
function isEnterKey(e) {
    return e.code == "Enter";
}
var FyreVMWeb;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnlyZVZNV2ViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vZ2x1bHgtdHlwZXNjcmlwdC9tZXJzZW5uZS10d2lzdGVyLnRzIiwiLi4vZ2x1bHgtdHlwZXNjcmlwdC9jb3JlL0dsa1dyYXBwZXIudHMiLCIuLi9nbHVseC10eXBlc2NyaXB0L2NvcmUvVmVuZWVyLnRzIiwiLi4vZ2x1bHgtdHlwZXNjcmlwdC9jb3JlL09wY29kZXMudHMiLCIuLi9nbHVseC10eXBlc2NyaXB0L2NvcmUvT3V0cHV0LnRzIiwiLi4vZ2x1bHgtdHlwZXNjcmlwdC9jb3JlL01lbW9yeUFjY2Vzcy50cyIsIi4uL2dsdWx4LXR5cGVzY3JpcHQvY29yZS9VbHhJbWFnZS50cyIsIi4uL2dsdWx4LXR5cGVzY3JpcHQvYjY0LnRzIiwiLi4vZ2x1bHgtdHlwZXNjcmlwdC9jb3JlL1F1ZXR6YWwudHMiLCIuLi9nbHVseC10eXBlc2NyaXB0L2NvcmUvRW5naW5lLnRzIiwiLi4vZ2x1bHgtdHlwZXNjcmlwdC9jb3JlL0VuZ2luZVdyYXBwZXIudHMiLCIuLi9GeXJlVk1XZWIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQTs7OztHQUlHO0FBRUg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQXFCRTtBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQXlDRTtBQUVGO0lBWUMseUJBQVksSUFBWTtRQVZ4Qix1QkFBdUI7UUFDZixNQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ1IsTUFBQyxHQUFHLEdBQUcsQ0FBQztRQUNSLGFBQVEsR0FBRyxVQUFVLENBQUMsQ0FBRyx1QkFBdUI7UUFDaEQsZUFBVSxHQUFHLFVBQVUsQ0FBQyxDQUFDLCtCQUErQjtRQUN4RCxlQUFVLEdBQUcsVUFBVSxDQUFDLENBQUMsOEJBQThCO1FBRXZELE9BQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQ0FBb0M7UUFDNUQs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QUFJLENBQUMsQ0FBQyxFQUFFO2dCQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7YUFBRTtZQUN2RCxJQUFJLENBQUMsSUFBRSxVQUFVO2dCQUFFLENBQUMsR0FBQyxDQUFDLENBQUM7U0FDeEI7UUFDRCxLQUFLLENBQUMsR0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDO2tCQUMxRyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0I7WUFDdkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxnQ0FBZ0M7WUFDbkQsQ0FBQyxFQUFFLENBQUM7WUFDSixJQUFJLENBQUMsSUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFO2dCQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUFDLENBQUMsR0FBQyxDQUFD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QUFDLENBQUM7Z0JBQ2QsT0FBTyxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUFBLENBQUMsQ0FBQyxDQUFDO1lBRXJDLDREQUE0RDtZQUM1RCxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUMxQixTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFHLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFDO1lBRTlELDREQUE0RDtZQUM1RCxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN6QixTQUFTLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFHLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFDO1lBRTdELDREQUE0RDtZQUM1RCxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUMxQixTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFHLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFDO1lBRTlELDZEQUE2RDtZQUM3RCxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUMxQixTQUFTLE1BQU0sQ0FBQyxDQUFDLElBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQztnQkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFD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QUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDeEIsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVO2dCQUM1QixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDeEIsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVO2dCQUM1QixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDeEIsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVO2dCQUM1QixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBRUYsNERBQTREO1lBQzVELE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3pCLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVTtnQkFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQztvQkFDUixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBRUYsNERBQTREO1lBQzVELE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3pCLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVTtnQkFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBRUYsNERBQTREO1lBQzVELE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3pCLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVTtnQkFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQztvQkFDUixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBRUYsNERBQTREO1lBQzVELE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3pCLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVTtnQkFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FDRCxDQUFDO1lBR0YsTUFBTSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDN0IsU0FBUyxPQUFPLENBQUMsT0FBTztnQkFDdkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUM7WUFDbkIsQ0FBQyxDQUNELENBQUM7WUFFRixNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN4QixTQUFTLElBQUksQ0FBQyxPQUFjLEVBQUUsSUFBVyxFQUFFLFFBQWUsRUFBRSxRQUFlO2dCQUMxRSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ2QsT0FBTSxJQUFJLEVBQUUsRUFBQztvQkFDWixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO2lCQUNyQjtnQkFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDOUQsQ0FBQyx1QkFFRCxDQUFBO1lBRUQsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDMUIsU0FBUyxLQUFLLENBQUMsT0FBYyxFQUFFLFFBQWUsRUFBRSxRQUFlO2dCQUM5RCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDOUQsQ0FBQyx1QkFFRCxDQUFBO1lBRUQsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDM0IsU0FBUyxNQUFNLENBQUMsT0FBYyxFQUFFLEdBQVcsRUFBRSxRQUFlLEVBQUUsUUFBZTtnQkFDNUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN2RSxDQUFDLHVCQUVELENBQUE7WUFFRCxNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUM1QixTQUFTLE9BQU8sQ0FBQyxPQUFjLEVBQUUsSUFBWSxFQUFFLElBQVksRUFBRSxRQUFlLEVBQUUsUUFBZTtnQkFDNUYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEYsQ0FBQyx1QkFFRCxDQUFBO1lBRUQsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDN0IsU0FBUyxRQUFRLENBQUMsT0FBYyxFQUFFLElBQVksRUFBRSxJQUFZLEVBQUUsSUFBWSxFQUFFLFFBQWUsRUFBRSxRQUFlO2dCQUMzRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEcsQ0FBQyx1QkFFRCxDQUFBO1lBRUQsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDMUIsU0FBUyxPQUFPLENBQUMsTUFBYTtnQkFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNwQyxDQUFDLENBQUMsQ0FBQTtZQUVILE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3pCLFNBQVMsTUFBTSxDQUFDLFFBQWUsRUFBRSxRQUFlLEVBQUUsT0FBYztnQkFDL0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN2RCw2REFBNkQ7Z0JBQ3JELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDL0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUN6QixDQUFDLGdCQUVELENBQUE7WUFFRCxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN6QixTQUFTLE1BQU0sQ0FBQyxFQUFFLEVBQUUsVUFBVTtnQkFDN0IsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEVBQUU7b0JBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztnQkFDdEQsc0RBQXNEO2dCQUN0RCxJQUFJLENBQUMsRUFBRSxHQUFHLFVBQVUsQ0FBQztnQkFFckIsd0JBQXdCO2dCQUN4QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQzlCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUVuRCwyREFBMkQ7Z0JBQzNELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFNUQsQ0FBQyxDQUNELENBQUE7WUFFRCxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUM1QixTQUFTLFFBQVEsQ0FBQyxPQUFlLEVBQUUsSUFBWTtnQkFDOUMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNkLE9BQU0sSUFBSSxFQUFFLEVBQUM7b0JBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztpQkFDdEI7Z0JBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hELENBQUMsQ0FBQyxDQUFDO1lBRUosTUFBTSxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDOUIsVUFBUyxJQUFJLEVBQUUsS0FBSztnQkFDbkIsT0FBQSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQyxDQUFDO1lBRUosTUFBTSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDL0IsVUFBUyxJQUFJLEVBQUUsS0FBSztnQkFDbkIsT0FBQSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVDLENBQUMsQ0FBQyxDQUFDO1lBRUosTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDeEIsU0FBUyxJQUFJLENBQUMsQ0FBUTtnQkFDckIsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsQ0FBQyxDQUFDLENBQUM7WUFFSixNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN6QixTQUFTLEtBQUssQ0FBQyxDQUFRO2dCQUN0QixPQUFPLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDbkIsQ0FBQyx3QkFBMkIsQ0FBQztZQUU5QixNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN6QixTQUFTLEtBQUssQ0FBQyxDQUFRO2dCQUN0QixPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDakIsQ0FBQyx1QkFBMEIsQ0FBQztZQUU3QixNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN4QixTQUFTLElBQUksQ0FBQyxDQUFRO2dCQUNyQixPQUFPLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUM7WUFDN0QsQ0FBQyxDQUFDLENBQUM7WUFFSixNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN4QixTQUFTLElBQUksQ0FBQyxDQUFRO2dCQUNyQixPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUM7WUFDM0QsQ0FBQyxDQUFDLENBQUM7WUFFSixNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUN6QixTQUFTLEtBQUssQ0FBQyxLQUFhLEVBQUUsS0FBYTtnQkFDMUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFDLENBQUMsR0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1lBRUosTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDMUIsU0FBUyxNQUFNLENBQUMsS0FBYSxFQUFFLEtBQWE7Z0JBQzNDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBQyxDQUFDLEdBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNwRCxDQUFDLENBQUMsQ0FBQztZQUVKLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQzFCLFNBQVMsTUFBTSxDQUFDLEtBQWEsRUFBRSxLQUFhO2dCQUMzQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNqRCxDQUFDLENBQUMsQ0FBQztZQUVKLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQzVCLFNBQVMsUUFBUSxDQUFDLEtBQWEsRUFBRSxLQUFhO2dCQUM3QyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNyQixJQUFJLElBQUksR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7Z0JBQ3BCLElBQUksS0FBSyxJQUFJLENBQUMsRUFBQztvQkFDZCxPQUFPLElBQUksQ0FBQyxLQUFLLElBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3RCO3FCQUFJO29CQUNKLE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsS0FBSyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDL0I7Z0JBQ0QsSUFBSSxJQUFJLEdBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELE9BQU8sSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUMsQ0FBQztZQUVKLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQzFCLFNBQVMsTUFBTSxDQUFDLEtBQWEsRUFBRSxLQUFhLEVBQUUsS0FBYTtnQkFDMUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFDLENBQUMsR0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDNUQsQ0FBQyxDQUNELENBQUM7WUFFRixNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUMzQixTQUFTLE9BQU8sQ0FBQyxLQUFhLEVBQUUsS0FBYSxFQUFFLEtBQWE7Z0JBQzNELEtBQUssR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDO2dCQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxHQUFDLEtBQUssRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUUsQ0FBQztZQUNqRSxDQUFDLENBQ0QsQ0FBQztZQUVGLE1BQU0sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQzNCLFNBQVMsT0FBTyxDQUFDLEtBQWEsRUFBRSxLQUFhLEVBQUUsS0FBYTtnQkFDM0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFFLENBQUM7WUFDbkQsQ0FBQyxDQUNELENBQUM7WUFFRixNQUFNLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUM3QixTQUFTLFNBQVMsQ0FBQyxLQUFhLEVBQUUsS0FBYSxFQUFFLEtBQWE7Z0JBQzdELEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksSUFBSSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztnQkFDcEIsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFDO29CQUNkLE9BQU8sSUFBSSxDQUFDLEtBQUssSUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDdEI7cUJBQUk7b0JBQ0osT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxLQUFLLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUMvQjtnQkFDRCxJQUFJLElBQUksR0FBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDekMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFDO29CQUNmLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO2lCQUNyQjtxQkFBSTtvQkFDSixJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7aUJBQ3BCO2dCQUNELElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQ0QsQ0FBQztZQUVGLE1BQU0sQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBQSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRWxFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBQSxNQUFNLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFFeEUsTUFBTSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFaEUsTUFBTSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFaEUsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDeEIsU0FBUyxHQUFHLENBQUMsSUFBVyxFQUFFLElBQVk7Z0JBQ3JDLFFBQU8sSUFBSSxDQUFDLE9BQU8sRUFBQztvQkFDbkI7d0JBQ0MsNkNBQTZDO3dCQUM3QyxPQUFNLElBQUksRUFBRSxFQUFDOzRCQUNaLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzt5QkFDWDt3QkFDRCxPQUFPLENBQUMsQ0FBQztvQkFDVjt3QkFDRyxPQUFPLE9BQUEsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNoRDt3QkFDQyxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF1QixJQUFJLENBQUMsT0FBUyxDQUFDLENBQUM7aUJBQ3hEO1lBQ0YsQ0FBQyxDQUNELENBQUM7WUFFRixNQUFNLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUNqQyxTQUFTLFlBQVk7Z0JBQ3BCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUMzQixDQUFDLENBQ0QsQ0FBQztZQUVGLE1BQU0sQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ2pDLFNBQVMsWUFBWSxDQUFDLElBQUk7Z0JBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQzNCLENBQUMsQ0FDRCxDQUFDO1lBSUYsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDN0IsU0FBUyxRQUFRO2dCQUNoQixRQUFPLElBQUksQ0FBQyxZQUFZLEVBQUM7b0JBQ3hCLGlCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztvQkFDakMsbUJBQW9CLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDckQscUJBQXNCLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxnQkFBaUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ2pDO1lBQ0YsQ0FBQyxDQUNELENBQUM7WUFFRixNQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUM3QixTQUFTLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSTtnQkFDN0IsUUFBTyxNQUFNLEVBQUM7b0JBQ2IsS0FBSyxDQUFDO3dCQUNMLElBQUksQ0FBQyxZQUFZLGVBQWdCLENBQUM7d0JBQ2xDLE9BQU87b0JBQ1IsS0FBSyxDQUFDO3dCQUNMLElBQUksQ0FBQyxZQUFZLGlCQUFrQixDQUFDO3dCQUNwQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzt3QkFDMUIsT0FBTztvQkFDUixLQUFLLENBQUM7d0JBQ0wsSUFBSSxJQUFJLENBQUMsT0FBTyxvQkFBb0I7NEJBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQzt3QkFDN0QsSUFBSSxDQUFDLFlBQVksY0FBZSxDQUFDO3dCQUNqQyxPQUFPO29CQUNSLEtBQUssRUFBRTt3QkFDTixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVk7NEJBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQzt3QkFDckQsSUFBSSxDQUFDLFlBQVksbUJBQW9CLENBQUM7d0JBQ3RDLE9BQU87b0JBQ1I7d0JBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBOEIsTUFBUSxDQUFDLENBQUM7aUJBQ3pEO1lBQ0YsQ0FBQyxDQUNELENBQUM7WUFFRixNQUFNLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUMvQixTQUFTLFVBQVU7Z0JBQ2xCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUMvQixDQUFDLENBQ0QsQ0FBQztZQUVGLE1BQU0sQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQy9CLFNBQVMsVUFBVSxDQUFDLElBQUk7Z0JBQ3ZCLElBQUksSUFBSSxDQUFDLElBQUk7b0JBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO2dCQUN2RSxJQUFHO29CQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMzQixPQUFPLENBQUMsQ0FBQztpQkFDVDtnQkFDRCxPQUFPLENBQUMsRUFBQztvQkFDUixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQixPQUFPLENBQUMsQ0FBQztpQkFDVDtZQUVGLENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDMUIsU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU87O2dCQUM1QixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ2YsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdEIsT0FBTSxLQUFLLEVBQUUsRUFBQztvQkFDYixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNkO2dCQUNELENBQUEsS0FBQSxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsVUFBVSwwQkFBQyxPQUFPLEdBQUssS0FBSyxHQUFFO1lBQzFDLENBQUMsQ0FDRCxDQUFDO1lBR0YsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDMUIsU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFOztnQkFDN0IsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNkLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBQyxJQUFJLEdBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFDO29CQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2xDO2dCQUNELENBQUEsS0FBQSxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsVUFBVSwwQkFBQyxFQUFFLEdBQUssSUFBSSxHQUFFO1lBQ3BDLENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDM0IsU0FBUyxNQUFNLENBQUMsSUFBSTtnQkFDbkIsSUFBSSxJQUFJLElBQUksQ0FBQztvQkFDWixPQUFPLENBQUMsQ0FBQztnQkFDVixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUM7b0JBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDN0I7Z0JBQ0QsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLE9BQUEsYUFBYSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFDO29CQUNYLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDaEM7Z0JBQ0QsT0FBTyxDQUFDLENBQUM7WUFDVixDQUFDLENBQ0QsQ0FBQztZQUVGLE1BQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQzFCLFNBQVMsS0FBSyxDQUFDLE9BQU87Z0JBQ3JCLElBQUksSUFBSSxDQUFDLElBQUksRUFBQztvQkFDYixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDeEIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBQzt3QkFDaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7d0JBQzFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO3FCQUNqQjtpQkFDRDtZQUVILENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBRXpELE1BQU0sQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUV6RCxNQUFNLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFFekQsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDNUIsU0FBUyxRQUFRO2dCQUNoQixPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xELENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDM0IsU0FBUyxPQUFPLENBQUMsR0FBRztnQkFDbkIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUE7Z0JBQ3JDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVE7b0JBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDcEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQ0QsQ0FBQztZQUVGLE1BQU0sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQzNCLFNBQVMsT0FBTyxDQUFDLEdBQUc7Z0JBQ25CLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7b0JBQzFDLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNuQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNkLENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDM0IsU0FBUyxPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVE7Z0JBQy9CLHVDQUF1QztnQkFDdkMsSUFBSSxLQUFLLEtBQUssQ0FBQztvQkFDZCxPQUFPO2dCQUNSLFFBQVEsSUFBSSxLQUFLLENBQUM7Z0JBQ2xCLElBQUksUUFBUSxLQUFLLENBQUM7b0JBQ2pCLE9BQU87Z0JBQ1IsK0RBQStEO2dCQUNyRCxJQUFJLFFBQVEsR0FBRyxDQUFDO29CQUN4QixRQUFRLElBQUksS0FBSyxDQUFDO2dCQUNwQixJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUUsS0FBSztvQkFDakQsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUNmLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUM7b0JBQzdCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7aUJBQ3ZCO2dCQUNELEtBQUssSUFBSSxDQUFDLEdBQUMsUUFBUSxFQUFFLENBQUMsR0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUM7b0JBQ2pDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7aUJBQ3ZCO2dCQUNELE9BQU0sS0FBSyxDQUFDLE1BQU0sRUFBQztvQkFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztpQkFDdkI7Z0JBQ0QsT0FBTSxLQUFLLENBQUMsTUFBTSxFQUFDO29CQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2lCQUN2QjtZQUNGLENBQUMsQ0FDRCxDQUFDO1lBRUYsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFDMUIsU0FBUyxPQUFPLENBQUMsS0FBSztnQkFDckIsSUFBSSxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDOUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztnQkFDNUIsT0FBTSxLQUFLLEVBQUUsRUFBQztvQkFDYixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7b0JBQ3RDLEtBQUssSUFBRyxDQUFDLENBQUM7aUJBQ1Y7WUFDRixDQUFDLENBQUMsQ0FBQztZQUVKLE1BQU0sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQzVCLFNBQVMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHO2dCQUM3QixRQUFPLFFBQVEsRUFBQztvQkFDZix5QkFBeUIsQ0FBQyxDQUFDLDBCQUFzQjtvQkFDakQsd0JBQXdCLENBQUMsQ0FBQyxvQkFBcUI7b0JBQy9DLHVCQUF1QjtvQkFDdkIscUJBQXFCO29CQUNyQixxQkFBcUI7b0JBQ3JCLG9CQUFvQjtvQkFDbkIsa0JBQWtCO29CQUNuQixzQkFBcUI7b0JBQ3JCO3dCQUNFLE9BQU8sQ0FBQyxDQUFDO29CQUNYO3dCQUNDLE9BQU8sQ0FBQyxDQUFDO29CQUNWO3dCQUNDLElBQUksR0FBRyxLQUFLLENBQUM7NEJBQUUsT0FBTyxDQUFDLENBQUMsQ0FBRSxVQUFVO3dCQUNwQyxJQUFJLEdBQUcsS0FBSyxDQUFDOzRCQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUUsU0FBUzt3QkFDbkMsSUFBSSxHQUFHLEtBQUssRUFBRSxJQUFJLElBQUksQ0FBQyxZQUFZOzRCQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsYUFBYTt3QkFDNUQsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLG9CQUFvQjs0QkFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU07d0JBQ2xFLE9BQU8sQ0FBQyxDQUFDO29CQUNWO3dCQUNDLElBQUksSUFBSSxDQUFDLElBQUk7NEJBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzt3QkFDNUMsT0FBTyxDQUFDLENBQUM7b0JBQ1Y7d0JBQ0MsT0FBTyxDQUFDLENBQUM7b0JBQ1Y7d0JBQ0MsT0FBTyxDQUFDLENBQUM7aUJBQ1Y7WUFDRixDQUFDLENBQ0QsQ0FBQztZQUdGLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3pCLFNBQVMsSUFBSSxLQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFM0MsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFekQsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDekIsU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLFFBQWUsRUFBRSxRQUFlO2dCQUNoRCxtREFBbUQ7Z0JBQ25ELElBQUksTUFBTSxHQUFXLElBQUksQ0FBQztnQkFDMUIsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFDO29CQUN4QixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDakQsSUFBSSxRQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRTdDLElBQUksUUFBUSxHQUFHLFVBQVMsT0FBZTt3QkFDdEMsSUFBSSxPQUFPLEVBQUM7NEJBQ1gsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDckQ7NkJBQUk7NEJBQ0osTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDckQ7d0JBQ0QsUUFBTSxFQUFFLENBQUM7b0JBQ1YsQ0FBQyxDQUFBO29CQUNELE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUNsQyxJQUFJLElBQUksR0FBUSxNQUFNLENBQUM7b0JBQ3ZCLE9BQU8sSUFBSSxDQUFDO2lCQUNaO2dCQUNELE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEQsQ0FBQyx1QkFFRCxDQUFBO1lBRUQsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDNUIsU0FBUyxPQUFPLENBQUMsQ0FBQyxFQUFFLFFBQWUsRUFBRSxRQUFlO2dCQUNuRCxtREFBbUQ7Z0JBQ25ELElBQUksTUFBTSxHQUFXLElBQUksQ0FBQztnQkFDMUIsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFDO29CQUN4QixJQUFJLFFBQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDN0MsSUFBSSxRQUFRLEdBQUcsVUFBUyxPQUFlO3dCQUN0QyxJQUFJLE9BQU8sRUFBQzs0QkFDWCxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUNoQyxRQUFNLEVBQUUsQ0FBQzs0QkFDVCxPQUFPO3lCQUNQO3dCQUNELE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3JELFFBQU0sRUFBRSxDQUFDO29CQUNWLENBQUMsQ0FBQTtvQkFDRCxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMvQixJQUFJLElBQUksR0FBUSxNQUFNLENBQUM7b0JBQ3ZCLE9BQU8sSUFBSSxDQUFDO2lCQUNaO2dCQUNELE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEQsQ0FBQyx1QkFFRCxDQUFBO1lBRUQsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDN0IsU0FBUyxRQUFRLENBQUMsUUFBZSxFQUFFLFFBQWU7Z0JBQ2pELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUUvQyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUM7b0JBQ3BCLHdDQUF3QztvQkFDeEMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUM7d0JBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7cUJBQzNCO29CQUNELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6QjtxQkFBSTtvQkFDSixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUUsQ0FBQyxDQUFFLENBQUM7aUJBQ3pCO2dCQUNELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xELENBQUMsdUJBQTBCLENBQUM7WUFFNUIsTUFBTSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDaEMsU0FBUyxXQUFXLENBQUMsUUFBZSxFQUFFLFFBQWU7Z0JBQ3BELElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBQztvQkFDL0MsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDL0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDeEI7cUJBQUk7b0JBQ0osSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ2hEO1lBRUYsQ0FBQyx1QkFBMEIsQ0FBQztZQUc3QixNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUM1QixTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTTtnQkFDN0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBQztvQkFDbEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7b0JBQzdCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7aUJBQy9CO1lBQ0YsQ0FBQyxDQUNELENBQUE7WUFFRCxNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUM1Qiw4REFBOEQ7WUFDOUQsK0NBQStDO1lBQy9DLDhEQUE4RDtZQUM5RCxTQUFTLE9BQU87Z0JBQ2YsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTTtvQkFBRSxPQUFPLENBQUMsQ0FBQztnQkFDMUQsT0FBTyxDQUFDLENBQUM7WUFDVixDQUFDLENBQ0QsQ0FBQTtZQUVELE1BQU0sQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2hDLGdIQUFnSDtZQUNoSCxTQUFTLFdBQVc7Z0JBQ25CLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBQztvQkFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztpQkFDdkI7WUFDRixDQUFDLENBQ0QsQ0FBQTtZQUdELE1BQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQzNCLFNBQVMsTUFBTSxDQUFDLEdBQUc7Z0JBQ2xCLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssVUFBVTtvQkFDbEMsT0FBTyxDQUFDLENBQUM7Z0JBRVYsSUFBSSxNQUFNLEdBQW9CLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQzFDLElBQUksQ0FBQyxNQUFNLEVBQUM7b0JBQ1gsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztpQkFDN0M7Z0JBQ0QsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFDO29CQUNiLE9BQU8sTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUM5QjtnQkFFRCxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUM7b0JBQ1gsT0FBUSxNQUFNLENBQUUsQ0FBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ25EO2dCQUNELE9BQU8sTUFBTSxDQUFDLGFBQWEsRUFBRSxHQUFHLEdBQUcsQ0FBQztZQUNyQyxDQUFDLENBQ0QsQ0FBQztZQUVGLE1BQU0sQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQzdCLFNBQVMsU0FBUyxDQUFDLElBQUk7Z0JBQ3RCLElBQUksQ0FBQyxJQUFJO29CQUFFLElBQUksR0FBRyxTQUFTLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUNELENBQUM7WUFFRixNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU1RCxPQUFPLE9BQU8sQ0FBQztRQUNoQixDQUFDO1FBL3VCZSxtQkFBVyxjQSt1QjFCLENBQUE7SUFDRixDQUFDLEVBanZCYSxPQUFPLEdBQVAsY0FBTyxLQUFQLGNBQU8sUUFpdkJwQjtJQVFELFNBQVMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsT0FBTztRQUMzRixJQUFJLE9BQU8sNEJBQWtDO1lBQzVDLE1BQU0sSUFBSSxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQztRQUNoRixJQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sc0JBQTRCLENBQUM7WUFDeEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO1FBQ3JGLElBQUksV0FBVyxHQUFHLE9BQU8sc0JBQTRCLENBQUM7UUFDdEQsSUFBSSxHQUFHLEdBQUUsQ0FBQyxFQUFFLElBQUksR0FBRyxVQUFVLENBQUM7UUFDOUIsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFDaEIsT0FBTyxHQUFHLEdBQUcsSUFBSSxFQUFDO1lBQ2pCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdkMsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssR0FBRyxLQUFLLEdBQUMsVUFBVSxHQUFHLFNBQVMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDOUYsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFDO2dCQUNiLFdBQVc7Z0JBQ1gsSUFBSSxXQUFXO29CQUFFLE9BQU8sS0FBSyxDQUFDO2dCQUM5QixPQUFPLEtBQUssR0FBQyxLQUFLLEdBQUMsVUFBVSxDQUFDO2FBQzlCO1lBQ0QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFDO2dCQUNYLElBQUksR0FBRyxLQUFLLENBQUM7YUFDYjtpQkFBSTtnQkFDSixHQUFHLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQzthQUNoQjtTQUNEO1FBQ0QsZUFBZTtRQUNmLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBR0QsU0FBUyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPO1FBQzNGLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxzQkFBNEIsQ0FBQztZQUN4RCxNQUFNLElBQUksS0FBSyxDQUFDLGtFQUFrRSxDQUFDLENBQUM7UUFDckYsSUFBSSxXQUFXLEdBQUcsT0FBTyxzQkFBNEIsQ0FBQztRQUN0RCxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBQztZQUN0RCxJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxHQUFHLENBQUMsR0FBQyxVQUFVLEdBQUcsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMxRixJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUM7Z0JBQ2IsV0FBVztnQkFDWCxJQUFJLFdBQVc7b0JBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQzFCLE9BQU8sS0FBSyxHQUFDLENBQUMsR0FBQyxVQUFVLENBQUM7YUFDMUI7WUFDRCxJQUFJLE9BQU8sNEJBQWtDLEVBQUM7Z0JBQzdDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxHQUFHLENBQUMsR0FBQyxVQUFVLEdBQUcsU0FBUyxFQUFFLE9BQU8sQ0FBQyxFQUFDO29CQUNuRSxNQUFNO2lCQUNOO2FBQ0Q7U0FDRDtRQUNELGVBQWU7UUFDZixPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELFNBQVMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxPQUFPO1FBQy9FLElBQUksT0FBTyxzQkFBNEI7WUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO1FBQzFFLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNqQixHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUNoQixPQUFPLElBQUksRUFBQztZQUNYLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEdBQUcsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMxRSxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUM7Z0JBQ2IsV0FBVztnQkFDWCxPQUFPLElBQUksQ0FBQzthQUNaO1lBQ0QsSUFBSSxPQUFPLDRCQUFrQyxFQUFDO2dCQUM3QyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksR0FBRyxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQUM7b0JBQ25ELE9BQU8sQ0FBQyxDQUFDO2lCQUNUO2FBQ0Q7WUFDRCx3QkFBd0I7WUFDeEIsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBQyxVQUFVLENBQUMsQ0FBQztTQUM3QztJQUNGLENBQUM7SUFFRCxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSTtRQUMvQixPQUFNLElBQUksRUFBRSxFQUFDO1lBQ1osSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDMUMsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELFNBQVMsV0FBVyxDQUFDLEtBQVksRUFBRSxhQUFxQixFQUFFLE9BQWUsRUFBRSxPQUFlO1FBQ25GLElBQUEsS0FBSyxHQUFLLElBQUksTUFBVCxDQUFVO1FBQ3JCLElBQUksT0FBTyxzQkFBNEIsRUFBQztZQUN2Qyx1QkFBdUI7WUFDZCxzREFBc0Q7WUFDOUQsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBQztnQkFDN0IsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7Z0JBQ3pDLElBQUksRUFBRSxHQUFHLEVBQUU7b0JBQ1YsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLEVBQUUsR0FBRyxFQUFFO29CQUNWLE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7WUFDRCxPQUFPLENBQUMsQ0FBQztTQUNUO1FBRUQsMkJBQTJCO1FBQ3JCLDhGQUE4RjtRQUNwRyxJQUFJLElBQUksQ0FBQztRQUNULFFBQU8sT0FBTyxFQUFDO1lBQ2QsS0FBSyxDQUFDO2dCQUNMLElBQUksR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNyQyxLQUFLLElBQUksSUFBSSxDQUFDO2dCQUNkLE9BQU8sS0FBSyxHQUFHLElBQUksQ0FBQztZQUNyQixLQUFLLENBQUM7Z0JBQ0wsSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3RDLEtBQUssSUFBSSxNQUFNLENBQUM7Z0JBQ2hCLE9BQU8sS0FBSyxHQUFHLElBQUksQ0FBQztZQUNyQixLQUFLLENBQUM7Z0JBQ0wsSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsUUFBUSxDQUFDO2dCQUNqRCxLQUFLLElBQUksUUFBUSxDQUFDO2dCQUNsQixPQUFPLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDckIsS0FBSyxDQUFDO2dCQUNMLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUN0QyxPQUFPLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDckI7SUFFRixDQUFDO0FBQ0YsQ0FBQyxFQW45Qk0sTUFBTSxLQUFOLE1BQU0sUUFtOUJaO0FDNTlCRCxrQ0FBa0M7QUFDbEMsdUdBQXVHO0FBQ3ZHLHVHQUF1RztBQUN2RyxvREFBb0Q7QUFFcEQsc0NBQXNDO0FBR3RDLElBQU8sTUFBTSxDQTRPWjtBQTVPRCxXQUFPLE1BQU07SUFjWixTQUFnQixnQkFBZ0IsQ0FBQyxDQUFTO1FBQ3pDLFFBQU8sSUFBSSxDQUFDLFlBQVksRUFBQztZQUN4QixpQkFBa0IsQ0FBQyxDQUFDLE9BQU87WUFDM0I7Z0JBQ0MsOERBQThEO2dCQUM5RCxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELE9BQU87WUFDUjtnQkFDQyxJQUFJLElBQUksQ0FBQyxPQUFPLG9CQUFvQjtvQkFDbkMsT0FBQSxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELE9BQU87U0FFUjtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQTZCLElBQUksQ0FBQyxZQUFjLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBZGUsdUJBQWdCLG1CQWMvQixDQUFBO0lBRUQsU0FBZ0Isa0JBQWtCLENBQUMsQ0FBUztRQUMzQyxRQUFPLElBQUksQ0FBQyxZQUFZLEVBQUM7WUFDeEIsaUJBQWtCLENBQUMsQ0FBQyxPQUFPO1lBQzNCO2dCQUNDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixPQUFPO1lBQ1I7Z0JBQ0MsSUFBSSxJQUFJLENBQUMsT0FBTyxvQkFBb0I7b0JBQ25DLE9BQUEsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLE9BQU87U0FDUjtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQTZCLElBQUksQ0FBQyxZQUFjLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBWmUseUJBQWtCLHFCQVlqQyxDQUFBO0lBc0JEOzs7T0FHRztJQUNILFNBQWdCLGtCQUFrQjtRQUNqQyxJQUFJLE1BQU0sR0FBVyxJQUFJLENBQUM7UUFDckIsSUFBQSxLQUFLLEdBQUksTUFBTSxNQUFWLENBQVc7UUFDckIsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSwwQkFBNkIsQ0FBQyxDQUFDO1FBRTVFLE9BQU8sSUFBSSxFQUFDO1lBQ1gsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLFFBQU8sUUFBUSxFQUFDO2dCQUNmO29CQUNDLElBQUksdUJBQXVCLENBQUMsTUFBTSxDQUFDLEVBQUM7d0JBQ25DLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVc7cUJBQzNDO3lCQUFJO3dCQUNKLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVTtxQkFDeEM7b0JBQ0QsTUFBTTtnQkFDUDtvQkFDQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNCLE9BQU87Z0JBQ1IsdUJBQTBCO2dCQUMxQjtvQkFDQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEseUJBQTRCLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDOUYsSUFBSSxJQUFJLENBQUMsWUFBWSxtQkFBb0IsRUFBQzt3QkFDekMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUUsQ0FBQyxDQUFFLDJCQUE2QixJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDcEc7eUJBQUk7d0JBQ0osZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDL0I7b0JBQ0QsT0FBTztnQkFDUjtvQkFDQyxJQUFJLElBQUksQ0FBQyxZQUFZLG1CQUFvQixFQUFDO3dCQUN6QyxJQUFJLENBQUMsWUFBWSwwQkFBNEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDbkYsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7d0JBQ2YsSUFBSSxDQUFDLFFBQVEsa0JBQXdCLENBQUM7cUJBQ3RDO3lCQUFJO3dCQUNKLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDNUQ7b0JBQ0QsT0FBTztnQkFDUiw2QkFBNkI7Z0JBQzdCO29CQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQTRDLFFBQVUsQ0FBQyxDQUFDO2FBQ3pFO1NBQ0Q7SUFDRixDQUFDO0lBekNlLHlCQUFrQixxQkF5Q2pDLENBQUE7SUFHRCxTQUFTLHVCQUF1QixDQUFDLE1BQU07UUFDdEMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFFLENBQUMsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtRQUN0RixNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdkIsSUFBSSxNQUFNLENBQUMsYUFBYSxLQUFLLENBQUMsRUFBQztZQUM5QixNQUFNLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztZQUN6QixNQUFNLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDWjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2YsQ0FBQztJQUVELFNBQWdCLGVBQWU7UUFDOUIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFDO1lBQ1osSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE9BQU87U0FDUDtRQUNELElBQUksSUFBSSxDQUFDLFlBQVksbUJBQW9CLEVBQUM7WUFDekMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsRUFBRSxDQUFDLHdCQUEyQixDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2hGO2FBQUk7WUFDSixnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNyQjtJQUNGLENBQUM7SUFYZSxzQkFBZSxrQkFXOUIsQ0FBQTtJQUVELFNBQWdCLGlCQUFpQjtRQUNoQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUM7WUFDWixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsT0FBTztTQUNQO1FBQ0QsSUFBSSxJQUFJLENBQUMsWUFBWSxtQkFBb0IsRUFBQztZQUN6QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUMsMEJBQTZCLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDbEY7YUFBSTtZQUNKLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3JCO0lBQ0YsQ0FBQztJQVplLHdCQUFpQixvQkFZaEMsQ0FBQTtJQUVELFNBQWdCLFNBQVM7UUFDeEIsSUFBSSxDQUFDLEdBQVUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNsQyxJQUFJLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBQztZQUNqQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN0QyxJQUFJLElBQUksQ0FBQyxZQUFZLG1CQUFvQixFQUFDO2dCQUN6QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLDBCQUE2QixJQUFJLENBQUMsYUFBYSxHQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDbkg7aUJBQUk7Z0JBQ0osa0JBQWtCLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzthQUNyQjtTQUNEO2FBQUk7WUFDSixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDM0I7SUFDRixDQUFDO0lBYmUsZ0JBQVMsWUFheEIsQ0FBQTtJQWtCRDtRQUFBO1lBRUMsNkJBQTZCO1lBQzdCLG9FQUFvRTtZQUNwRSw0Q0FBNEM7WUFFcEMsWUFBTyxHQUFHLE1BQU0sQ0FBQztZQUVqQixnQkFBVyxHQUFpQjtnQkFDbEMsSUFBSSxFQUFFLEVBQUU7YUFDVCxDQUFBO1FBNENGLENBQUM7UUExQ0EsaUNBQVUsR0FBVjtZQUNDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNyQixDQUFDO1FBRUQ7OztVQUdFO1FBQ0YsaUNBQVUsR0FBVixVQUFXLENBQVM7WUFDbkIsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU87Z0JBQUUsT0FBTztZQUMvQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsS0FBSyxNQUFNLEVBQUM7Z0JBQ2hCLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQ3pCO1FBQ0YsQ0FBQztRQUVEOzs7V0FHRztRQUNILDRCQUFLLEdBQUwsVUFBTSxDQUFTO1lBQ2QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFFRDs7O1dBR0c7UUFDSCw0QkFBSyxHQUFMO1lBQ00sSUFBQSxXQUFXLEdBQUksSUFBSSxZQUFSLENBQVM7WUFDekIsSUFBSSxDQUFDLEdBQWdCLEVBQUUsQ0FBQztZQUN4QixLQUFLLElBQUksQ0FBQyxJQUFJLFdBQVcsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsRUFBQztvQkFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNULFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7aUJBQ3BCO2FBQ0Q7WUFDRCxPQUFPLENBQUMsQ0FBQztRQUNWLENBQUM7UUFHRixtQkFBQztJQUFELENBQUMsQUF0REQsSUFzREM7SUF0RFksbUJBQVksZUFzRHhCLENBQUE7QUFFRixDQUFDLEVBNU9NLE1BQU0sS0FBTixNQUFNLFFBNE9aO0FDcFBELG9EQUFvRDtBQUNwRCx1R0FBdUc7QUFDdkcsdUdBQXVHO0FBQ3ZHLG9EQUFvRDtBQUVwRCxJQUFPLE1BQU0sQ0E0Vlo7QUE1VkQsV0FBTyxNQUFNO0lBRVo7O09BRUc7SUFFSDtRQUdDLG1CQUFZLE1BQWMsRUFBRSxNQUFjO1lBQ3pDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLENBQUM7UUFDRixnQkFBQztJQUFELENBQUMsQUFQRCxJQU9DO0lBRUQ7Ozs7OztPQU1HO0lBRUg7UUFVQyx1QkFBWSxXQUFtQixFQUFFLE1BQW9CO1lBUDdDLGVBQVUsR0FBRyxDQUFDLENBQUM7WUFDdEIsa0JBQWEsR0FBRyxDQUFDLENBQUE7WUFFVixXQUFNLEdBQWdCLEVBQUUsQ0FBQztZQUN6QixhQUFRLEdBQWdCLEVBQUUsQ0FBQztZQUlsQyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztZQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQztRQUMzQixDQUFDO1FBRUQ7OztXQUdHO1FBQ0YsNEJBQUksR0FBSjtZQUNDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBRTtZQUMvQixJQUFJLE1BQU0sR0FBRyxJQUFJLFlBQVksQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN2QyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN2QixJQUFBLE1BQU0sR0FBSSxJQUFJLE9BQVIsQ0FBUztZQUNwQixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFDO2dCQUN6QixNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDNUM7WUFDRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDdEIsQ0FBQztRQUVEOztXQUVHO1FBQ0cscUJBQU8sR0FBZCxVQUFlLE1BQWtCLEVBQUUsTUFBb0I7WUFDdEQsSUFBSSxDQUFDLEdBQUcsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDbEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUzQixJQUFJLEtBQUssS0FBSyxDQUFDO2dCQUNkLE9BQU8sSUFBSSxDQUFDO1lBRWIsSUFBSSxJQUFJLEdBQUcsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNyRCxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUM7Z0JBQzFCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxRQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxXQUFXLEdBQUcsS0FBSyxFQUFDO29CQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxHQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ2xFO2dCQUNELFdBQVcsR0FBRyxLQUFLLEdBQUMsUUFBTSxDQUFDO2FBQzNCO1lBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7WUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFDO2dCQUN2QyxNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUE7YUFDN0Q7WUFDRCxvQ0FBb0M7WUFDcEMsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBR0Q7OztXQUdHO1FBQ0gsNkJBQUssR0FBTCxVQUFNLElBQVk7WUFDWixJQUFBLEtBQXFCLElBQUksRUFBeEIsTUFBTSxZQUFBLEVBQUUsUUFBUSxjQUFRLENBQUM7WUFFOUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckMsd0JBQXdCO1lBQ3hCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO2dCQUNuQyxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLElBQUcsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFDO29CQUNoQyxNQUFNLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7b0JBQzdCLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUM7d0JBQ3ZCLGlDQUFpQzt3QkFDakMsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUM7d0JBQ3JCLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO3FCQUNyQjt5QkFBSTt3QkFDSixRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO3FCQUNuQjtvQkFDRCxNQUFNO2lCQUNOO2FBQ0Q7WUFDRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEVBQUM7Z0JBQ3hCLHdCQUF3QjtnQkFDeEIsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUM7b0JBQ3JFLE9BQU8sSUFBSSxDQUFDO2lCQUNaO2dCQUNELGtCQUFrQjtnQkFDbEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ25ELElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBQztvQkFDdEMsZ0JBQWdCO29CQUNoQixJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUNsRCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUM7d0JBQ3RCLGlCQUFpQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3FCQUNwRTtvQkFFRCxJQUFJLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDO3dCQUN2QyxPQUFPLElBQUksQ0FBQztxQkFDWjtpQkFDRDtnQkFFRCxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQzthQUN4QjtZQUVELDZCQUE2QjtZQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXBCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUN2QixDQUFDO1FBRU8saUNBQVMsR0FBakIsVUFBa0IsaUJBQXlCO1lBQzFDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsaUJBQWlCLENBQUM7WUFDckQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBQztnQkFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7Z0JBQ3hCLE9BQU8sSUFBSSxDQUFDO2FBQ1o7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNkLENBQUM7UUFFRCxrQ0FBVSxHQUFWO1lBQ0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUMzQixDQUFDO1FBRUQ7O1dBRUc7UUFDSCw0QkFBSSxHQUFKLFVBQUssT0FBZTtZQUNmLElBQUEsS0FBcUIsSUFBSSxFQUF4QixNQUFNLFlBQUEsRUFBRSxRQUFRLGNBQVEsQ0FBQztZQUM5QixpQkFBaUI7WUFDakIsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7Z0JBQ2pDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLE9BQU8sRUFBQztvQkFDNUIsWUFBWTtvQkFDWixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDcEIseUNBQXlDO29CQUN6QyxJQUFJLE9BQU8sR0FBQyxLQUFLLENBQUMsTUFBTSxHQUFDLElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLFVBQVUsRUFBQzt3QkFDN0QsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQzt3QkFDckMsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7NEJBQ2pDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbEIsYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3lCQUM3RDt3QkFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO3FCQUNuRDt5QkFBTTt3QkFDTix1QkFBdUI7d0JBQ3ZCLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ3JCLDJDQUEyQztxQkFDM0M7b0JBRUQsa0JBQWtCO29CQUNsQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUM7d0JBQ2hGLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUM7NEJBQ25DLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7NEJBQzVCLEtBQUksSUFBSSxHQUFDLEdBQUMsQ0FBQyxFQUFFLEdBQUMsR0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUMsRUFBRSxFQUFDO2dDQUNuQyxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBQyxDQUFDLENBQUM7Z0NBQ3hCLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksU0FBUyxFQUFDO29DQUN0QyxRQUFRLENBQUMsR0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2lDQUNuQjs2QkFDRDt5QkFDRDtxQkFDRDtvQkFFRCxPQUFPO2lCQUNQO2FBQ0Q7UUFDRixDQUFDO1FBQ0Ysb0JBQUM7SUFBRCxDQUFDLEFBN0tELElBNktDO0lBN0tZLG9CQUFhLGdCQTZLekIsQ0FBQTtJQUVEOzs7T0FHRztJQUNIO1FBTUMsc0JBQVksSUFBWSxFQUFFLE9BQVk7WUFBWix3QkFBQSxFQUFBLGNBQVk7WUFDckMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN4QixDQUFDO1FBRUQ7O1dBRUc7UUFDSCwrQkFBUSxHQUFSLFVBQVMsTUFBYztZQUN0QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUVBOzs7VUFHRTtRQUNILGdDQUFTLEdBQVQsVUFBVSxNQUFjLEVBQUUsS0FBWTtZQUNyQyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksS0FBSyxHQUFHLEdBQUc7Z0JBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUksS0FBSyxnQ0FBNkIsQ0FBQyxDQUFDO1lBQ3hELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQzdCLENBQUM7UUFFRDs7V0FFRztRQUNILGdDQUFTLEdBQVQsVUFBVSxNQUFjO1lBQ3ZCLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFFRCxtRUFBbUU7UUFDM0QsMEJBQUcsR0FBWCxVQUFZLE1BQWMsRUFBRSxLQUFVO1lBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBRUQ7OztXQUdHO1FBQ0gsaUNBQVUsR0FBVixVQUFXLE1BQWMsRUFBRSxLQUFhO1lBQ3ZDLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsTUFBTTtnQkFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBSSxLQUFLLGdDQUE2QixDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFFQTs7VUFFRTtRQUNILGdDQUFTLEdBQVQsVUFBVSxNQUFjO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxTQUFTO2tCQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPO2tCQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLO2tCQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBRUQ7OztXQUdHO1FBQ0gsaUNBQVUsR0FBVixVQUFXLE1BQWMsRUFBRSxLQUFhO1lBQ3ZDLEtBQUssR0FBRyxLQUFLLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUUsS0FBSyxJQUFJLEVBQUUsRUFBRSxLQUFLLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUN0RixDQUFDO1FBRUE7OztXQUdHO1FBQ0osZ0NBQVMsR0FBVCxVQUFVLE1BQWMsRUFBRSxNQUFjO1lBQ3ZDLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRyxNQUFNLEdBQUksSUFBSSxPQUFSLEVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNyQyxPQUFNLEdBQUcsR0FBRyxNQUFNLEVBQUM7Z0JBQ2xCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzNCLEdBQUcsRUFBRSxDQUFDO2dCQUNOLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDVjtZQUNELE9BQU8sTUFBTSxDQUFDLFlBQVksT0FBbkIsTUFBTSxFQUFpQixDQUFDLEVBQUU7UUFDbEMsQ0FBQztRQUVBOztXQUVHO1FBQ0osa0NBQVcsR0FBWCxVQUFZLE1BQWE7WUFDeEIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFHLE1BQU0sR0FBSSxJQUFJLE9BQVIsRUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3JDLE9BQU0sSUFBSSxFQUFDO2dCQUNWLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ1YsTUFBTTtnQkFDUCxHQUFHLEVBQUUsQ0FBQztnQkFDTixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ1Y7WUFDRCxPQUFPLE1BQU0sQ0FBQyxZQUFZLE9BQW5CLE1BQU0sRUFBaUIsQ0FBQyxFQUFFO1FBQ2xDLENBQUM7UUFFQTs7V0FFRztRQUNKLGlDQUFVLEdBQVYsVUFBVyxNQUFjLEVBQUUsS0FBYTtZQUN2QyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDZixLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztnQkFDakMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7YUFDL0I7WUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBRUM7O1VBRUU7UUFDSixnQ0FBUyxHQUFULFVBQVUsU0FBaUI7WUFDMUIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU87Z0JBQzNCLE9BQU8sS0FBSyxDQUFDO1lBQ2QsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBRUE7Ozs7Ozs7V0FPRztRQUNKLDJCQUFJLEdBQUosVUFBSyxNQUFjLEVBQUUsTUFBYztZQUNsQyxvQkFBb0I7WUFDcEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU87Z0JBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXNCLE1BQU0sZ0NBQTJCLElBQUksQ0FBQyxPQUFTLENBQUMsQ0FBQztZQUN4RixJQUFJLE1BQU0sR0FBRyxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxHQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0QsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQzlCLE9BQU8sTUFBTSxDQUFDO1FBQ2YsQ0FBQztRQUVBOztZQUVJO1FBQ0wsMkJBQUksR0FBSjtZQUNDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDM0IsQ0FBQztRQUVGLG1CQUFDO0lBQUQsQ0FBQyxBQS9JRCxJQStJQztJQS9JWSxtQkFBWSxlQStJeEIsQ0FBQTtBQUdGLENBQUMsRUE1Vk0sTUFBTSxLQUFOLE1BQU0sUUE0Vlo7QUNqV0Qsa0NBQWtDO0FBQ2xDLHVHQUF1RztBQUN2Ryx1R0FBdUc7QUFDdkcsb0RBQW9EO0FBRXBELHdDQUF3QztBQUV4Qzs7R0FFRztBQUVILElBQU8sTUFBTSxDQWtRWjtBQWxRRCxXQUFPLE1BQU07SUFjWCxDQUFDO0lBZ0JGO1FBTUMsa0JBQVksUUFBc0I7WUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDekIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDekIsQ0FBQztRQUVPLG1DQUFnQixHQUF4QjtZQUNDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDM0IsdURBQXVEO1lBQ3ZELElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBaUIsQ0FBQztZQUM1QyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuQyxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUM7Z0JBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQW9DLEtBQU8sQ0FBQyxDQUFDO2FBQzdEO1lBRUQsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsd0JBQXlCLENBQUM7WUFDdkQsSUFBSSxNQUFNLGdCQUFpQixFQUFDO2dCQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFrQixNQUFNLHFEQUFrRCxDQUFDLENBQUM7YUFDNUY7WUFDRCwyQkFBMkI7WUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNyQyx3QkFBd0I7WUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyx5QkFBMkIsQ0FBQztZQUM1RCxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxFQUFDO2dCQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFvQixJQUFJLENBQUMsUUFBUSx1QkFBa0IsTUFBTSxNQUFHLENBQUMsQ0FBQzthQUM5RTtRQUNGLENBQUM7UUFFRCxrQ0FBZSxHQUFmO1lBQ0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsd0JBQTBCLENBQUM7UUFDeEQsQ0FBQztRQUVELGtDQUFlLEdBQWY7WUFDQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0QsQ0FBQztRQUVELCtCQUFZLEdBQVo7WUFDQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUywyQkFBNEIsQ0FBQztRQUMxRCxDQUFDO1FBRUQsNEJBQVMsR0FBVDtZQUNDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMzQixDQUFDO1FBRUQsZ0NBQWEsR0FBYixVQUFjLGVBQXVCO1lBQ3BDLE9BQU8sSUFBSSxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSCw0QkFBUyxHQUFULFVBQVUsS0FBYTtZQUN0Qix1Q0FBdUM7WUFDdkMsSUFBSSxLQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBQztnQkFDcEIsS0FBSyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQzthQUNuQztZQUNELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxLQUFLLEVBQUM7Z0JBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ3pDO1FBQ0YsQ0FBQztRQUVELCtCQUFZLEdBQVo7WUFDQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUywyQkFBNEIsQ0FBQztRQUMxRCxDQUFDO1FBRUQsbUNBQWdCLEdBQWhCO1lBQ0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsNkJBQThCLENBQUM7UUFDNUQsQ0FBQztRQUVELGdDQUFhLEdBQWI7WUFDQyxJQUFJLE9BQU8sR0FBRyxJQUFJLE9BQUEsT0FBTyxFQUFFLENBQUM7WUFDNUIseURBQXlEO1lBQ3pELE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1RCxtRUFBbUU7WUFDMUQsOEJBQThCO1lBQ3ZDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQy9DLElBQUksSUFBSSxHQUFHLElBQUksT0FBQSxZQUFZLENBQUMsT0FBTyxHQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN0RyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEMsT0FBTyxPQUFPLENBQUM7UUFDaEIsQ0FBQztRQUVELDJCQUFRLEdBQVIsVUFBUyxPQUFlO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUVELDRCQUFTLEdBQVQsVUFBVSxPQUFlO1lBQ3hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUVELDRCQUFTLEdBQVQsVUFBVSxPQUFlO1lBQ3hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUVELDhCQUFXLEdBQVgsVUFBWSxPQUFlO1lBQzFCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUVELDZCQUFVLEdBQVYsVUFBVyxPQUFlLEVBQUUsS0FBYTtZQUN4QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUTtnQkFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBNkIsT0FBUyxDQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFFRCw2QkFBVSxHQUFWLFVBQVcsT0FBZTtZQUFFLGVBQWtCO2lCQUFsQixVQUFrQixFQUFsQixxQkFBa0IsRUFBbEIsSUFBa0I7Z0JBQWxCLDhCQUFrQjs7WUFDN0MsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVE7Z0JBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQTZCLE9BQVMsQ0FBQyxDQUFDO1lBQ3pELEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO2dCQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzNDO1FBQ0YsQ0FBQztRQUVELHdCQUFLLEdBQUwsVUFBTSxJQUFlLEVBQUUsT0FBYyxFQUFFLEtBQVk7WUFDbEQsUUFBTyxJQUFJLEVBQUM7Z0JBQ1g7b0JBQ0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ2hDLE9BQU87Z0JBQ1I7b0JBQ0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxJQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBQ2xELE9BQU87Z0JBQ1I7b0JBQ0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDakM7UUFDRixDQUFDO1FBRUQ7OztXQUdHO1FBQ0gsNkJBQVUsR0FBVixVQUFXLE9BQWUsRUFBRSxJQUFZLEVBQUUsS0FBYTtZQUN0RCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDZixLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFDO2dCQUM1QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUM7b0JBQ1gsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU07aUJBQ2Q7Z0JBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNkO1lBQ0QsSUFBSSxDQUFDLFVBQVUsT0FBZixJQUFJLGlCQUFZLE9BQU8sR0FBSyxLQUFLLEdBQUU7WUFDbkMsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ3JCLENBQUM7UUFFTSxvQkFBVyxHQUFsQixVQUFtQixNQUFtQixFQUFFLENBQWUsRUFBRSxNQUFRO1lBQVIsdUJBQUEsRUFBQSxVQUFRO1lBQ2hFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLHlCQUEyQixFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNoRSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sMEJBQTRCLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSwyQkFBNEIsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLHlCQUEwQixFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5RCxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sNEJBQTZCLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSw0QkFBNkIsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLDhCQUErQixFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN4RSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sMkJBQTRCLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25FLENBQUM7UUFHRTs7OztVQUlEO1FBQ0YseUJBQU0sR0FBTixVQUFPLGVBQWlCLEVBQUUsZ0JBQWtCO1lBQXJDLGdDQUFBLEVBQUEsbUJBQWlCO1lBQUUsaUNBQUEsRUFBQSxvQkFBa0I7WUFDM0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3BFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ3hCLElBQUksSUFBSSxFQUFDO2dCQUNSLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDWCxLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFFLEVBQUM7b0JBQ3BDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6QjtnQkFDRCxJQUFJLENBQUMsVUFBVSxPQUFmLElBQUksaUJBQVksZUFBZSxHQUFLLENBQUMsR0FBRTthQUN2QztRQUNGLENBQUM7UUFFTyxtQ0FBZ0IsR0FBeEIsVUFBeUIsZUFBZSxFQUFFLGdCQUFnQjtZQUN6RCxJQUFJLElBQUksR0FBaUIsSUFBSSxDQUFDO1lBQzlCLElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxFQUFDO2dCQUN4QixJQUFJLGVBQWUsR0FBRyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUM7b0JBQ3pELGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxlQUFlLENBQUM7aUJBQ3REO2dCQUNELHVCQUF1QjtnQkFDdkIsSUFBSSxLQUFLLEdBQUcsZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQzVDLElBQUksS0FBSyxHQUFHLENBQUMsRUFBQztvQkFDYixnQkFBZ0IsSUFBSSxLQUFLLENBQUM7b0JBQzFCLEtBQUssR0FBRyxDQUFDLENBQUM7aUJBQ1Y7Z0JBQ0QsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLENBQUM7YUFDakU7WUFDRCxPQUFPLElBQUksQ0FBQztRQUNiLENBQUM7UUFFRCxxQ0FBa0IsR0FBbEIsVUFBbUIsT0FBZ0IsRUFBRSxlQUFpQixFQUFFLGdCQUFrQjtZQUFyQyxnQ0FBQSxFQUFBLG1CQUFpQjtZQUFFLGlDQUFBLEVBQUEsb0JBQWtCO1lBQ3pFLCtCQUErQjtZQUMvQixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RDLElBQUksTUFBTSxFQUFDO2dCQUNWLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztnQkFFcEUsSUFBSSxDQUFDLEdBQUcsSUFBSSxPQUFBLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsQ0FBQyxDQUFDLE1BQU0sR0FBRSxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDakMsSUFBSSxRQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLENBQUMsR0FBQyxDQUFDLENBQUM7Z0JBQ1IsSUFBSSxDQUFDLEdBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDcEIsT0FBTSxDQUFDLEdBQUMsTUFBTSxDQUFDLFVBQVUsRUFBQztvQkFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQzVDO2dCQUVELElBQUksSUFBSSxFQUFDO29CQUNSLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDWCxLQUFJLElBQUksR0FBQyxHQUFDLENBQUMsRUFBRSxHQUFDLEdBQUMsZ0JBQWdCLEVBQUUsR0FBQyxFQUFFLEVBQUM7d0JBQ3BDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN6QjtvQkFDRCxJQUFJLENBQUMsVUFBVSxPQUFmLElBQUksaUJBQVksZUFBZSxHQUFLLENBQUMsR0FBRTtpQkFDdkM7YUFFRDtpQkFBSTtnQkFDSixNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7YUFDNUM7UUFDRixDQUFDO1FBRUYsZUFBQztJQUFELENBQUMsQUFsT0QsSUFrT0M7SUFsT1ksZUFBUSxXQWtPcEIsQ0FBQTtBQUVGLENBQUMsRUFsUU0sTUFBTSxLQUFOLE1BQU0sUUFrUVo7QUM3UUQsZ0VBQWdFO0FBRWhFLElBQU8sTUFBTSxDQTBHWjtBQTFHRCxXQUFPLE1BQU07SUFFWCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUE7SUFDZixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUE7SUFFbEIsU0FBUyxJQUFJO1FBQ1gsSUFBSSxJQUFJLEdBQUcsa0VBQWtFLENBQUE7UUFDN0UsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUMvQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ25CLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1NBQ2xDO1FBRUQsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDakMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7SUFDbkMsQ0FBQztJQUVELElBQUksRUFBRSxDQUFBO0lBRU4sU0FBZ0IsV0FBVyxDQUFDLEdBQUc7UUFDN0IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBQTtRQUNuQyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFBO1FBRXBCLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDZixNQUFNLElBQUksS0FBSyxDQUFDLGdEQUFnRCxDQUFDLENBQUE7U0FDbEU7UUFFRCw0Q0FBNEM7UUFDNUMsbUVBQW1FO1FBQ25FLHFCQUFxQjtRQUNyQiw4RUFBOEU7UUFDOUUsb0RBQW9EO1FBQ3BELFlBQVksR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFdEUsNERBQTREO1FBQzVELEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQTtRQUVoRCxzRUFBc0U7UUFDdEUsQ0FBQyxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQTtRQUVwQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7UUFFVCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4QyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNsSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUE7WUFDN0Is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QUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0NBQzlFLE1BQU07Z0NBQ1YsS0FBSyxLQUFLO29DQUNOLE1BQU0sQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29DQUNsRSxNQUFNOzZCQUNiOzRCQUVELE1BQU07eUJBQ1Q7cUJBQ0o7aUJBQ0o7YUFDSjtRQUNMLENBQUM7UUFDTCxjQUFDO0lBQUQsQ0FBQyxBQWhVRCxJQWdVQztJQWhVWSxpQkFBTyxVQWdVbkIsQ0FBQTtBQUNMLENBQUMsRUFuVk0sU0FBUyxLQUFULFNBQVMsUUFtVmYiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLypcclxuICogVHlwZVNjcmlwdCBwb3J0IGJ5IFRoaWxvIFBsYW56XHJcbiAqXHJcbiAqIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3RoaWxvcGxhbnovNmFiZjA0Zjk1NzE5N2U5ZTM5MTJcclxuICovXHJcblxyXG4vKlxyXG4gIEkndmUgd3JhcHBlZCBNYWtvdG8gTWF0c3Vtb3RvIGFuZCBUYWt1amkgTmlzaGltdXJhJ3MgY29kZSBpbiBhIG5hbWVzcGFjZVxyXG4gIHNvIGl0J3MgYmV0dGVyIGVuY2Fwc3VsYXRlZC4gTm93IHlvdSBjYW4gaGF2ZSBtdWx0aXBsZSByYW5kb20gbnVtYmVyIGdlbmVyYXRvcnNcclxuICBhbmQgdGhleSB3b24ndCBzdG9tcCBhbGwgb3ZlciBlYWNob3RoZXIncyBzdGF0ZS5cclxuICBcclxuICBJZiB5b3Ugd2FudCB0byB1c2UgdGhpcyBhcyBhIHN1YnN0aXR1dGUgZm9yIE1hdGgucmFuZG9tKCksIHVzZSB0aGUgcmFuZG9tKClcclxuICBtZXRob2QgbGlrZSBzbzpcclxuICBcclxuICB2YXIgbSA9IG5ldyBNZXJzZW5uZVR3aXN0ZXIoKTtcclxuICB2YXIgcmFuZG9tTnVtYmVyID0gbS5yYW5kb20oKTtcclxuICBcclxuICBZb3UgY2FuIGFsc28gY2FsbCB0aGUgb3RoZXIgZ2VucmFuZF97Zm9vfSgpIG1ldGhvZHMgb24gdGhlIGluc3RhbmNlLlxyXG5cclxuICBJZiB5b3Ugd2FudCB0byB1c2UgYSBzcGVjaWZpYyBzZWVkIGluIG9yZGVyIHRvIGdldCBhIHJlcGVhdGFibGUgcmFuZG9tXHJcbiAgc2VxdWVuY2UsIHBhc3MgYW4gaW50ZWdlciBpbnRvIHRoZSBjb25zdHJ1Y3RvcjpcclxuXHJcbiAgdmFyIG0gPSBuZXcgTWVyc2VubmVUd2lzdGVyKDEyMyk7XHJcblxyXG4gIGFuZCB0aGF0IHdpbGwgYWx3YXlzIHByb2R1Y2UgdGhlIHNhbWUgcmFuZG9tIHNlcXVlbmNlLlxyXG5cclxuICBTZWFuIE1jQ3VsbG91Z2ggKGJhbmtzZWFuQGdtYWlsLmNvbSlcclxuKi9cclxuXHJcbi8qIFxyXG4gICBBIEMtcHJvZ3JhbSBmb3IgTVQxOTkzNywgd2l0aCBpbml0aWFsaXphdGlvbiBpbXByb3ZlZCAyMDAyLzEvMjYuXHJcbiAgIENvZGVkIGJ5IFRha3VqaSBOaXNoaW11cmEgYW5kIE1ha290byBNYXRzdW1vdG8uXHJcbiBcclxuICAgQmVmb3JlIHVzaW5nLCBpbml0aWFsaXplIHRoZSBzdGF0ZSBieSB1c2luZyBpbml0X2dlbnJhbmQoc2VlZCkgIFxyXG4gICBvciBpbml0X2J5X2FycmF5KGluaXRfa2V5LCBrZXlfbGVuZ3RoKS5cclxuIFxyXG4gICBDb3B5cmlnaHQgKEMpIDE5OTcgLSAyMDAyLCBNYWtvdG8gTWF0c3Vtb3RvIGFuZCBUYWt1amkgTmlzaGltdXJhLFxyXG4gICBBbGwgcmlnaHRzIHJlc2VydmVkLiAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiBcclxuICAgUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XHJcbiAgIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uc1xyXG4gICBhcmUgbWV0OlxyXG4gXHJcbiAgICAgMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcclxuICAgICAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXHJcbiBcclxuICAgICAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodFxyXG4gICAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcclxuICAgICAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG4gXHJcbiAgICAgMy4gVGhlIG5hbWVzIG9mIGl0cyBjb250cmlidXRvcnMgbWF5IG5vdCBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBcclxuICAgICAgICBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gXHJcbiAgICAgICAgcGVybWlzc2lvbi5cclxuIFxyXG4gICBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXHJcbiAgIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1RcclxuICAgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SXHJcbiAgIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBPV05FUiBPUlxyXG4gICBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCxcclxuICAgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLFxyXG4gICBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1JcclxuICAgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRlxyXG4gICBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElOR1xyXG4gICBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVNcclxuICAgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXHJcbiBcclxuIFxyXG4gICBBbnkgZmVlZGJhY2sgaXMgdmVyeSB3ZWxjb21lLlxyXG4gICBodHRwOi8vd3d3Lm1hdGguc2NpLmhpcm9zaGltYS11LmFjLmpwL35tLW1hdC9NVC9lbXQuaHRtbFxyXG4gICBlbWFpbDogbS1tYXQgQCBtYXRoLnNjaS5oaXJvc2hpbWEtdS5hYy5qcCAocmVtb3ZlIHNwYWNlKVxyXG4qL1xyXG5cclxuY2xhc3MgTWVyc2VubmVUd2lzdGVye1xyXG4gXHJcbiAvKiBQZXJpb2QgcGFyYW1ldGVycyAqLyAgXHJcbiBwcml2YXRlIE4gPSA2MjQ7XHJcbiBwcml2YXRlIE0gPSAzOTc7XHJcbiBwcml2YXRlIE1BVFJJWF9BID0gMHg5OTA4YjBkZjsgICAvKiBjb25zdGFudCB2ZWN0b3IgYSAqL1xyXG4gcHJpdmF0ZSBVUFBFUl9NQVNLID0gMHg4MDAwMDAwMDsgLyogbW9zdCBzaWduaWZpY2FudCB3LXIgYml0cyAqL1xyXG4gcHJpdmF0ZSBMT1dFUl9NQVNLID0gMHg3ZmZmZmZmZjsgLyogbGVhc3Qgc2lnbmlmaWNhbnQgciBiaXRzICovXHJcbiBcclxuIHByaXZhdGUgbXQgPSBuZXcgQXJyYXkodGhpcy5OKTsgLyogdGhlIGFycmF5IGZvciB0aGUgc3RhdGUgdmVjdG9yICovXHJcbiBwcml2YXRlIG10aSA9IHRoaXMuTiArIDE7ICAvKiBtdGk9PU4rMSBtZWFucyBtdFtOXSBpcyBub3QgaW5pdGlhbGl6ZWQgKi9cclxuICBcclxuIGNvbnN0cnVjdG9yKHNlZWQ/Om51bWJlcikge1xyXG4gICAgaWYgKHNlZWQgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHNlZWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgIH0gICBcclxuICAgIHRoaXMuaW5pdF9nZW5yYW5kKHNlZWQpO1xyXG4gIH0gIFxyXG4gXHJcbiAgLyogaW5pdGlhbGl6ZXMgbXRbTl0gd2l0aCBhIHNlZWQgKi9cclxuICBwcml2YXRlIGluaXRfZ2VucmFuZChzOm51bWJlcikge1xyXG4gICAgdGhpcy5tdFswXSA9IHMgPj4+IDA7XHJcbiAgICBmb3IgKHRoaXMubXRpPTE7IHRoaXMubXRpPHRoaXMuTjsgdGhpcy5tdGkrKykge1xyXG4gICAgICAgIHMgPSB0aGlzLm10W3RoaXMubXRpLTFdIF4gKHRoaXMubXRbdGhpcy5tdGktMV0gPj4+IDMwKTtcclxuICAgICB0aGlzLm10W3RoaXMubXRpXSA9ICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxODEyNDMzMjUzKSA8PCAxNikgKyAocyAmIDB4MDAwMGZmZmYpICogMTgxMjQzMzI1MylcclxuICAgICsgdGhpcy5tdGk7XHJcbiAgICAgICAgLyogU2VlIEtudXRoIFRBT0NQIFZvbDIuIDNyZCBFZC4gUC4xMDYgZm9yIG11bHRpcGxpZXIuICovXHJcbiAgICAgICAgLyogSW4gdGhlIHByZXZpb3VzIHZlcnNpb25zLCBNU0JzIG9mIHRoZSBzZWVkIGFmZmVjdCAgICovXHJcbiAgICAgICAgLyogb25seSBNU0JzIG9mIHRoZSBhcnJheSBtdFtdLiAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgLyogMjAwMi8wMS8wOSBtb2RpZmllZCBieSBNYWtvdG8gTWF0c3Vtb3RvICAgICAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5tdFt0aGlzLm10aV0gPj4+PSAwO1xyXG4gICAgICAgIC8qIGZvciA+MzIgYml0IG1hY2hpbmVzICovXHJcbiAgICB9XHJcbiAgfVxyXG4gICBcclxuICAvKiBpbml0aWFsaXplIGJ5IGFuIGFycmF5IHdpdGggYXJyYXktbGVuZ3RoICovXHJcbiAgLyogaW5pdF9rZXkgaXMgdGhlIGFycmF5IGZvciBpbml0aWFsaXppbmcga2V5cyAqL1xyXG4gIC8qIGtleV9sZW5ndGggaXMgaXRzIGxlbmd0aCAqL1xyXG4gIC8qIHNsaWdodCBjaGFuZ2UgZm9yIEMrKywgMjAwNC8yLzI2ICovXHJcbiAgaW5pdF9ieV9hcnJheShpbml0X2tleSwga2V5X2xlbmd0aCkge1xyXG4gICAgdmFyIGksIGosIGs7XHJcbiAgICB0aGlzLmluaXRfZ2VucmFuZCgxOTY1MDIxOCk7XHJcbiAgICBpPTE7IGo9MDtcclxuICAgIGsgPSAodGhpcy5OPmtleV9sZW5ndGggPyB0aGlzLk4gOiBrZXlfbGVuZ3RoKTtcclxuICAgIGZvciAoOyBrOyBrLS0pIHtcclxuICAgICAgdmFyIHMgPSB0aGlzLm10W2ktMV0gXiAodGhpcy5tdFtpLTFdID4+PiAzMClcclxuICAgICAgdGhpcy5tdFtpXSA9ICh0aGlzLm10W2ldIF4gKCgoKChzICYgMHhmZmZmMDAwMCkgPj4+IDE2KSAqIDE2NjQ1MjUpIDw8IDE2KSArICgocyAmIDB4MDAwMGZmZmYpICogMTY2NDUyNSkpKVxyXG4gICAgICAgICsgaW5pdF9rZXlbal0gKyBqOyAvKiBub24gbGluZWFyICovXHJcbiAgICAgIHRoaXMubXRbaV0gPj4+PSAwOyAvKiBmb3IgV09SRFNJWkUgPiAzMiBtYWNoaW5lcyAqL1xyXG4gICAgICBpKys7IGorKztcclxuICAgICAgaWYgKGk+PXRoaXMuTikgeyB0aGlzLm10WzBdID0gdGhpcy5tdFt0aGlzLk4tMV07IGk9MTsgfVxyXG4gICAgICBpZiAoaj49a2V5X2xlbmd0aCkgaj0wO1xyXG4gICAgfVxyXG4gICAgZm9yIChrPXRoaXMuTi0xOyBrOyBrLS0pIHtcclxuICAgICAgdmFyIHMgPSB0aGlzLm10W2ktMV0gXiAodGhpcy5tdFtpLTFdID4+PiAzMCk7XHJcbiAgICAgIHRoaXMubXRbaV0gPSAodGhpcy5tdFtpXSBeICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxNTY2MDgzOTQxKSA8PCAxNikgKyAocyAmIDB4MDAwMGZmZmYpICogMTU2NjA4Mzk0MSkpXHJcbiAgICAgICAgLSBpOyAvKiBub24gbGluZWFyICovXHJcbiAgICAgIHRoaXMubXRbaV0gPj4+PSAwOyAvKiBmb3IgV09SRFNJWkUgPiAzMiBtYWNoaW5lcyAqL1xyXG4gICAgICBpKys7XHJcbiAgICAgIGlmIChpPj10aGlzLk4pIHsgdGhpcy5tdFswXSA9IHRoaXMubXRbdGhpcy5OLTFdOyBpPTE7IH1cclxuICAgIH1cclxuICBcclxuICAgIHRoaXMubXRbMF0gPSAweDgwMDAwMDAwOyAvKiBNU0IgaXMgMTsgYXNzdXJpbmcgbm9uLXplcm8gaW5pdGlhbCBhcnJheSAqLyBcclxuICB9XHJcbiAgIFxyXG4gIC8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMHhmZmZmZmZmZl0taW50ZXJ2YWwgKi9cclxuICBnZW5yYW5kX2ludDMyKCkge1xyXG4gICAgdmFyIHk7XHJcbiAgICB2YXIgbWFnMDEgPSBuZXcgQXJyYXkoMHgwLCB0aGlzLk1BVFJJWF9BKTtcclxuICAgIC8qIG1hZzAxW3hdID0geCAqIE1BVFJJWF9BICBmb3IgeD0wLDEgKi9cclxuICBcclxuICAgIGlmICh0aGlzLm10aSA+PSB0aGlzLk4pIHsgLyogZ2VuZXJhdGUgTiB3b3JkcyBhdCBvbmUgdGltZSAqL1xyXG4gICAgICB2YXIga2s7XHJcbiAgXHJcbiAgICAgIGlmICh0aGlzLm10aSA9PSB0aGlzLk4rMSkgICAvKiBpZiBpbml0X2dlbnJhbmQoKSBoYXMgbm90IGJlZW4gY2FsbGVkLCAqL1xyXG4gICAgICAgIHRoaXMuaW5pdF9nZW5yYW5kKDU0ODkpOyAvKiBhIGRlZmF1bHQgaW5pdGlhbCBzZWVkIGlzIHVzZWQgKi9cclxuICBcclxuICAgICAgZm9yIChraz0wO2trPHRoaXMuTi10aGlzLk07a2srKykge1xyXG4gICAgICAgIHkgPSAodGhpcy5tdFtra10mdGhpcy5VUFBFUl9NQVNLKXwodGhpcy5tdFtraysxXSZ0aGlzLkxPV0VSX01BU0spO1xyXG4gICAgICAgIHRoaXMubXRba2tdID0gdGhpcy5tdFtrayt0aGlzLk1dIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XHJcbiAgICAgIH1cclxuICAgICAgZm9yICg7a2s8dGhpcy5OLTE7a2srKykge1xyXG4gICAgICAgIHkgPSAodGhpcy5tdFtra10mdGhpcy5VUFBFUl9NQVNLKXwodGhpcy5tdFtraysxXSZ0aGlzLkxPV0VSX01BU0spO1xyXG4gICAgICAgIHRoaXMubXRba2tdID0gdGhpcy5tdFtraysodGhpcy5NLXRoaXMuTildIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XHJcbiAgICAgIH1cclxuICAgICAgeSA9ICh0aGlzLm10W3RoaXMuTi0xXSZ0aGlzLlVQUEVSX01BU0spfCh0aGlzLm10WzBdJnRoaXMuTE9XRVJfTUFTSyk7XHJcbiAgICAgIHRoaXMubXRbdGhpcy5OLTFdID0gdGhpcy5tdFt0aGlzLk0tMV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcclxuICBcclxuICAgICAgdGhpcy5tdGkgPSAwO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgeSA9IHRoaXMubXRbdGhpcy5tdGkrK107XHJcbiAgXHJcbiAgICAvKiBUZW1wZXJpbmcgKi9cclxuICAgIHkgXj0gKHkgPj4+IDExKTtcclxuICAgIHkgXj0gKHkgPDwgNykgJiAweDlkMmM1NjgwO1xyXG4gICAgeSBePSAoeSA8PCAxNSkgJiAweGVmYzYwMDAwO1xyXG4gICAgeSBePSAoeSA+Pj4gMTgpO1xyXG4gIFxyXG4gICAgcmV0dXJuIHkgPj4+IDA7XHJcbiAgfVxyXG4gICBcclxuICAvKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDB4N2ZmZmZmZmZdLWludGVydmFsICovXHJcbiAgZ2VucmFuZF9pbnQzMSgpIHtcclxuICAgIHJldHVybiAodGhpcy5nZW5yYW5kX2ludDMyKCk+Pj4xKTtcclxuICB9XHJcbiAgIFxyXG4gIC8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMV0tcmVhbC1pbnRlcnZhbCAqL1xyXG4gIGdlbnJhbmRfcmVhbDEoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZW5yYW5kX2ludDMyKCkqKDEuMC80Mjk0OTY3Mjk1LjApOyBcclxuICAgIC8qIGRpdmlkZWQgYnkgMl4zMi0xICovIFxyXG4gIH1cclxuICBcclxuICAvKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDEpLXJlYWwtaW50ZXJ2YWwgKi9cclxuICByYW5kb20oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZW5yYW5kX2ludDMyKCkqKDEuMC80Mjk0OTY3Mjk2LjApOyBcclxuICAgIC8qIGRpdmlkZWQgYnkgMl4zMiAqL1xyXG4gIH1cclxuICAgXHJcbiAgLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiAoMCwxKS1yZWFsLWludGVydmFsICovXHJcbiAgZ2VucmFuZF9yZWFsMygpIHtcclxuICAgIHJldHVybiAodGhpcy5nZW5yYW5kX2ludDMyKCkgKyAwLjUpKigxLjAvNDI5NDk2NzI5Ni4wKTsgXHJcbiAgICAvKiBkaXZpZGVkIGJ5IDJeMzIgKi9cclxuICB9XHJcbiAgIFxyXG4gIC8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMSkgd2l0aCA1My1iaXQgcmVzb2x1dGlvbiovXHJcbiAgZ2VucmFuZF9yZXM1MygpIHsgXHJcbiAgICB2YXIgYT10aGlzLmdlbnJhbmRfaW50MzIoKT4+PjUsIGI9dGhpcy5nZW5yYW5kX2ludDMyKCk+Pj42OyBcclxuICAgIHJldHVybihhKjY3MTA4ODY0LjArYikqKDEuMC85MDA3MTk5MjU0NzQwOTkyLjApOyBcclxuICB9IFxyXG4gIFxyXG4gIC8qIFRoZXNlIHJlYWwgdmVyc2lvbnMgYXJlIGR1ZSB0byBJc2FrdSBXYWRhLCAyMDAyLzAxLzA5IGFkZGVkICovXHJcbn0iLCIvLyBXcml0dGVuIGluIDIwMTUgYnkgVGhpbG8gUGxhbnogXHJcbi8vIFRvIHRoZSBleHRlbnQgcG9zc2libGUgdW5kZXIgbGF3LCBJIGhhdmUgZGVkaWNhdGVkIGFsbCBjb3B5cmlnaHQgYW5kIHJlbGF0ZWQgYW5kIG5laWdoYm9yaW5nIHJpZ2h0cyBcclxuLy8gdG8gdGhpcyBzb2Z0d2FyZSB0byB0aGUgcHVibGljIGRvbWFpbiB3b3JsZHdpZGUuIFRoaXMgc29mdHdhcmUgaXMgZGlzdHJpYnV0ZWQgd2l0aG91dCBhbnkgd2FycmFudHkuIFxyXG4vLyBodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9wdWJsaWNkb21haW4vemVyby8xLjAvXHJcblxyXG5cclxuLyoqXHJcbiAqIEEgd3JhcHBlciB0byBlbXVsYXRlIG1pbmltYWwgR2xrIGZ1bmN0aW9uYWxpdHkuXHJcbiAqL1xyXG5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD0nRW5naW5lLnRzJyAvPlxyXG5cclxubW9kdWxlIEZ5cmVWTSB7XHJcblx0XHJcblx0Y29uc3QgZW51bSBHbGtDb25zdCB7XHJcblx0XHQgd2ludHlwZV9UZXh0QnVmZmVyID0gMyxcclxuXHJcbiAgICAgICAgIGV2dHlwZV9Ob25lID0gMCxcclxuICAgICAgICAgZXZ0eXBlX0NoYXJJbnB1dCA9IDIsXHJcbiAgICAgICAgIGV2dHlwZV9MaW5lSW5wdXQgPSAzLFxyXG5cclxuICAgICAgICAgZ2VzdGFsdF9DaGFySW5wdXQgPSAxLFxyXG4gICAgICAgICBnZXN0YWx0X0NoYXJPdXRwdXQgPSAzLFxyXG4gICAgICAgICBnZXN0YWx0X0NoYXJPdXRwdXRfQXBwcm94UHJpbnQgPSAxLFxyXG4gICAgICAgICBnZXN0YWx0X0NoYXJPdXRwdXRfQ2Fubm90UHJpbnQgPSAwLFxyXG4gICAgICAgICBnZXN0YWx0X0NoYXJPdXRwdXRfRXhhY3RQcmludCA9IDIsXHJcbiAgICAgICAgIGdlc3RhbHRfTGluZUlucHV0ID0gMixcclxuICAgICAgICAgZ2VzdGFsdF9WZXJzaW9uID0gMFxyXG4gICAgICAgXHJcblx0fVxyXG5cdFxyXG5cdGludGVyZmFjZSBTdHJlYW1DbG9zZVJlc3VsdCB7XHJcblx0XHRvazogYm9vbGVhbjtcclxuXHRcdHJlYWQ6IG51bWJlcjtcclxuXHRcdHdyaXR0ZW46IG51bWJlcjtcclxuXHR9XHJcblx0XHJcblx0aW50ZXJmYWNlIEdsa1N0cmVhbSB7XHJcblx0XHRnZXRJZCgpOiBudW1iZXI7XHJcblx0XHRwdXQoczogc3RyaW5nKTogdm9pZDtcclxuXHRcdGNsb3NlKCk6IFN0cmVhbUNsb3NlUmVzdWx0O1xyXG5cdH1cclxuXHRcclxuXHRjbGFzcyBHbGtXaW5kb3dTdHJlYW0gaW1wbGVtZW50cyBHbGtTdHJlYW0ge1xyXG5cdFx0aWQgOiBudW1iZXI7XHJcblx0XHRlbmdpbmU6IEVuZ2luZTtcclxuXHRcdFxyXG5cdFx0Y29uc3RydWN0b3IoaWQ6bnVtYmVyLCBlbmdpbmU6IEVuZ2luZSl7XHJcblx0XHRcdHRoaXMuaWQgPSBpZDtcclxuXHRcdFx0dGhpcy5lbmdpbmUgPSBlbmdpbmU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGdldElkKCl7XHJcblx0XHRcdHJldHVybiB0aGlzLmlkO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRwdXQoczogc3RyaW5nKXtcclxuXHRcdFx0dGhpcy5lbmdpbmVbJ291dHB1dEJ1ZmZlciddLndyaXRlKHMpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRjbG9zZSgpe1xyXG5cdFx0XHRyZXR1cm4geyBvazogZmFsc2UsIHdyaXR0ZW46IDAsIHJlYWQ6IDB9O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG5cdGV4cG9ydCBmdW5jdGlvbiBHbGtXcmFwcGVyQ2FsbChjb2RlOiBudW1iZXIsIGFyZ2M6IG51bWJlcil7XHJcblx0XHRcclxuXHRcdGlmICghdGhpcy5nbGtIYW5kbGVycyl7XHJcblx0XHRcdHRoaXMuZ2xrSGFuZGxlcnMgPSBpbml0R2xrSGFuZGxlcnMoKTtcclxuXHRcdFx0dGhpcy5nbGtTdHJlYW1zID0gW107XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmIChhcmdjID4gOCl7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVG9vIG1hbnkgc3RhY2sgYXJndW1lbnRzIGZvciBnbGsgY2FsbCAke2NvZGV9OiAke2FyZ2N9YCk7XHJcblx0XHR9XHJcblx0XHRsZXQgZ2xrQXJncyA9IFtdO1xyXG5cdFx0d2hpbGUoYXJnYy0tKXtcclxuXHRcdFx0Z2xrQXJncy5wdXNoKHRoaXMucG9wKCkpO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGhhbmRsZXIgPSB0aGlzLmdsa0hhbmRsZXJzW2NvZGVdO1xyXG5cdFx0aWYgKGhhbmRsZXIpe1xyXG5cdFx0XHRyZXR1cm4gaGFuZGxlci5hcHBseSh0aGlzLCBnbGtBcmdzKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKGB1bmltcGxlbWVudGVkIGdsayBjYWxsICR7Y29kZX1gKTtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGV4cG9ydCBmdW5jdGlvbiBHbGtXcmFwcGVyV3JpdGUoczogc3RyaW5nKXtcclxuXHRcdGlmICh0aGlzLmdsa0N1cnJlbnRTdHJlYW0pe1xyXG5cdFx0XHR0aGlzLmdsa0N1cnJlbnRTdHJlYW0ucHV0KHMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRmdW5jdGlvbiBzdHViKCkgeyByZXR1cm4gMH07XHJcblx0XHJcblx0ZnVuY3Rpb24gaW5pdEdsa0hhbmRsZXJzKCl7XHJcblx0XHRsZXQgaGFuZGxlcnMgPSBbXTtcclxuXHRcdFxyXG5cdFx0Ly8gZ2xrX3N0cmVhbV9pdGVyYXRlXHJcblx0XHRoYW5kbGVyc1sweDQwXSA9IHN0dWI7XHJcblx0XHRcclxuXHRcdC8vIGdsa193aW5kb3dfaXRlcmF0ZVxyXG5cdFx0aGFuZGxlcnNbMHgyMF0gPSBmdW5jdGlvbih3aW5faWQpe1xyXG5cdFx0XHRpZiAodGhpcy5nbGtXaW5kb3dPcGVuICYmIHdpbl9pZCA9PT0gMClcclxuXHRcdFx0XHRyZXR1cm4gMTtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIGdsa19maWxlcmVmX2l0ZXJhdGUgXHJcblx0XHRoYW5kbGVyc1sweDY0XSA9IHN0dWI7XHJcblx0XHRcclxuXHRcdC8vIGdsa193aW5kb3dfb3BlblxyXG5cdFx0aGFuZGxlcnNbMHgyM10gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZiAodGhpcy5nbGtXaW5kb3dPcGVuKVxyXG5cdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHR0aGlzLmdsa1dpbmRvd09wZW4gPSB0cnVlO1xyXG5cdFx0XHR0aGlzLmdsa1N0cmVhbXNbMV0gPSBuZXcgR2xrV2luZG93U3RyZWFtKDEsIHRoaXMpO1xyXG5cdFx0XHRyZXR1cm4gMTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gZ2xrX3NldF93aW5kb3dcclxuXHRcdGhhbmRsZXJzWzB4MkZdID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYgKHRoaXMuZ2xrV2luZG93T3Blbil7XHJcblx0XHRcdFx0dGhpcy5nbGtDdXJyZW50U3RyZWFtID0gdGhpcy5nbGtTdHJlYW1zWzFdO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBnbGtfc2V0X3N0eWxlXHJcblx0XHRoYW5kbGVyc1sweDg2XSA9IHN0dWI7XHJcblx0XHRcclxuXHRcdC8vZ2xrX3N0eWxlaGludF9zZXQgXHJcblx0XHRoYW5kbGVyc1sweEIwXSA9IHN0dWI7XHJcblx0XHRcclxuXHRcdC8vIGdsa19zdHlsZV9kaXN0aW5ndWlzaFxyXG5cdFx0aGFuZGxlcnNbMHhCMl0gPSBzdHViO1xyXG5cdFx0XHJcblx0XHQvLyBnbGtfc3R5bGVfbWVhc3VyZVxyXG5cdFx0aGFuZGxlcnNbMHhCM10gPSBzdHViO1xyXG5cdFx0XHJcblx0XHQvLyBnbGtfY2hhcl90b19sb3dlclxyXG5cdFx0aGFuZGxlcnNbMHhBMF0gPSBmdW5jdGlvbihjaCl7XHJcblx0XHRcdHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoKS50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoMCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIGdsa19jaGFyX3RvX3VwcGVyXHJcblx0XHRoYW5kbGVyc1sweEExXSA9IGZ1bmN0aW9uKGNoKXtcclxuXHRcdFx0cmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoY2gpLnRvVXBwZXJDYXNlKCkuY2hhckNvZGVBdCgwKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gZ2xrX3JlcXVlc3RfbGluZV9ldmVudFxyXG5cdFx0aGFuZGxlcnNbMHhEMF0gPSBmdW5jdGlvbih3aW5JZCwgYnVmZmVyLCBidWZmZXJTaXplKXtcclxuXHRcdFx0dGhpcy5nbGtXYW50TGluZUlucHV0ID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5nbGtMaW5lSW5wdXRCdWZTaXplID0gYnVmZmVyU2l6ZTtcclxuXHRcdFx0dGhpcy5nbGtMaW5lSW5wdXRCdWZmZXIgPSBidWZmZXI7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIGdsa19yZXF1ZXN0X2NoYXJfZXZlbnRcclxuXHRcdGhhbmRsZXJzWzB4RDJdID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dGhpcy5nbGtXYW50Q2hhcklucHV0ID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gZ2xrX3B1dF9jaGFyXHJcblx0XHRoYW5kbGVyc1sweDgwXSA9IGZ1bmN0aW9uKGMpe1xyXG5cdFx0XHRHbGtXcmFwcGVyV3JpdGUuY2FsbCh0aGlzLCBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Ly8gZ2xrX3NlbGVjdCBcclxuXHRcdGhhbmRsZXJzWzB4QzBdID0gZnVuY3Rpb24ocmVmZXJlbmNlKSA6IGFueXtcclxuXHRcdFx0dGhpcy5kZWxpdmVyT3V0cHV0KCk7XHJcblx0XHRcdFxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLmdsa1dhbnRMaW5lSW5wdXQpe1xyXG5cdFx0XHRcdHRoaXMuZ2xrV2FudExpbmVJbnB1dCA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmICghdGhpcy5saW5lV2FudGVkKXtcclxuXHRcdFx0XHRcdEdsa1dyaXRlUmVmZXJlbmNlLmNhbGwodGhpcywgcmVmZXJlbmNlLCBHbGtDb25zdC5ldnR5cGVfTGluZUlucHV0LCAxLCAxLCAwKTtcclxuXHRcdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgY2FsbGJhY2sgPSBmdW5jdGlvbihsaW5lID0gJycpe1xyXG5cdFx0XHRcdFx0bGV0IG1heCA9IHRoaXMuaW1hZ2Uud3JpdGVBU0NJSSh0aGlzLmdsa0xpbmVJbnB1dEJ1ZmZlciwgbGluZSwgdGhpcy5nbGtMaW5lSW5wdXRCdWZTaXplKTtcclxuXHRcdFx0XHRcdEdsa1dyaXRlUmVmZXJlbmNlLmNhbGwodGhpcywgcmVmZXJlbmNlLCBHbGtDb25zdC5ldnR5cGVfTGluZUlucHV0LCAxLCBtYXgsIDApO1xyXG5cdFx0XHRcdFx0dGhpcy5yZXN1bWVBZnRlcldhaXQoWzBdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dGhpcy5saW5lV2FudGVkKGNhbGxiYWNrLmJpbmQodGhpcykpO1xyXG5cdFx0XHRcdHJldHVybiAnd2FpdCc7XHJcblx0XHRcdH1lbHNlIGlmICh0aGlzLmdsa1dhbnRDaGFySW5wdXQpe1xyXG5cdFx0XHRcdHRoaXMuZ2xrV2FudENoYXJJbnB1dCA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmICghdGhpcy5rZXlXYW50ZWQpe1xyXG5cdFx0XHRcdFx0R2xrV3JpdGVSZWZlcmVuY2UuY2FsbCh0aGlzLCByZWZlcmVuY2UsIEdsa0NvbnN0LmV2dHlwZV9DaGFySW5wdXQsIDEsIDAsIDApO1xyXG5cdFx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBjYWxsYmFjayA9IGZ1bmN0aW9uKGxpbmUpe1xyXG5cdFx0XHRcdFx0R2xrV3JpdGVSZWZlcmVuY2UuY2FsbCh0aGlzLCByZWZlcmVuY2UsIEdsa0NvbnN0LmV2dHlwZV9DaGFySW5wdXQsIDEsIGxpbmUuY2hhckNvZGVBdCgwKSwgMCk7XHJcblx0XHRcdFx0XHR0aGlzLnJlc3VtZUFmdGVyV2FpdChbMF0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHR0aGlzLmxpbmVXYW50ZWQoY2FsbGJhY2suYmluZCh0aGlzKSk7XHJcblx0XHRcdFx0cmV0dXJuICd3YWl0JztcclxuXHRcdFx0XHRcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0Ly8gbm8gZXZlbnRcclxuXHRcdFx0XHRHbGtXcml0ZVJlZmVyZW5jZS5jYWxsKHRoaXMsIHJlZmVyZW5jZSwgR2xrQ29uc3QuZXZ0eXBlX05vbmUsIDAsIDAsIDApO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gaGFuZGxlcnM7XHJcblx0fVxyXG5cdFxyXG5cdFxyXG5cdGZ1bmN0aW9uIEdsa1dyaXRlUmVmZXJlbmNlKHJlZmVyZW5jZTogbnVtYmVyLCAuLi52YWx1ZXM6IG51bWJlcltdKVxyXG4gICAgICAgIHtcclxuXHRcdFx0aWYgKHJlZmVyZW5jZSA9PSAweGZmZmZmZmZmKXtcclxuICAgICAgICAgICAgIFx0Zm9yIChsZXQgaT0wOyBpPHZhbHVlcy5sZW5ndGg7IGkrKylcclxuXHRcdFx0ICAgIFx0dGhpcy5wdXNoKHZhbHVlc1tpXSk7XHJcblx0XHRcdH1cclxuICAgICAgICAgICAgZWxzZXtcclxuXHRcdFx0XHRmb3IgKGxldCBpPTA7IGk8dmFsdWVzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIFx0dGhpcy5pbWFnZS53cml0ZUludDMyKHJlZmVyZW5jZSwgdmFsdWVzW2ldKTtcclxuXHRcdFx0XHRcdHJlZmVyZW5jZSArPSA0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG4gICAgICAgIH1cclxufSIsIi8vIFdyaXR0ZW4gZnJvbSAyMDE1IHRvIDIwMTYgYnkgVGhpbG8gUGxhbnogYW5kIEFuZHJldyBQbG90a2luXHJcbi8vIFRvIHRoZSBleHRlbnQgcG9zc2libGUgdW5kZXIgbGF3LCBJIGhhdmUgZGVkaWNhdGVkIGFsbCBjb3B5cmlnaHQgYW5kIHJlbGF0ZWQgYW5kIG5laWdoYm9yaW5nIHJpZ2h0cyBcclxuLy8gdG8gdGhpcyBzb2Z0d2FyZSB0byB0aGUgcHVibGljIGRvbWFpbiB3b3JsZHdpZGUuIFRoaXMgc29mdHdhcmUgaXMgZGlzdHJpYnV0ZWQgd2l0aG91dCBhbnkgd2FycmFudHkuIFxyXG4vLyBodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9wdWJsaWNkb21haW4vemVyby8xLjAvXHJcblxyXG4vKipcclxuICogUHJvdmlkZXMgaGFyZGNvZGVkIHZlcnNpb25zIG9mIHNvbWUgY29tbW9ubHkgdXNlZCB2ZW5lZXIgcm91dGluZXMgKGxvdy1sZXZlbFxyXG4gKiAgZnVuY3Rpb25zIHRoYXQgYXJlIGF1dG9tYXRpY2FsbHkgY29tcGlsZWQgaW50byBldmVyeSBJbmZvcm0gZ2FtZSkuXHJcbiAqIEluZm9ybSBnYW1lcyByZWx5IGhlYXZpbHkgb24gdGhlc2Ugcm91dGluZXMsIGFuZCBzdWJzdGl0dXRpbmcgb3VyIFwibmF0aXZlXCIgdmVyc2lvbnNcclxuICogZm9yIHRoZSBHbHVseCB2ZXJzaW9ucyBpbiB0aGUgc3RvcnkgZmlsZSBjYW4gaW5jcmVhc2UgcGVyZm9ybWFuY2Ugc2lnbmlmaWNhbnRseS4gICBcclxuICovXHJcblxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPSdFbmdpbmUudHMnIC8+XHJcblxyXG5tb2R1bGUgRnlyZVZNIHtcclxuXHRcclxuXHQgICAgLy8vIElkZW50aWZpZXMgYSB2ZW5lZXIgcm91dGluZSB0aGF0IGlzIGludGVyY2VwdGVkLCBvciBhIGNvbnN0YW50IHRoYXRcclxuICAgICAgICAvLy8gdGhlIHJlcGxhY2VtZW50IHJvdXRpbmUgbmVlZHMgdG8gdXNlLlxyXG4gICAgICAgIGV4cG9ydCBjb25zdCBlbnVtIFZlbmVlclNsb3RcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIHJvdXRpbmUgYWRkcmVzc2VzXHJcbiAgICAgICAgICAgIFpfX1JlZ2lvbiA9IDEsXHJcbiAgICAgICAgICAgIENQX19UYWIgPSAyLFxyXG4gICAgICAgICAgICBPQ19fQ2wgPSAzLFxyXG4gICAgICAgICAgICBSQV9fUHIgPSA0LFxyXG4gICAgICAgICAgICBSVF9fQ2hMRFcgPSA1LFxyXG4gICAgICAgICAgICBVbnNpZ25lZF9fQ29tcGFyZSA9IDYsXHJcbiAgICAgICAgICAgIFJMX19QciA9IDcsXHJcbiAgICAgICAgICAgIFJWX19QciA9IDgsXHJcbiAgICAgICAgICAgIE9QX19QciA9IDksXHJcbiAgICAgICAgICAgIFJUX19DaFNUVyA9IDEwLFxyXG4gICAgICAgICAgICBSVF9fQ2hMREIgPSAxMSxcclxuICAgICAgICAgICAgTWV0YV9fY2xhc3MgPSAxMixcclxuXHJcbiAgICAgICAgICAgIC8vIG9iamVjdCBudW1iZXJzIGFuZCBjb21waWxlciBjb25zdGFudHNcclxuICAgICAgICAgICAgU3RyaW5nID0gMTAwMSxcclxuICAgICAgICAgICAgUm91dGluZSA9IDEwMDIsXHJcbiAgICAgICAgICAgIENsYXNzID0gMTAwMyxcclxuICAgICAgICAgICAgT2JqZWN0ID0gMTAwNCxcclxuICAgICAgICAgICAgUlRfX0VyciA9IDEwMDUsXHJcbiAgICAgICAgICAgIE5VTV9BVFRSX0JZVEVTID0gMTAwNixcclxuICAgICAgICAgICAgY2xhc3Nlc190YWJsZSA9IDEwMDcsXHJcbiAgICAgICAgICAgIElORElWX1BST1BfU1RBUlQgPSAxMDA4LFxyXG4gICAgICAgICAgICBjcHZfX3N0YXJ0ID0gMTAwOSxcclxuICAgICAgICAgICAgb2ZjbGFzc19lcnIgPSAxMDEwLFxyXG4gICAgICAgICAgICByZWFkcHJvcF9lcnIgPSAxMDExLFxyXG4gICAgICAgIH1cclxuXHRcclxuICAgIFxyXG4gICAgIC8vIFJBTSBhZGRyZXNzZXMgb2YgY29tcGlsZXItZ2VuZXJhdGVkIGdsb2JhbCB2YXJpYWJsZXNcclxuICAgICBsZXQgU0VMRl9PRkZTRVQgPSAxNjtcclxuICAgICBsZXQgU0VOREVSX09GRlNFVCA9IDIwO1xyXG4gICAgIFxyXG4gICAgIC8vIG9mZnNldHMgb2YgY29tcGlsZXItZ2VuZXJhdGVkIHByb3BlcnR5IG51bWJlcnMgZnJvbSBJTkRJVl9QUk9QX1NUQVJUXHJcbiAgICAgbGV0IENBTExfUFJPUCA9IDU7XHJcbiAgICAgbGV0IFBSSU5UX1BST1AgPSA2O1xyXG4gICAgIGxldCBQUklOVF9UT19BUlJBWV9QUk9QID0gNztcclxuXHJcbiAgICAgICAgICBcclxuICAgIFxyXG4gICAgIGludGVyZmFjZSBWZW5lZXIge1xyXG4gICAgICAgICBzdHJpbmdfbWMgOiBudW1iZXIsXHJcbiAgICAgICAgIHJvdXRpbmVfbWMgOiBudW1iZXIsXHJcbiAgICAgICAgIGNsYXNzX21jIDogbnVtYmVyLFxyXG4gICAgICAgICBvYmplY3RfbWMgOiBudW1iZXIsXHJcbiAgICAgICAgIG51bV9hdHRyX2J5dGVzIDogbnVtYmVyLFxyXG4gICAgICAgICBjbGFzc2VzX3RhYmxlOiBudW1iZXIsXHJcbiAgICAgICAgIGluZGl2X3Byb3Bfc3RhcnQgOiBudW1iZXIsXHJcbiAgICAgICAgIGNwdl9zdGFydCA6IG51bWJlclxyXG4gICAgICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVycyBhIHJvdXRpbmUgYWRkcmVzcyBvciBjb25zdGFudCB2YWx1ZSwgdXNpbmcgdGhlIGFjY2VsZXJhdGlvblxyXG4gICAgICogY29kZXMgZGVmaW5lZCBpbiB0aGUgR2x1bHggc3BlY2lmaWNhdGlvbi5cclxuICAgICAqL1xyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gc2V0U2xvdEdsdWx4KGlzUGFyYW06IGJvb2xlYW4sIHNsb3Q6IG51bWJlciwgdmFsdWUpIDogYm9vbGVhbiB7XHJcbiAgICAgICBpZiAoaXNQYXJhbSAmJiBzbG90ID09PSA2KXtcclxuICAgICAgICAgICBsZXQgaW1hZ2U6IFVseEltYWdlID0gdGhpcy5pbWFnZTtcclxuICAgICAgICAgICBpZiAodmFsdWUgIT0gaW1hZ2UuZ2V0UmFtQWRkcmVzcyhTRUxGX09GRlNFVCkpe1xyXG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmV4cGVjdGVkIHZhbHVlIGZvciBhY2NlbGVyYXRpb24gcGFyYW1ldGVyIDZcIik7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgfSBcclxuICAgICAgIGlmIChpc1BhcmFtKXtcclxuICAgICAgICAgICBzd2l0Y2goc2xvdCl7XHJcbiAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIHNldFNsb3RGeXJlLmNhbGwodGhpcywgVmVuZWVyU2xvdC5jbGFzc2VzX3RhYmxlLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIHNldFNsb3RGeXJlLmNhbGwodGhpcywgVmVuZWVyU2xvdC5JTkRJVl9QUk9QX1NUQVJULCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIHNldFNsb3RGeXJlLmNhbGwodGhpcywgVmVuZWVyU2xvdC5DbGFzcywgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICBjYXNlIDM6IHJldHVybiBzZXRTbG90RnlyZS5jYWxsKHRoaXMsIFZlbmVlclNsb3QuT2JqZWN0LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIHNldFNsb3RGeXJlLmNhbGwodGhpcywgVmVuZWVyU2xvdC5Sb3V0aW5lLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHNldFNsb3RGeXJlLmNhbGwodGhpcywgVmVuZWVyU2xvdC5TdHJpbmcsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgY2FzZSA3OiByZXR1cm4gc2V0U2xvdEZ5cmUuY2FsbCh0aGlzLCBWZW5lZXJTbG90Lk5VTV9BVFRSX0JZVEVTLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgIGNhc2UgODogcmV0dXJuIHNldFNsb3RGeXJlLmNhbGwodGhpcywgVmVuZWVyU2xvdC5jcHZfX3N0YXJ0LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBmYWxzZTsgXHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgc3dpdGNoKHNsb3Qpe1xyXG4gICAgICAgICAgICAgICBjYXNlIDE6IHJldHVybiBzZXRTbG90RnlyZS5jYWxsKHRoaXMsIFZlbmVlclNsb3QuWl9fUmVnaW9uLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIHNldFNsb3RGeXJlLmNhbGwodGhpcywgVmVuZWVyU2xvdC5DUF9fVGFiLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHNldFNsb3RGeXJlLmNhbGwodGhpcywgVmVuZWVyU2xvdC5SQV9fUHIsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gc2V0U2xvdEZ5cmUuY2FsbCh0aGlzLCBWZW5lZXJTbG90LlJMX19QciwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICBjYXNlIDU6IHJldHVybiBzZXRTbG90RnlyZS5jYWxsKHRoaXMsIFZlbmVlclNsb3QuT0NfX0NsLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgIGNhc2UgNjogcmV0dXJuIHNldFNsb3RGeXJlLmNhbGwodGhpcywgVmVuZWVyU2xvdC5SVl9fUHIsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgY2FzZSA3OiByZXR1cm4gc2V0U2xvdEZ5cmUuY2FsbCh0aGlzLCBWZW5lZXJTbG90Lk9QX19QciwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gZmFsc2U7IFxyXG4gICAgICAgICAgIFxyXG4gICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogIFJlZ2lzdGVycyBhIHJvdXRpbmUgYWRkcmVzcyBvciBjb25zdGFudCB2YWx1ZSwgdXNpbmcgdGhlIHRyYWRpdGlvbmFsXHJcbiAgICAgKiAgRnlyZVZNIHNsb3QgY29kZXMuXHJcbiAgICAgKi9cclxuXHRcclxuXHQgZXhwb3J0IGZ1bmN0aW9uIHNldFNsb3RGeXJlKHNsb3Q6VmVuZWVyU2xvdCwgdmFsdWUpIDogYm9vbGVhbntcclxuXHRcdCBsZXQgdiA6IFZlbmVlciA9IHRoaXMudmVuZWVyO1xyXG4gICAgICAgICBzd2l0Y2goc2xvdCl7XHJcblx0XHRcdCBjYXNlIFZlbmVlclNsb3QuWl9fUmVnaW9uOiB0aGlzLnZlbmVlclt2YWx1ZV0gPSBaX19SZWdpb247IHJldHVybiB0cnVlO1xyXG5cdFx0XHQgY2FzZSBWZW5lZXJTbG90LkNQX19UYWI6IHRoaXMudmVuZWVyW3ZhbHVlXSA9IENQX19UYWI7IHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgY2FzZSBWZW5lZXJTbG90Lk9DX19DbDogdGhpcy52ZW5lZXJbdmFsdWVdID0gT0NfX0NsOyByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgIGNhc2UgVmVuZWVyU2xvdC5SQV9fUHI6IHRoaXMudmVuZWVyW3ZhbHVlXSA9IFJBX19QcjsgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICBjYXNlIFZlbmVlclNsb3QuUlRfX0NoTERXOiB0aGlzLnZlbmVlclt2YWx1ZV0gPSBSVF9fQ2hMRFc7IHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgY2FzZSBWZW5lZXJTbG90LlVuc2lnbmVkX19Db21wYXJlOiB0aGlzLnZlbmVlclt2YWx1ZV0gPSBVbnNpZ25lZF9fQ29tcGFyZTsgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICBjYXNlIFZlbmVlclNsb3QuUkxfX1ByOiB0aGlzLnZlbmVlclt2YWx1ZV0gPSBSTF9fUHI7IHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgY2FzZSBWZW5lZXJTbG90LlJWX19QcjogdGhpcy52ZW5lZXJbdmFsdWVdID0gUlZfX1ByOyByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgIGNhc2UgVmVuZWVyU2xvdC5PUF9fUHI6IHRoaXMudmVuZWVyW3ZhbHVlXSA9IE9QX19QcjsgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICBjYXNlIFZlbmVlclNsb3QuUlRfX0NoU1RXOiB0aGlzLnZlbmVlclt2YWx1ZV0gPSBSVF9fQ2hTVFc7IHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgY2FzZSBWZW5lZXJTbG90LlJUX19DaExEQjogdGhpcy52ZW5lZXJbdmFsdWVdID0gUlRfX0NoTERCOyByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgIGNhc2UgVmVuZWVyU2xvdC5NZXRhX19jbGFzczogdGhpcy52ZW5lZXJbdmFsdWVdID0gTWV0YV9fY2xhc3M7IHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICBjYXNlIFZlbmVlclNsb3QuU3RyaW5nOiB2LnN0cmluZ19tYyA9IHZhbHVlOyByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgIGNhc2UgVmVuZWVyU2xvdC5Sb3V0aW5lOiB2LnJvdXRpbmVfbWMgPSB2YWx1ZTsgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICBjYXNlIFZlbmVlclNsb3QuQ2xhc3M6IHYuY2xhc3NfbWMgPSB2YWx1ZTsgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICBjYXNlIFZlbmVlclNsb3QuT2JqZWN0OiB2Lm9iamVjdF9tYyA9IHZhbHVlOyByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgIGNhc2UgVmVuZWVyU2xvdC5OVU1fQVRUUl9CWVRFUzogdi5udW1fYXR0cl9ieXRlcyA9IHZhbHVlOyByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgIGNhc2UgVmVuZWVyU2xvdC5jbGFzc2VzX3RhYmxlOiB2LmNsYXNzZXNfdGFibGUgPSB2YWx1ZTsgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICBjYXNlIFZlbmVlclNsb3QuSU5ESVZfUFJPUF9TVEFSVDogdi5pbmRpdl9wcm9wX3N0YXJ0ID0gdmFsdWU7IHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgY2FzZSBWZW5lZXJTbG90LmNwdl9fc3RhcnQ6IHYuY3B2X3N0YXJ0ID0gdmFsdWU7IHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAvLyBydW4tdGltZSBlcnJvciBoYW5kbGVycyBhcmUganVzdCBpZ25vcmVkICh3ZSBsb2cgYW4gZXJyb3IgbWVzc2FnZSBpbnN0ZWFkLCBsaWtlIFF1aXhlIGRvZXMsIG5vIE5lc3RlZENhbGwgYSBsYSBGeXJlVk0pXHJcbiAgICAgICAgICAgICBjYXNlIFZlbmVlclNsb3QuUlRfX0VycjpcclxuICAgICAgICAgICAgIGNhc2UgVmVuZWVyU2xvdC5vZmNsYXNzX2VycjpcclxuICAgICAgICAgICAgIGNhc2UgVmVuZWVyU2xvdC5yZWFkcHJvcF9lcnI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgIFx0XHRjb25zb2xlLndhcm4oYGlnbm9yaW5nIHZlbmVlciAke3Nsb3R9ICR7dmFsdWV9YCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHJcblx0XHQgfVxyXG5cdCB9XHJcblx0XHJcbiAgICAgZnVuY3Rpb24gVW5zaWduZWRfX0NvbXBhcmUoYSxiKXtcclxuICAgICAgICAgIGEgPSBhID4+PiAwO1xyXG4gICAgICAgICAgYiA9IGIgPj4+IDA7XHJcbiAgICAgICAgICBpZiAoYSA+IGIpIHJldHVybiAxO1xyXG4gICAgICAgICAgaWYgKGEgPCBiKSByZXR1cm4gLTE7XHJcbiAgICAgICAgICByZXR1cm4gMDtcclxuICAgICB9XHJcbiAgICBcclxuXHRcclxuXHQgLy8gZGlzdGluZ3Vpc2hlcyBiZXR3ZWVuIHN0cmluZ3MsIHJvdXRpbmVzLCBhbmQgb2JqZWN0c1xyXG4gICAgIGZ1bmN0aW9uIFpfX1JlZ2lvbihhZGRyZXNzOm51bWJlcikgOiBudW1iZXJ7XHJcblx0XHQgbGV0IGltYWdlOiBVbHhJbWFnZSA9IHRoaXMuaW1hZ2U7XHJcblx0XHQgaWYgKGFkZHJlc3MgPCAzNiB8fCBhZGRyZXNzID49IGltYWdlLmdldEVuZE1lbSgpKVxyXG5cdFx0IFx0cmV0dXJuIDA7XHJcblx0XHRcclxuXHRcdCBsZXQgdHlwZSA9IGltYWdlLnJlYWRCeXRlKGFkZHJlc3MpO1xyXG5cdFx0IGlmICh0eXBlID49IDB4RTApIHJldHVybiAzO1xyXG5cdFx0IGlmICh0eXBlID49IDB4QzApIHJldHVybiAyO1xyXG5cdFx0IGlmICh0eXBlID49IDB4NzAgJiYgdHlwZSA8PSAweDdGICYmIGFkZHJlc3MgPj0gaW1hZ2UuZ2V0UmFtQWRkcmVzcygwKSkgcmV0dXJuIDE7XHJcblx0IFx0IHJldHVybiAwO1xyXG5cdCB9ICBcclxuICAgICBcclxuICAgICBcclxuICAgICAgLy8gZmluZHMgYW4gb2JqZWN0J3MgY29tbW9uIHByb3BlcnR5IHRhYmxlXHJcbiAgICAgICAgZnVuY3Rpb24gQ1BfX1RhYihvYmosaWQpIDogbnVtYmVyXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoWl9fUmVnaW9uLmNhbGwodGhpcywgb2JqKSAhPSAxKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBlcnJvciBcImhhbmRsaW5nXCIgaW5zcGlyZWQgYnkgUXVpeGVcclxuICAgICAgICAgICAgICAgIC8vIGluc3RlYWQgb2YgZG9pbmcgYSBOZXN0ZWRDYWxsIHRvIHRoZSBzdXBwbGllZCBlcnJvciBoYW5kbGVyXHJcbiAgICAgICAgICAgICAgICAvLyBqdXN0IGxvZyBhbiBlcnJvciBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiWyoqIFByb2dyYW1taW5nIGVycm9yOiB0cmllZCB0byBmaW5kIHRoZSBcXFwiLlxcXCIgb2YgKHNvbWV0aGluZykgKipdXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGltYWdlOiBVbHhJbWFnZSA9IHRoaXMuaW1hZ2U7XHJcblx0XHJcbiAgICAgICAgICAgIGxldCBvdGFiID0gaW1hZ2UucmVhZEludDMyKG9iaiArIDE2KTtcclxuICAgICAgICAgICAgaWYgKG90YWIgPT0gMClcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICBsZXQgbWF4ID0gaW1hZ2UucmVhZEludDMyKG90YWIpO1xyXG4gICAgICAgICAgICBvdGFiICs9IDQ7XHJcbiAgICAgICAgICAgIC8vIFBlcmZvcm1CaW5hcnlTZWFyY2hcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3Bjb2Rlc1sweDE1MV0uaGFuZGxlci5jYWxsKHRoaXMsIGlkLCAyLCBvdGFiLCAxMCwgbWF4LCAwLCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgXHJcbiAgICAgXHJcbiAgICAgIC8vIGZpbmRzIHRoZSBsb2NhdGlvbiBvZiBhbiBvYmplY3QgKFwicGFyZW50KClcIiBmdW5jdGlvbilcclxuICAgICAgZnVuY3Rpb24gUGFyZW50KG9iail7XHJcbiAgICAgICAgIHJldHVybiB0aGlzLmltYWdlLnJlYWRJbnQzMihvYmogKyAxICsgdGhpcy52ZW5lZXIubnVtX2F0dHJfYnl0ZXMgKyAxMik7XHJcbiAgICAgIH1cclxuICAgICBcclxuICAgICAvLyBkZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgbWVtYmVyIG9mIGEgZ2l2ZW4gY2xhc3MgKFwib2ZjbGFzc1wiIG9wZXJhdG9yKVxyXG4gICAgICBmdW5jdGlvbiBPQ19fQ2wob2JqLCBjbGEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAgbGV0IHYgOiBWZW5lZXIgPSB0aGlzLnZlbmVlcjtcclxuICAgICAgICBcclxuICAgICAgICAgICAgc3dpdGNoIChaX19SZWdpb24uY2FsbCh0aGlzLCBvYmopKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChjbGEgPT09IHYuc3RyaW5nX21jID8gMSA6IDApO1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChjbGEgPT09IHYucm91dGluZV9tYyA/IDEgOiAwKTtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbGEgPT09IHYuY2xhc3NfbWMpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoUGFyZW50LmNhbGwodGhpcywgb2JqKSA9PT0gdi5jbGFzc19tYylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqID09PSB2LmNsYXNzX21jIHx8IG9iaiA9PT0gdi5zdHJpbmdfbWMgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iaiA9PT0gdi5yb3V0aW5lX21jIHx8IG9iaiA9PT0gdi5vYmplY3RfbWMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNsYSA9PSB0aGlzLnZlbmVlci5vYmplY3RfbWMpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoUGFyZW50LmNhbGwodGhpcywgb2JqKSA9PSB2LmNsYXNzX21jKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmogPT0gdi5jbGFzc19tYyB8fCBvYmogPT0gdi5zdHJpbmdfbWMgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iaiA9PSB2LnJvdXRpbmVfbWMgfHwgb2JqID09IHYub2JqZWN0X21jKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbGEgPT0gdi5zdHJpbmdfbWMgfHwgY2xhID09IHYucm91dGluZV9tYylcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZiAoUGFyZW50LmNhbGwodGhpcywgY2xhKSAhPSB2LmNsYXNzX21jKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlsqKiBQcm9ncmFtbWluZyBlcnJvcjogdHJpZWQgdG8gYXBwbHkgJ29mY2xhc3MnIHdpdGggbm9uLWNsYXNzICoqXVwiKSAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW1hZ2U6IFVseEltYWdlID0gdGhpcy5pbWFnZTtcclxuXHRcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5saXN0ID0gUkFfX1ByLmNhbGwodGhpcywgb2JqLCAyKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5saXN0ID09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlubGlzdGxlbiA9IFJMX19Qci5jYWxsKHRoaXMsIG9iaiwgMikgLyA0O1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGp4ID0gMDsganggPCBpbmxpc3RsZW47IGp4KyspXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbWFnZS5yZWFkSW50MzIoaW5saXN0ICsganggKiA0KSA9PT0gY2xhKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICBcclxuICAgICAvLyBmaW5kcyB0aGUgYWRkcmVzcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0eSAoXCIuJlwiIG9wZXJhdG9yKVxyXG4gICAgICAgIGZ1bmN0aW9uIFJBX19QcihvYmosIGlkKSA6IG51bWJlclxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGNsYSA9IDA7XHJcbiAgICAgICAgICAgICBsZXQgaW1hZ2U6IFVseEltYWdlID0gdGhpcy5pbWFnZTtcclxuXHRcclxuICAgICAgICAgICAgaWYgKChpZCAmIDB4RkZGRjAwMDApICE9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNsYSA9IGltYWdlLnJlYWRJbnQzMih0aGlzLnZlbmVlci5jbGFzc2VzX3RhYmxlICsgNCAqIChpZCAmIDB4RkZGRikpO1xyXG4gICAgICAgICAgICAgICAgaWYgKE9DX19DbC5jYWxsKHRoaXMsIG9iaiwgY2xhKSA9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGlkID4+PSAxNjtcclxuICAgICAgICAgICAgICAgIG9iaiA9IGNsYTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHByb3AgPSBDUF9fVGFiLmNhbGwodGhpcywgb2JqLCBpZCk7XHJcbiAgICAgICAgICAgIGlmIChwcm9wID09IDApXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChQYXJlbnQuY2FsbCh0aGlzLCBvYmopID09PSB0aGlzLnZlbmVlci5jbGFzc19tYyAmJiBjbGEgPT0gMClcclxuICAgICAgICAgICAgICAgIGlmIChpZCA8IHRoaXMudmVuZWVyLmluZGl2X3Byb3Bfc3RhcnQgfHwgaWQgPj0gdGhpcy52ZW5lZXIuaW5kaXZfcHJvcF9zdGFydCArIDgpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW1hZ2UucmVhZEludDMyKGltYWdlLmdldFJhbUFkZHJlc3MoU0VMRl9PRkZTRVQpKSAhPSBvYmopXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCBpeCA9IChpbWFnZS5yZWFkQnl0ZShwcm9wICsgOSkgJiAxKTtcclxuICAgICAgICAgICAgICAgIGlmIChpeCAhPSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaW1hZ2UucmVhZEludDMyKHByb3AgKyA0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgIFxyXG4gICAgIC8vIGZpbmRzIHRoZSBsZW5ndGggb2YgYW4gb2JqZWN0J3MgcHJvcGVydHkgKFwiLiNcIiBvcGVyYXRvcilcclxuICAgICAgICAgICAgZnVuY3Rpb24gUkxfX1ByKG9iaiwgaWQpOiBudW1iZXJcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsYSA9IDA7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW1hZ2U6IFVseEltYWdlID0gdGhpcy5pbWFnZTtcclxuXHRcclxuICAgICAgICAgICAgICAgIGlmICgoaWQgJiAweEZGRkYwMDAwKSAhPSAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYSA9IGltYWdlLnJlYWRJbnQzMih0aGlzLnZlbmVlci5jbGFzc2VzX3RhYmxlICsgNCAqIChpZCAmIDB4RkZGRikpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChPQ19fQ2wuY2FsbCh0aGlzLCBvYmosIGNsYSkgPT0gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlkID4+PSAxNjtcclxuICAgICAgICAgICAgICAgICAgICBvYmogPSBjbGE7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHByb3AgPSBDUF9fVGFiLmNhbGwodGhpcywgb2JqLCBpZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcCA9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChQYXJlbnQuY2FsbCh0aGlzLCBvYmopID09IHRoaXMudmVuZWVyLmNsYXNzX21jICYmIGNsYSA9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZCA8IHRoaXMudmVuZWVyLmluZGl2X3Byb3Bfc3RhcnQgfHwgaWQgPj0gdGhpcy52ZW5lZXIuaW5kaXZfcHJvcF9zdGFydCArIDgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbWFnZS5yZWFkSW50MzIoaW1hZ2UuZ2V0UmFtQWRkcmVzcyhTRUxGX09GRlNFVCkpICE9IG9iailcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXggPSAoaW1hZ2UucmVhZEJ5dGUocHJvcCArIDkpICYgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl4ICE9IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiA0ICogaW1hZ2UucmVhZEludDE2KHByb3AgKyAyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgIFxyXG4gICAgIFxyXG4gICAgICAgLy8gcGVyZm9ybXMgYm91bmRzIGNoZWNraW5nIHdoZW4gcmVhZGluZyBmcm9tIGEgd29yZCBhcnJheSAoXCItLT5cIiBvcGVyYXRvcilcclxuICAgICAgICBmdW5jdGlvbiBSVF9fQ2hMRFcoYXJyYXksIG9mZnNldClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBhZGRyZXNzID0gYXJyYXkgKyA0ICogb2Zmc2V0O1xyXG4gICAgICAgICAgICBsZXQgaW1hZ2U6IFVseEltYWdlID0gdGhpcy5pbWFnZTtcclxuXHRcclxuICAgICAgICAgICAgaWYgKGFkZHJlc3MgPj0gaW1hZ2UuZ2V0RW5kTWVtKCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbKiogUHJvZ3JhbW1pbmcgZXJyb3I6IHRyaWVkIHRvIHJlYWQgZnJvbSB3b3JkIGFycmF5IGJleW9uZCBFbmRNZW0gKipdXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGltYWdlLnJlYWRJbnQzMihhZGRyZXNzKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvLyByZWFkcyB0aGUgdmFsdWUgb2YgYW4gb2JqZWN0J3MgcHJvcGVydHkgKFwiLlwiIG9wZXJhdG9yKVxyXG4gICAgICAgIGZ1bmN0aW9uIFJWX19QcihvYmosIGlkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgYWRkciA9IFJBX19Qci5jYWxsKHRoaXMsIG9iaiwgaWQpO1xyXG4gICAgICAgICAgICBsZXQgaW1hZ2U6IFVseEltYWdlID0gdGhpcy5pbWFnZTtcclxuXHRcclxuICAgICAgICAgICAgaWYgKGFkZHIgPT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IHYgOiBWZW5lZXIgPSB0aGlzLnZlbmVlcjtcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChpZCA+IDAgJiYgaWQgPCB2LmluZGl2X3Byb3Bfc3RhcnQpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGltYWdlLnJlYWRJbnQzMih2LmNwdl9zdGFydCArIDQgKiBpZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlsqKiBQcm9ncmFtbWluZyBlcnJvcjogdHJpZWQgdG8gcmVhZCAoc29tZXRoaW5nKSAqKl1cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGltYWdlLnJlYWRJbnQzMihhZGRyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgIFxyXG4gICAgICAvLyBkZXRlcm1pbmVzIHdoZXRoZXIgYW4gb2JqZWN0IHByb3ZpZGVzIGEgZ2l2ZW4gcHJvcGVydHkgKFwicHJvdmlkZXNcIiBvcGVyYXRvcilcclxuICAgICAgZnVuY3Rpb24gT1BfX1ByKG9iaiwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCB2IDogVmVuZWVyID0gdGhpcy52ZW5lZXI7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKFpfX1JlZ2lvbi5jYWxsKHRoaXMsIG9iaikpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWQgPT0gdi5pbmRpdl9wcm9wX3N0YXJ0ICsgUFJJTlRfUFJPUCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQgPT0gdi5pbmRpdl9wcm9wX3N0YXJ0ICsgUFJJTlRfVE9fQVJSQVlfUFJPUClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWQgPT0gdi5pbmRpdl9wcm9wX3N0YXJ0ICsgQ0FMTF9QUk9QKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpZCA+PSB2LmluZGl2X3Byb3Bfc3RhcnQgJiYgaWQgPCB2LmluZGl2X3Byb3Bfc3RhcnQgKyA4KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFBhcmVudC5jYWxsKHRoaXMsIG9iaikgPT0gdi5jbGFzc19tYylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChSQV9fUHIuY2FsbCh0aGlzLCBvYmosIGlkKSAhPSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgIFxyXG4gICAgICAvLyBwZXJmb3JtcyBib3VuZHMgY2hlY2tpbmcgd2hlbiB3cml0aW5nIHRvIGEgd29yZCBhcnJheSAoXCItLT5cIiBvcGVyYXRvcilcclxuICAgICAgICBmdW5jdGlvbiBSVF9fQ2hTVFcoYXJyYXksIG9mZnNldCwgdmFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGltYWdlOiBVbHhJbWFnZSA9IHRoaXMuaW1hZ2U7XHJcblx0ICAgICAgICBsZXQgYWRkcmVzcyA9IGFycmF5ICsgNCAqIG9mZnNldDtcclxuICAgICAgICAgICAgaWYgKGFkZHJlc3MgPj0gaW1hZ2UuZ2V0RW5kTWVtKCkgfHwgYWRkcmVzcyA8IGltYWdlLmdldFJhbUFkZHJlc3MoMCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbKiogUHJvZ3JhbW1pbmcgZXJyb3I6IHRyaWVkIHRvIHdyaXRlIHRvIHdvcmQgYXJyYXkgb3V0c2lkZSBvZiBSQU0gKipdXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbWFnZS53cml0ZUludDMyKGFkZHJlc3MsIHZhbCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgLy8gcGVyZm9ybXMgYm91bmRzIGNoZWNraW5nIHdoZW4gcmVhZGluZyBmcm9tIGEgYnl0ZSBhcnJheSAoXCItPlwiIG9wZXJhdG9yKVxyXG4gICAgICAgIGZ1bmN0aW9uIFJUX19DaExEQihhcnJheSwgb2Zmc2V0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGFkZHJlc3MgPSBhcnJheSArIG9mZnNldDtcclxuICAgICAgICAgICAgbGV0IGltYWdlOiBVbHhJbWFnZSA9IHRoaXMuaW1hZ2U7XHJcblx0ICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoYWRkcmVzcyA+PSBpbWFnZS5nZXRFbmRNZW0oKSl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiWyoqIFByb2dyYW1taW5nIGVycm9yOiB0cmllZCB0byByZWFkIGZyb20gYnl0ZSBhcnJheSBiZXlvbmQgRW5kTWVtICoqXVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaW1hZ2UucmVhZEJ5dGUoYWRkcmVzcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICBcclxuICAgICAgLy8gZGV0ZXJtaW5lcyB0aGUgbWV0YWNsYXNzIG9mIGEgcm91dGluZSwgc3RyaW5nLCBvciBvYmplY3QgKFwibWV0YWNsYXNzKClcIiBmdW5jdGlvbilcclxuICAgICAgZnVuY3Rpb24gTWV0YV9fY2xhc3Mob2JqKSA6IG51bWJlclxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3dpdGNoIChaX19SZWdpb24uY2FsbCh0aGlzLCBvYmopKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmVuZWVyLnJvdXRpbmVfbWM7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmVuZWVyLnN0cmluZ19tYztcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoUGFyZW50LmNhbGwodGhpcyxvYmopID09PSB0aGlzLnZlbmVlci5jbGFzc19tYylcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmVuZWVyLmNsYXNzX21jO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmogPT0gdGhpcy52ZW5lZXIuY2xhc3NfbWMgfHwgb2JqID09IHRoaXMudmVuZWVyLnN0cmluZ19tYyB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmogPT0gdGhpcy52ZW5lZXIucm91dGluZV9tYyB8fCBvYmogPT0gdGhpcy52ZW5lZXIub2JqZWN0X21jKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52ZW5lZXIuY2xhc3NfbWM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmVuZWVyLm9iamVjdF9tYztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBcclxuXHRcclxuXHRcclxuXHRcclxufSIsIi8vIFdyaXR0ZW4gaW4gMjAxNSBieSBUaGlsbyBQbGFueiBhbmQgQW5kcmV3IFBsb3RraW5cclxuLy8gVG8gdGhlIGV4dGVudCBwb3NzaWJsZSB1bmRlciBsYXcsIEkgaGF2ZSBkZWRpY2F0ZWQgYWxsIGNvcHlyaWdodCBhbmQgcmVsYXRlZCBhbmQgbmVpZ2hib3JpbmcgcmlnaHRzIFxyXG4vLyB0byB0aGlzIHNvZnR3YXJlIHRvIHRoZSBwdWJsaWMgZG9tYWluIHdvcmxkd2lkZS4gVGhpcyBzb2Z0d2FyZSBpcyBkaXN0cmlidXRlZCB3aXRob3V0IGFueSB3YXJyYW50eS4gXHJcbi8vIGh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL3B1YmxpY2RvbWFpbi96ZXJvLzEuMC9cclxuXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9Jy4uL21lcnNlbm5lLXR3aXN0ZXIudHMnIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9J0dsa1dyYXBwZXIudHMnIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9J1ZlbmVlci50cycgLz5cclxuXHJcbm1vZHVsZSBGeXJlVk0ge1xyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIGFuIE9wY29kZUhhbmRsZXIgdGFrZXMgYW55IG51bWJlciBvZiBhcmd1bWVudHMgKGFsbCBudW1iZXJzKVxyXG5cdCAqIGFuZCByZXR1cm5zIG5vdGhpbmcsIG9yIGEgbnVtYmVyLCBvciBtdWx0aXBsZSBudW1iZXJzXHJcblx0ICovXHJcblx0ZXhwb3J0IGludGVyZmFjZSBPcGNvZGVIYW5kbGVye1xyXG5cdFx0KC4uLmFueTpudW1iZXJbXSkgOiB2b2lkIHwgbnVtYmVyIHwgbnVtYmVyW11cclxuXHR9XHJcblx0XHJcblx0ZXhwb3J0IGNsYXNzIE9wY29kZSB7XHJcblx0XHRjb2RlOiBudW1iZXI7XHJcblx0XHRuYW1lOiBzdHJpbmc7XHJcblx0XHRsb2FkQXJnczogbnVtYmVyO1xyXG5cdFx0c3RvcmVBcmdzOiBudW1iZXI7XHJcblx0XHRoYW5kbGVyOk9wY29kZUhhbmRsZXI7XHJcblx0XHRydWxlOk9wY29kZVJ1bGU7XHJcblx0XHRjb25zdHJ1Y3Rvcihjb2RlOiBudW1iZXIsIG5hbWU6IHN0cmluZywgbG9hZEFyZ3M6IG51bWJlciwgc3RvcmVBcmdzOiBudW1iZXIsIGhhbmRsZXI6T3Bjb2RlSGFuZGxlciwgcnVsZT86T3Bjb2RlUnVsZSl7XHJcblx0XHRcdHRoaXMuY29kZSA9IGNvZGU7XHJcblx0XHRcdHRoaXMubmFtZSA9IG5hbWU7XHJcblx0XHRcdHRoaXMubG9hZEFyZ3MgPSBsb2FkQXJncztcclxuXHRcdFx0dGhpcy5zdG9yZUFyZ3MgPSBzdG9yZUFyZ3M7XHJcblx0XHRcdHRoaXMuaGFuZGxlciA9IGhhbmRsZXI7XHJcblx0XHRcdHRoaXMucnVsZSA9IHJ1bGU7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGV4cG9ydCBjb25zdCBlbnVtIEdlc3RhbHQgIHtcclxuICAgICAgICAgICAgR2x1bHhWZXJzaW9uID0gMCxcclxuICAgICAgICAgICAgVGVycFZlcnNpb24gPSAxLFxyXG4gICAgICAgICAgICBSZXNpemVNZW0gPSAyLFxyXG4gICAgICAgICAgICBVbmRvID0gMyxcclxuICAgICAgICAgICAgSU9TeXN0ZW0gPSA0LFxyXG4gICAgICAgICAgICBVbmljb2RlID0gNSxcclxuICAgICAgICAgICAgTWVtQ29weSA9IDYsXHJcbiAgICAgICAgICAgIE1BbGxvYyA9IDcsXHJcbiAgICAgICAgICAgIE1BbGxvY0hlYXAgPSA4LFxyXG4gICAgICAgICAgICBBY2NlbGVyYXRpb24gPSA5LFxyXG4gICAgICAgICAgICBBY2NlbEZ1bmMgPSAxMCxcclxuICAgICAgICAgICAgRmxvYXQgPSAxMSxcclxuXHRcdFx0XHJcblx0XHRcdC8qKiAgXHJcblx0XHRcdCAqIEV4dFVuZG8gKDEyKTogXHJcblx0XHRcdCAqIFJldHVybnMgMSBpZiB0aGUgaW50ZXJwcmV0ZXIgc3VwcG9ydHMgdGhlIGhhc3VuZG8gYW5kIGRpc2NhcmR1bmRvIG9wY29kZXMuIFxyXG5cdFx0XHQgKiAoVGhpcyBtdXN0IHRydWUgZm9yIGFueSB0ZXJwIHN1cHBvcnRpbmcgR2x1bHggMy4xLjMuIE9uIGEgdGVycCB3aGljaCBkb2VzIG5vdCBzdXBwb3J0IHVuZG8gZnVuY3Rpb25hbGl0eSwgXHJcblx0XHRcdCAqIHRoZXNlIG9wY29kZXMgd2lsbCBiZSBjYWxsYWJsZSBidXQgd2lsbCBmYWlsLilcclxuXHRcdFx0ICovXHJcblx0XHRcdEV4dFVuZG8gPSAxMiBcclxuICAgICAgICB9XHJcblx0XHRcclxuXHRcdC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gU2VsZWN0cyBhIGZ1bmN0aW9uIGZvciB0aGUgRnlyZVZNIHN5c3RlbSBjYWxsIG9wY29kZS5cclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIGV4cG9ydCBjb25zdCBlbnVtIEZ5cmVDYWxsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyBSZWFkcyBhIGxpbmUgZnJvbSB0aGUgdXNlcjogYXJnc1sxXSA9IGJ1ZmZlciwgYXJnc1syXSA9IGJ1ZmZlciBzaXplLlxyXG4gICAgICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICBSZWFkTGluZSA9IDEsXHJcblx0XHRcdCAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gUmVhZHMgYSBjaGFyYWN0ZXIgZnJvbSB0aGUgdXNlcjogcmVzdWx0ID0gdGhlIDE2LWJpdCBVbmljb2RlIHZhbHVlLlxyXG4gICAgICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICBSZWFkS2V5ID0gMixcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gQ29udmVydHMgYSBjaGFyYWN0ZXIgdG8gbG93ZXJjYXNlOiBhcmdzWzFdID0gdGhlIGNoYXJhY3RlcixcclxuICAgICAgICAgICAgLy8vIHJlc3VsdCA9IHRoZSBsb3dlcmNhc2VkIGNoYXJhY3Rlci5cclxuICAgICAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgVG9Mb3dlciA9IDMsXHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIENvbnZlcnRzIGEgY2hhcmFjdGVyIHRvIHVwcGVyY2FzZTogYXJnc1sxXSA9IHRoZSBjaGFyYWN0ZXIsXHJcbiAgICAgICAgICAgIC8vLyByZXN1bHQgPSB0aGUgdXBwZXJjYXNlZCBjaGFyYWN0ZXIuXHJcbiAgICAgICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIFRvVXBwZXIgPSA0LFxyXG4gICAgICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgICAgIC8vLyBTZWxlY3RzIGFuIG91dHB1dCBjaGFubmVsOiBhcmdzWzFdID0gYW4gT3V0cHV0Q2hhbm5lbCB2YWx1ZSAoc2VlIE91dHB1dC5jcykuXHJcbiAgICAgICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIENoYW5uZWwgPSA1LCBcclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gUmVnaXN0ZXJzIGEgdmVuZWVyIGZ1bmN0aW9uIGFkZHJlc3Mgb3IgY29uc3RhbnQgdmFsdWU6IGFyZ3NbMV0gPSBhXHJcbiAgICAgICAgICAgIC8vLyBWZW5lZXJTbG90IHZhbHVlIChzZWUgVmVuZWVyLmNzKSwgYXJnc1syXSA9IHRoZSBmdW5jdGlvbiBhZGRyZXNzIG9yXHJcbiAgICAgICAgICAgIC8vLyBjb25zdGFudCB2YWx1ZSwgcmVzdWx0ID0gbm9uemVybyBpZiB0aGUgdmFsdWUgd2FzIGFjY2VwdGVkLlxyXG4gICAgICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICBTZXRWZW5lZXIgPSA2LFxyXG5cdFx0XHQvLy8gWE1MIEZpbHRlcmluZyB3aWxsIHR1cm4gdGhpbmdzIGludG8gWEFNTCB0YWdzIGZvciBTaWx2ZXJsaWdodCBvciBXUEYuXHJcblx0XHRcdFhNTEZpbHRlciA9IDcsXHJcblx0XHRcdC8vLyBzdHlsZXM6IHsgUm9tYW4gPSAxLCBCb2xkID0gMiwgSXRhbGljID0gMywgRml4ZWQgPSA0LCBWYXJpYWJsZSA9IDUsfVxyXG5cdFx0XHRTZXRTdHlsZSA9IDhcclxuICAgICAgICB9XHJcblxyXG5cdFxyXG5cdC8vIGNvZXJjZSBKYXZhc2NyaXB0IG51bWJlciBpbnRvIHVpbnQzMiByYW5nZVxyXG5cdGZ1bmN0aW9uIHVpbnQzMih4Om51bWJlcikgOiBudW1iZXJ7XHJcblx0XHRyZXR1cm4geCA+Pj4gMDtcclxuXHR9XHJcblx0XHJcblx0Ly8gY29lcmNlIHVpbnQzMiBudW1iZXIgaW50byAgKHNpZ25lZCEpIGludDMyIHJhbmdlXHJcblx0XHJcblx0ZnVuY3Rpb24gaW50MzIoeDogbnVtYmVyKSA6bnVtYmVye1xyXG5cdFx0cmV0dXJuIHggfCAwO1xyXG5cdH1cclxuXHRcclxuXHRcclxuXHRleHBvcnQgbW9kdWxlIE9wY29kZXN7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gaW5pdE9wY29kZXMoKXtcclxuXHRcdFx0bGV0IG9wY29kZXM6IE9wY29kZVtdID0gW107XHJcblx0XHRcdFxyXG5cdFx0XHRmdW5jdGlvbiBvcGNvZGUoY29kZTogbnVtYmVyLCBuYW1lOiBzdHJpbmcsIGxvYWRBcmdzOiBudW1iZXIsIHN0b3JlQXJnczogbnVtYmVyLCBoYW5kbGVyOk9wY29kZUhhbmRsZXIsIHJ1bGU/Ok9wY29kZVJ1bGUpe1xyXG5cdFx0XHRcdG9wY29kZXNbY29kZV0gPSBuZXcgT3Bjb2RlKGNvZGUsIG5hbWUsIGxvYWRBcmdzLCBzdG9yZUFyZ3MsIGhhbmRsZXIsIHJ1bGUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHgwMCwgJ25vcCcsIDAsIDAsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uKCl7IH0pO1xyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MTAsICdhZGQnLCAyLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGFkZChhLGIpeyByZXR1cm4gdWludDMyKGErYil9KTtcclxuXHRcdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MTEsICdzdWInLCAyLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHN1YihhLGIpeyByZXR1cm4gdWludDMyKGEtYil9KTtcdFx0XHRcdFxyXG5cdFx0XHJcblx0XHRcdG9wY29kZSgweDEyLCAnbXVsJywgMiwgMSxcclxuXHRcdFx0XHRmdW5jdGlvbiBtdWwoYSxiKXsgcmV0dXJuIHVpbnQzMigoPGFueT5NYXRoKS5pbXVsKGludDMyKGEpLGludDMyKGIpKSl9KTtcclxuXHRcdFxyXG5cdFx0XHRvcGNvZGUoMHgxMywgJ2RpdicsIDIsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gZGl2KGEsYil7IHJldHVybiB1aW50MzIoaW50MzIoYSkgLyBpbnQzMihiKSl9KTtcclxuXHRcdFxyXG5cdFx0XHRvcGNvZGUoMHgxNCwgJ21vZCcsIDIsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gbW9kKGEsYil7IHJldHVybiB1aW50MzIoaW50MzIoYSkgJSBpbnQzMihiKSl9KTtcclxuXHRcclxuXHRcdFx0Ly8gVE9ETzogY2hlY2sgdGhlIHNwZWNzXHJcblx0XHRcdG9wY29kZSgweDE1LCAnbmVnJywgMSwgMSxcclxuXHRcdFx0XHRmdW5jdGlvbiBuZWcoeCl7IFxyXG5cdFx0XHRcdHJldHVybiB1aW50MzIoMHhGRkZGRkZGRiAtIHggKyAxKX0pO1xyXG5cdFxyXG5cdFx0XHQvLyBUT0RPOiBjaGVjayBpZiBpdCB3b3JrcywgSlMgaGFzIHNpZ25lZCBpbnRzLCB3ZSB3YW50IHVpbnRcclxuXHRcdFx0b3Bjb2RlKDB4MTgsICdiaXRhbmQnLCAyLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGJpdGFuZChhLGIpeyByZXR1cm4gdWludDMyKHVpbnQzMihhKSAmIHVpbnQzMihiKSl9KTtcclxuXHRcdFxyXG5cdFx0XHQvLyBUT0RPOiBjaGVjayBpZiBpdCB3b3JrcywgSlMgaGFzIHNpZ25lZCBpbnRzLCB3ZSB3YW50IHVpbnRcclxuXHRcdFx0b3Bjb2RlKDB4MTksICdiaXRvcicsIDIsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gYml0b3IoYSxiKXsgcmV0dXJuIHVpbnQzMih1aW50MzIoYSkgfCB1aW50MzIoYikpfSk7XHJcblx0XHRcclxuXHRcdFx0Ly8gVE9ETzogY2hlY2sgaWYgaXQgd29ya3MsIEpTIGhhcyBzaWduZWQgaW50cywgd2Ugd2FudCB1aW50XHJcblx0XHRcdG9wY29kZSgweDFBLCAnYml0eG9yJywgMiwgMSxcclxuXHRcdFx0XHRmdW5jdGlvbiBiaXR4b3IoYSxiKXsgcmV0dXJuIHVpbnQzMih1aW50MzIoYSkgXiB1aW50MzIoYikpfSk7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBUT0RPOiBjaGVjayBpZiBpdCB3b3JrcywgSlMgaGFzIHNpZ25lZCBpbnRzLCB3ZSB3YW50IHVpbnRcdFxyXG5cdFx0XHRvcGNvZGUoMHgxQiwgJ2JpdG5vdCcsIDEsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gYml0bm90KHgpeyB4ID0gfnVpbnQzMih4KTsgaWYgKHg8MCkgcmV0dXJuIDEgKyB4ICsgMHhGRkZGRkZGRjsgcmV0dXJuIHg7IH0pO1xyXG5cdFxyXG5cdFx0XHRvcGNvZGUoMHgxQywgJ3NoaWZ0bCcsIDIsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gc2hpZnRsKGEsYil7IFxyXG5cdFx0XHRcdFx0aWYgKHVpbnQzMihiKSA+PSAzMikgcmV0dXJuIDA7XHJcblx0XHRcdFx0XHRyZXR1cm4gdWludDMyKGEgPDwgYil9KTtcclxuXHJcblx0XHRcdG9wY29kZSgweDFELCAnc3NoaWZ0cicsIDIsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gc3NoaWZ0cihhLGIpeyBcclxuXHRcdFx0XHRcdGlmICh1aW50MzIoYikgPj0gMzIpIHJldHVybiAoYSAmIDB4ODAwMDAwMDApID8gMHhGRkZGRkZGRiA6IDA7XHJcblx0XHRcdFx0XHRyZXR1cm4gdWludDMyKGludDMyKGEpID4+IGIpfSk7XHJcblx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHgxRSwgJ3VzaGlmdHInLCAyLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHVzaGlmdHIoYSxiKXsgXHJcblx0XHRcdFx0XHRpZiAodWludDMyKGIpID49IDMyKSByZXR1cm4gMDtcclxuXHRcdFx0XHRcdHJldHVybiB1aW50MzIodWludDMyKGEpID4+PiBiKX0pO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MjAsICdqdW1wJywgMSwgMCwgXHJcblx0XHRcdFx0ZnVuY3Rpb24ganVtcChqdW1wVmVjdG9yKXtcclxuXHRcdFx0XHRcdHRoaXMudGFrZUJyYW5jaChqdW1wVmVjdG9yKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHgwMjIsICdqeicsIDIsIDAsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGp6KGNvbmRpdGlvbiwganVtcFZlY3Rvcil7XHJcblx0XHRcdFx0XHRpZiAoY29uZGl0aW9uID09PSAwKVxyXG5cdFx0XHRcdFx0XHR0aGlzLnRha2VCcmFuY2goanVtcFZlY3Rvcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MDIzLCAnam56JywgMiwgMCwgXHJcblx0XHRcdFx0ZnVuY3Rpb24gam56KGNvbmRpdGlvbiwganVtcFZlY3Rvcil7XHJcblx0XHRcdFx0XHRpZiAoY29uZGl0aW9uICE9PSAwKVxyXG5cdFx0XHRcdFx0XHR0aGlzLnRha2VCcmFuY2goanVtcFZlY3Rvcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHJcblx0XHRcdG9wY29kZSgweDAyNCwgJ2plcScsIDMsIDAsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGplcShhLCBiLCBqdW1wVmVjdG9yKXtcclxuXHRcdFx0XHRcdGlmIChhID09PSBiIHx8IHVpbnQzMihhKSA9PT0gdWludDMyKGIpKVxyXG5cdFx0XHRcdFx0XHR0aGlzLnRha2VCcmFuY2goanVtcFZlY3Rvcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MDI1LCAnam5lJywgMywgMCwgXHJcblx0XHRcdFx0ZnVuY3Rpb24gam5lKGEsIGIsIGp1bXBWZWN0b3Ipe1xyXG5cdFx0XHRcdFx0aWYgKHVpbnQzMihhKSAhPT0gdWludDMyKGIpKVxyXG5cdFx0XHRcdFx0XHR0aGlzLnRha2VCcmFuY2goanVtcFZlY3Rvcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MDI2LCAnamx0JywgMywgMCwgXHJcblx0XHRcdFx0ZnVuY3Rpb24gamx0KGEsIGIsIGp1bXBWZWN0b3Ipe1xyXG5cdFx0XHRcdFx0aWYgKGludDMyKGEpIDwgaW50MzIoYikpXHJcblx0XHRcdFx0XHRcdHRoaXMudGFrZUJyYW5jaChqdW1wVmVjdG9yKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHgwMjcsICdqZ2UnLCAzLCAwLCBcclxuXHRcdFx0XHRmdW5jdGlvbiBqZ2UoYSwgYiwganVtcFZlY3Rvcil7XHJcblx0XHRcdFx0XHRpZiAoaW50MzIoYSkgPj0gaW50MzIoYikpXHJcblx0XHRcdFx0XHRcdHRoaXMudGFrZUJyYW5jaChqdW1wVmVjdG9yKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHgwMjgsICdqZ3QnLCAzLCAwLCBcclxuXHRcdFx0XHRmdW5jdGlvbiBqZ3QoYSwgYiwganVtcFZlY3Rvcil7XHJcblx0XHRcdFx0XHRpZiAoaW50MzIoYSkgPiBpbnQzMihiKSlcclxuXHRcdFx0XHRcdFx0dGhpcy50YWtlQnJhbmNoKGp1bXBWZWN0b3IpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdG9wY29kZSgweDAyOSwgJ2psZScsIDMsIDAsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGpsZShhLCBiLCBqdW1wVmVjdG9yKXtcclxuXHRcdFx0XHRcdGlmIChpbnQzMihhKSA8PSBpbnQzMihiKSlcclxuXHRcdFx0XHRcdFx0dGhpcy50YWtlQnJhbmNoKGp1bXBWZWN0b3IpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdC8vIFRPRE86IGNoZWNrIGlmIGl0IHdvcmtzLCBKUyBoYXMgc2lnbmVkIGludHMsIHdlIHdhbnQgdWludFxyXG5cdFx0XHRvcGNvZGUoMHgwMkEsICdqbHR1JywgMywgMCwgXHJcblx0XHRcdFx0ZnVuY3Rpb24gamx0dShhLCBiLCBqdW1wVmVjdG9yKXtcclxuXHRcdFx0XHRcdGlmIChhIDwgYilcclxuXHRcdFx0XHRcdFx0dGhpcy50YWtlQnJhbmNoKGp1bXBWZWN0b3IpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdC8vIFRPRE86IGNoZWNrIGlmIGl0IHdvcmtzLCBKUyBoYXMgc2lnbmVkIGludHMsIHdlIHdhbnQgdWludFxyXG5cdFx0XHRvcGNvZGUoMHgwMkIsICdqZ2V1JywgMywgMCwgXHJcblx0XHRcdFx0ZnVuY3Rpb24gamdldShhLCBiLCBqdW1wVmVjdG9yKXtcclxuXHRcdFx0XHRcdGlmIChhID49IGIpXHJcblx0XHRcdFx0XHRcdHRoaXMudGFrZUJyYW5jaChqdW1wVmVjdG9yKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHQvLyBUT0RPOiBjaGVjayBpZiBpdCB3b3JrcywgSlMgaGFzIHNpZ25lZCBpbnRzLCB3ZSB3YW50IHVpbnRcclxuXHRcdFx0b3Bjb2RlKDB4MDJDLCAnamd0dScsIDMsIDAsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGpndHUoYSwgYiwganVtcFZlY3Rvcil7XHJcblx0XHRcdFx0XHRpZiAoYSA+IGIpXHJcblx0XHRcdFx0XHRcdHRoaXMudGFrZUJyYW5jaChqdW1wVmVjdG9yKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHQvLyBUT0RPOiBjaGVjayBpZiBpdCB3b3JrcywgSlMgaGFzIHNpZ25lZCBpbnRzLCB3ZSB3YW50IHVpbnRcclxuXHRcdFx0b3Bjb2RlKDB4MDJELCAnamxldScsIDMsIDAsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGpsZXUoYSwgYiwganVtcFZlY3Rvcil7XHJcblx0XHRcdFx0XHRpZiAoYSA8PSBiKVxyXG5cdFx0XHRcdFx0XHR0aGlzLnRha2VCcmFuY2goanVtcFZlY3Rvcik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDAxMDQsICdqdW1wYWJzJywgMSwgMCwgXHJcblx0XHRcdFx0ZnVuY3Rpb24ganVtcGFicyhhZGRyZXNzKXtcclxuXHRcdFx0XHRcdHRoaXMuUEMgPSBhZGRyZXNzO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDMwLCAnY2FsbCcsIDIsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gY2FsbChhZGRyZXNzOm51bWJlciwgYXJnYzpudW1iZXIsIGRlc3RUeXBlOm51bWJlciwgZGVzdEFkZHI6bnVtYmVyKXtcclxuXHRcdFx0XHRcdGxldCBhcmdzID0gW107XHJcblx0XHRcdFx0XHR3aGlsZShhcmdjLS0pe1xyXG5cdFx0XHRcdFx0XHRhcmdzLnB1c2godGhpcy5wb3AoKSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHRoaXMucGVyZm9ybUNhbGwoYWRkcmVzcywgYXJncywgZGVzdFR5cGUsIGRlc3RBZGRyLCB0aGlzLlBDKTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdE9wY29kZVJ1bGUuRGVsYXllZFN0b3JlXHJcblx0XHRcdClcclxuXHJcblx0XHRcdG9wY29kZSgweDE2MCwgJ2NhbGxmJywgMSwgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBjYWxsZihhZGRyZXNzOm51bWJlciwgZGVzdFR5cGU6bnVtYmVyLCBkZXN0QWRkcjpudW1iZXIpe1xyXG5cdFx0XHRcdFx0dGhpcy5wZXJmb3JtQ2FsbChhZGRyZXNzLCBudWxsLCBkZXN0VHlwZSwgZGVzdEFkZHIsIHRoaXMuUEMpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0T3Bjb2RlUnVsZS5EZWxheWVkU3RvcmVcclxuXHRcdFx0KVxyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTYxLCAnY2FsbGZpJywgMiwgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBjYWxsZmkoYWRkcmVzczpudW1iZXIsIGFyZzogbnVtYmVyLCBkZXN0VHlwZTpudW1iZXIsIGRlc3RBZGRyOm51bWJlcil7XHJcblx0XHRcdFx0XHR0aGlzLnBlcmZvcm1DYWxsKGFkZHJlc3MsIFt1aW50MzIoYXJnKV0sIGRlc3RUeXBlLCBkZXN0QWRkciwgdGhpcy5QQyk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRPcGNvZGVSdWxlLkRlbGF5ZWRTdG9yZVxyXG5cdFx0XHQpXHJcblxyXG5cdFx0XHRvcGNvZGUoMHgxNjIsICdjYWxsZmlpJywgMywgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBjYWxsZmlpKGFkZHJlc3M6bnVtYmVyLCBhcmcxOiBudW1iZXIsIGFyZzI6IG51bWJlciwgZGVzdFR5cGU6bnVtYmVyLCBkZXN0QWRkcjpudW1iZXIpe1xyXG5cdFx0XHRcdFx0dGhpcy5wZXJmb3JtQ2FsbChhZGRyZXNzLCBbdWludDMyKGFyZzEpLCB1aW50MzIoYXJnMildLCBkZXN0VHlwZSwgZGVzdEFkZHIsIHRoaXMuUEMpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0T3Bjb2RlUnVsZS5EZWxheWVkU3RvcmVcclxuXHRcdFx0KVxyXG5cdFx0XHJcblx0XHRcdG9wY29kZSgweDE2MywgJ2NhbGxmaWlpJywgNCwgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBjYWxsZmlpaShhZGRyZXNzOm51bWJlciwgYXJnMTogbnVtYmVyLCBhcmcyOiBudW1iZXIsIGFyZzM6IG51bWJlciwgZGVzdFR5cGU6bnVtYmVyLCBkZXN0QWRkcjpudW1iZXIpe1xyXG5cdFx0XHRcdFx0dGhpcy5wZXJmb3JtQ2FsbChhZGRyZXNzLCBbdWludDMyKGFyZzEpLCB1aW50MzIoYXJnMiksIHVpbnQzMihhcmczKV0sIGRlc3RUeXBlLCBkZXN0QWRkciwgdGhpcy5QQyk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRPcGNvZGVSdWxlLkRlbGF5ZWRTdG9yZVxyXG5cdFx0XHQpXHJcblxyXG5cdFx0XHRvcGNvZGUoMHgzMSwgJ3JldHVybicsIDEsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gX3JldHVybihyZXRWYWw6bnVtYmVyKXtcclxuXHRcdFx0XHRcdHRoaXMubGVhdmVGdW5jdGlvbih1aW50MzIocmV0VmFsKSk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MzIsIFwiY2F0Y2hcIiwgMCwgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBfY2F0Y2goZGVzdFR5cGU6bnVtYmVyLCBkZXN0QWRkcjpudW1iZXIsIGFkZHJlc3M6bnVtYmVyKXtcclxuXHRcdFx0XHRcdHRoaXMucHVzaENhbGxTdHViKGRlc3RUeXBlLCBkZXN0QWRkciwgdGhpcy5QQywgdGhpcy5GUCk7XHJcblx0XHRcdFx0XHQgLy8gdGhlIGNhdGNoIHRva2VuIGlzIHRoZSB2YWx1ZSBvZiBzcCBhZnRlciBwdXNoaW5nIHRoYXQgc3R1YlxyXG4gICAgICAgICAgIFx0XHRcdHRoaXMucGVyZm9ybURlbGF5ZWRTdG9yZShkZXN0VHlwZSwgZGVzdEFkZHIsIHRoaXMuU1ApO1xyXG5cdFx0XHRcdFx0dGhpcy50YWtlQnJhbmNoKGFkZHJlc3MpXHRcdFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0T3Bjb2RlUnVsZS5DYXRjaFxyXG5cdFx0XHQpXHJcblx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHgzMywgXCJ0aHJvd1wiLCAyLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIF90aHJvdyhleCwgY2F0Y2hUb2tlbil7XHJcblx0XHRcdFx0XHRpZiAoY2F0Y2hUb2tlbiA+IHRoaXMuU1ApXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcImludmFsaWQgY2F0Y2ggdG9rZW4gJHtjYXRjaFRva2VufVwiKTtcclxuXHRcdFx0XHRcdC8vIHBvcCB0aGUgc3RhY2sgYmFjayBkb3duIHRvIHRoZSBzdHViIHB1c2hlZCBieSBjYXRjaFxyXG5cdFx0XHRcdFx0dGhpcy5TUCA9IGNhdGNoVG9rZW47XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vIHJlc3RvcmUgZnJvbSB0aGUgc3R1YlxyXG5cdFx0XHRcdFx0bGV0IHN0dWIgPSB0aGlzLnBvcENhbGxTdHViKCk7XHJcblx0XHRcdFx0XHR0aGlzLlBDID0gc3R1Yi5QQztcclxuXHRcdFx0XHRcdHRoaXMuRlAgPSBzdHViLmZyYW1lUHRyO1xyXG5cdFx0XHRcdFx0dGhpcy5mcmFtZUxlbiA9IHRoaXMuc3RhY2sucmVhZEludDMyKHRoaXMuRlApO1xyXG5cdFx0XHRcdFx0dGhpcy5sb2NhbHNQb3MgPSB0aGlzLnN0YWNrLnJlYWRJbnQzMih0aGlzLkZQICsgNCk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vIHN0b3JlIHRoZSB0aHJvd24gdmFsdWUgYW5kIHJlc3VtZSBhZnRlciB0aGUgY2F0Y2ggb3Bjb2RlXHJcblx0XHRcdFx0XHR0aGlzLnBlcmZvcm1EZWxheWVkU3RvcmUoc3R1Yi5kZXN0VHlwZSwgc3R1Yi5kZXN0QWRkciwgZXgpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpXHJcblx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHgzNCwgXCJ0YWlsY2FsbFwiLCAyLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHRhaWxjYWxsKGFkZHJlc3M6IG51bWJlciwgYXJnYzogbnVtYmVyKXtcclxuXHRcdFx0XHRcdGxldCBhcmd2ID0gW107XHJcblx0XHRcdFx0XHR3aGlsZShhcmdjLS0pe1xyXG5cdFx0XHRcdFx0XHRhcmd2LnB1c2godGhpcy5wb3AoKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0aGlzLnBlcmZvcm1DYWxsKGFkZHJlc3MsIGFyZ3YsIDAsIDAsIDAsIHRydWUpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHgxODAsICdhY2NlbGZ1bmMnLCAyLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uKHNsb3QsIHZhbHVlKXtcclxuXHRcdFx0XHRcdHNldFNsb3RHbHVseC5jYWxsKHRoaXMsIGZhbHNlLCBzbG90LCB2YWx1ZSk7XHJcblx0XHRcdFx0fSk7XHRcclxuXHRcdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MTgxLCAnYWNjZWxwYXJhbScsIDIsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24oc2xvdCwgdmFsdWUpe1xyXG5cdFx0XHRcdFx0c2V0U2xvdEdsdWx4LmNhbGwodGhpcywgdHJ1ZSwgc2xvdCwgdmFsdWUpO1xyXG5cdFx0XHRcdH0pO1x0XHRcclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDQwLCBcImNvcHlcIiwgMSwgMSwgXHJcblx0XHRcdFx0ZnVuY3Rpb24gY29weSh4Om51bWJlcil7XHJcblx0XHRcdFx0XHRyZXR1cm4gdWludDMyKHgpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4NDEsIFwiY29weXNcIiwgMSwgMSwgXHJcblx0XHRcdFx0ZnVuY3Rpb24gY29weXMoeDpudW1iZXIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHggJiAweEZGRkY7XHJcblx0XHRcdFx0fSwgT3Bjb2RlUnVsZS5JbmRpcmVjdDE2Qml0KTtcclxuXHJcblx0XHRcdG9wY29kZSgweDQyLCBcImNvcHliXCIsIDEsIDEsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGNvcHliKHg6bnVtYmVyKXtcclxuXHRcdFx0XHRcdHJldHVybiB4ICYgMHhGRjtcclxuXHRcdFx0XHR9LCBPcGNvZGVSdWxlLkluZGlyZWN0OEJpdCk7XHJcblx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHg0NCwgXCJzZXhzXCIsIDEsIDEsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHNleHMoeDpudW1iZXIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHggJiAweDgwMDAgPyB1aW50MzIoeCB8IDB4RkZGRjAwMDApIDogeCAmIDB4MDAwMEZGRkY7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHg0NSwgXCJzZXhiXCIsIDEsIDEsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHNleGIoeDpudW1iZXIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHggJiAweDgwID8gdWludDMyKHggfCAweEZGRkZGRjAwKSA6IHggJiAweDAwMDAwMEZGO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4NDgsIFwiYWxvYWRcIiwgMiwgMSxcclxuXHRcdFx0XHRmdW5jdGlvbiBhbG9hZChhcnJheTogbnVtYmVyLCBpbmRleDogbnVtYmVyKXtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmltYWdlLnJlYWRJbnQzMih1aW50MzIoYXJyYXkrNCppbmRleCkpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4NDksIFwiYWxvYWRzXCIsIDIsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gYWxvYWRzKGFycmF5OiBudW1iZXIsIGluZGV4OiBudW1iZXIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuaW1hZ2UucmVhZEludDE2KHVpbnQzMihhcnJheSsyKmluZGV4KSk7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHg0QSwgXCJhbG9hZGJcIiwgMiwgMSxcclxuXHRcdFx0XHRmdW5jdGlvbiBhbG9hZGIoYXJyYXk6IG51bWJlciwgaW5kZXg6IG51bWJlcil7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5pbWFnZS5yZWFkQnl0ZSh1aW50MzIoYXJyYXkraW5kZXgpKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdG9wY29kZSgweDRCLCBcImFsb2FkYml0XCIsIDIsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gYWxvYWRiaXQoYXJyYXk6IG51bWJlciwgaW5kZXg6IG51bWJlcil7XHJcblx0XHRcdFx0XHRpbmRleCA9IGludDMyKGluZGV4KTtcclxuXHRcdFx0XHRcdGxldCBiaXR4ID0gaW5kZXggJiA3O1xyXG5cdFx0XHRcdFx0bGV0IGFkZHJlc3MgPSBhcnJheTtcclxuXHRcdFx0XHRcdGlmIChpbmRleCA+PSAwKXtcclxuXHRcdFx0XHRcdFx0YWRkcmVzcyArPSAoaW5kZXg+PjMpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGFkZHJlc3MgLT0gKDErKCgtMS1pbmRleCk+PjMpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxldCBieXRlID0gIHRoaXMuaW1hZ2UucmVhZEJ5dGUodWludDMyKGFkZHJlc3MpKTtcclxuXHRcdFx0XHRcdHJldHVybiBieXRlICYgKDEgPDwgYml0eCkgPyAxIDogMDtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdG9wY29kZSgweDRDLCBcImFzdG9yZVwiLCAzLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGFzdG9yZShhcnJheTogbnVtYmVyLCBpbmRleDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKXtcclxuXHRcdFx0XHRcdHRoaXMuaW1hZ2Uud3JpdGVJbnQzMihhcnJheSs0KmludDMyKGluZGV4KSwgdWludDMyKHZhbHVlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4NEQsIFwiYXN0b3Jlc1wiLCAzLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGFzdG9yZXMoYXJyYXk6IG51bWJlciwgaW5kZXg6IG51bWJlciwgdmFsdWU6IG51bWJlcil7XHJcblx0XHRcdFx0XHR2YWx1ZSA9IHZhbHVlICYgMHhGRkZGO1xyXG5cdFx0XHRcdFx0dGhpcy5pbWFnZS53cml0ZUJ5dGVzKGFycmF5KzIqaW5kZXgsIHZhbHVlID4+IDgsIHZhbHVlICYgMHhGRiApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDRFLCBcImFzdG9yZWJcIiwgMywgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBhc3RvcmViKGFycmF5OiBudW1iZXIsIGluZGV4OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpe1xyXG5cdFx0XHRcdFx0dGhpcy5pbWFnZS53cml0ZUJ5dGVzKGFycmF5K2luZGV4LCB2YWx1ZSAmIDB4RkYgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHg0RiwgXCJhc3RvcmViaXRcIiwgMywgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBhc3RvcmViaXQoYXJyYXk6IG51bWJlciwgaW5kZXg6IG51bWJlciwgdmFsdWU6IG51bWJlcil7XHJcblx0XHRcdFx0XHRpbmRleCA9IGludDMyKGluZGV4KTtcclxuXHRcdFx0XHRcdGxldCBiaXR4ID0gaW5kZXggJiA3O1xyXG5cdFx0XHRcdFx0bGV0IGFkZHJlc3MgPSBhcnJheTtcclxuXHRcdFx0XHRcdGlmIChpbmRleCA+PSAwKXtcclxuXHRcdFx0XHRcdFx0YWRkcmVzcyArPSAoaW5kZXg+PjMpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGFkZHJlc3MgLT0gKDErKCgtMS1pbmRleCk+PjMpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGxldCBieXRlID0gIHRoaXMuaW1hZ2UucmVhZEJ5dGUoYWRkcmVzcyk7XHJcblx0XHRcdFx0XHRpZiAodmFsdWUgPT09IDApe1xyXG5cdFx0XHRcdFx0XHRieXRlICY9IH4oMSA8PCBiaXR4KTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRieXRlIHw9ICgxIDw8IGJpdHgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGhpcy5pbWFnZS53cml0ZUJ5dGVzKGFkZHJlc3MsIGJ5dGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDcwLCAnc3RyZWFtY2hhcicsIDEsIDAsIEVuZ2luZS5wcm90b3R5cGUuc3RyZWFtQ2hhckNvcmUpO1xyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4NzMsICdzdHJlYW11bmljaGFyJywgMSwgMCwgRW5naW5lLnByb3RvdHlwZS5zdHJlYW1VbmlDaGFyQ29yZSk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHg3MSwgJ3N0cmVhbW51bScsIDEsIDAsIEVuZ2luZS5wcm90b3R5cGUuc3RyZWFtTnVtQ29yZSk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHg3MiwgJ3N0cmVhbXN0cicsIDEsIDAsIEVuZ2luZS5wcm90b3R5cGUuc3RyZWFtU3RyQ29yZSk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHgxMzAsICdnbGsnLCAyLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGdsayhjb2RlOm51bWJlciwgYXJnYzogbnVtYmVyKXtcclxuXHRcdFx0XHRcdHN3aXRjaCh0aGlzLmdsa01vZGUpe1xyXG5cdFx0XHRcdFx0XHRjYXNlIEdsa01vZGUuTm9uZTpcclxuXHRcdFx0XHRcdFx0XHQvLyBub3QgcmVhbGx5IHN1cHBvcnRlZCwganVzdCBjbGVhciB0aGUgc3RhY2tcclxuXHRcdFx0XHRcdFx0XHR3aGlsZShhcmdjLS0pe1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5wb3AoKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdFx0XHRcdGNhc2UgR2xrTW9kZS5XcmFwcGVyOlxyXG5cdFx0XHRcdFx0XHQgIFx0cmV0dXJuIEdsa1dyYXBwZXJDYWxsLmNhbGwodGhpcywgY29kZSwgYXJnYyk7XHJcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBnbGtNb2RlICR7dGhpcy5nbGtNb2RlfWApO1x0XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MTQwLCAnZ2V0c3RyaW5ndGJsJywgMCwgMSxcclxuXHRcdFx0XHRmdW5jdGlvbiBnZXRzdHJpbmd0YmwoKXtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmRlY29kaW5nVGFibGU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MTQxLCAnc2V0c3RyaW5ndGJsJywgMSwgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBzZXRzdHJpbmd0YmwoYWRkcil7XHJcblx0XHRcdFx0XHR0aGlzLmRlY29kaW5nVGFibGUgPSBhZGRyO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTQ4LCAnZ2V0aW9zeXMnLCAwLCAyLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGdldGlvc3lzKCl7XHJcblx0XHRcdFx0XHRzd2l0Y2godGhpcy5vdXRwdXRTeXN0ZW0pe1xyXG5cdFx0XHRcdFx0XHRjYXNlIElPU3lzdGVtLk51bGw6XHRyZXR1cm4gWzAsMF07XHJcblx0XHRcdFx0XHRcdGNhc2UgSU9TeXN0ZW0uRmlsdGVyOiByZXR1cm4gWzEsIHRoaXMuZmlsdGVyQWRkcmVzc107XHJcblx0XHRcdFx0XHRcdGNhc2UgSU9TeXN0ZW0uQ2hhbm5lbHM6IHJldHVybiBbMjAsIDBdO1xyXG5cdFx0XHRcdFx0XHRjYXNlIElPU3lzdGVtLkdsazogcmV0dXJuIFsyLCAwXTtcdFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdG9wY29kZSgweDE0OSwgJ3NldGlvc3lzJywgMiwgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBzZXRpb3N5cyhzeXN0ZW0sIHJvY2spe1xyXG5cdFx0XHRcdFx0c3dpdGNoKHN5c3RlbSl7XHJcblx0XHRcdFx0XHRcdGNhc2UgMDpcclxuXHRcdFx0XHRcdFx0XHR0aGlzLm91dHB1dFN5c3RlbSA9IElPU3lzdGVtLk51bGw7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDE6XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5vdXRwdXRTeXN0ZW0gPSBJT1N5c3RlbS5GaWx0ZXI7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5maWx0ZXJBZGRyZXNzID0gcm9jaztcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5nbGtNb2RlICE9PSBHbGtNb2RlLldyYXBwZXIpXHJcblx0XHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJHbGsgd3JhcHBlciBzdXBwb3J0IGhhcyBub3QgYmVlbiBlbmFibGVkXCIpO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMub3V0cHV0U3lzdGVtID0gSU9TeXN0ZW0uR2xrO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0Y2FzZSAyMDpcclxuXHRcdFx0XHRcdFx0XHRpZiAoIXRoaXMuZW5hYmxlRnlyZVZNKVxyXG5cdFx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRnlyZVZNIHN1cHBvcnQgaGFzIGJlZW4gZGlzYWJsZWRcIik7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5vdXRwdXRTeXN0ZW0gPSBJT1N5c3RlbS5DaGFubmVscztcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnJlY29nbml6ZWQgb3V0cHV0IHN5c3RlbSAke3N5c3RlbX1gKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHgxMDIsICdnZXRtZW1zaXplJywgMCwgMSwgXHJcblx0XHRcdFx0ZnVuY3Rpb24gZ2V0bWVtc2l6ZSgpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuaW1hZ2UuZ2V0RW5kTWVtKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cdFxyXG5cdFx0XHRvcGNvZGUoMHgxMDMsICdzZXRtZW1zaXplJywgMSwgMSxcclxuXHRcdFx0XHRmdW5jdGlvbiBzZXRtZW1zaXplKHNpemUpe1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaGVhcClcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwic2V0bWVtc2l6ZSBpcyBub3QgYWxsb3dlZCB3aGlsZSB0aGUgaGVhcCBpcyBhY3RpdmVcIik7XHJcblx0XHRcdFx0XHR0cnl7XHJcblx0XHRcdFx0XHRcdHRoaXMuaW1hZ2Uuc2V0RW5kTWVtKHNpemUpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNhdGNoIChlKXtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihlKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIDE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHgxNzAsICdtemVybycsIDIsIDAsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIG16ZXJvKGNvdW50LCBhZGRyZXNzKXtcclxuXHRcdFx0XHRcdGxldCB6ZXJvcyA9IFtdO1xyXG5cdFx0XHRcdFx0Y291bnQgPSB1aW50MzIoY291bnQpO1xyXG5cdFx0XHRcdFx0d2hpbGUoY291bnQtLSl7XHJcblx0XHRcdFx0XHRcdHplcm9zLnB1c2goMCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0aGlzLmltYWdlLndyaXRlQnl0ZXMoYWRkcmVzcywgLi4uemVyb3MpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHJcblxyXG5cdFx0XHRvcGNvZGUoMHgxNzEsICdtY29weScsIDMsIDAsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIG1jb3B5KGNvdW50LCBmcm9tLCB0byl7XHJcblx0XHRcdFx0XHRsZXQgZGF0YSA9IFtdO1xyXG5cdFx0XHRcdFx0Y291bnQgPSB1aW50MzIoY291bnQpO1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IGZyb207IGk8ZnJvbStjb3VudDsgaSsrKXtcclxuXHRcdFx0XHRcdFx0ZGF0YS5wdXNoKHRoaXMuaW1hZ2UucmVhZEJ5dGUoaSkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGhpcy5pbWFnZS53cml0ZUJ5dGVzKHRvLCAuLi5kYXRhKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHgxNzgsICdtYWxsb2MnLCAxLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIG1hbGxvYyhzaXplKXtcclxuXHRcdFx0XHRcdGlmIChzaXplIDw9IDApXHJcblx0XHRcdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuaGVhcCl7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLmhlYXAuYWxsb2Moc2l6ZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsZXQgb2xkRW5kTWVtID0gdGhpcy5pbWFnZS5nZXRFbmRNZW0oKTtcclxuXHRcdFx0XHRcdHRoaXMuaGVhcCA9IG5ldyBIZWFwQWxsb2NhdG9yKG9sZEVuZE1lbSwgdGhpcy5pbWFnZS5tZW1vcnkpO1xyXG5cdFx0XHRcdFx0dGhpcy5oZWFwLm1heEhlYXBFeHRlbnQgPSB0aGlzLm1heEhlYXBTaXplO1xyXG5cdFx0XHRcdFx0bGV0IGEgPSB0aGlzLmhlYXAuYWxsb2Moc2l6ZSk7XHJcblx0XHRcdFx0XHRpZiAoYSA9PT0gMCl7XHJcblx0XHRcdFx0XHRcdHRoaXMuaGVhcCA9IG51bGw7XHJcblx0XHRcdFx0XHRcdHRoaXMuaW1hZ2Uuc2V0RW5kTWVtKG9sZEVuZE1lbSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gYTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHgxNzksICdtZnJlZScsIDEsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gbWZyZWUoYWRkcmVzcyl7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5oZWFwKXtcclxuXHRcdFx0XHRcdFx0dGhpcy5oZWFwLmZyZWUoYWRkcmVzcyk7XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLmhlYXAuYmxvY2tDb3VudCgpID09PSAwKXtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmltYWdlLmVuZE1lbSA9IHRoaXMuaGVhcC5oZWFwQWRkcmVzcztcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmhlYXAgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTUwLCAnbGluZWFyc2VhcmNoJywgNywgMSwgUGVyZm9ybUxpbmVhclNlYXJjaCk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHgxNTEsICdiaW5hcnlzZWFyY2gnLCA3LCAxLCBQZXJmb3JtQmluYXJ5U2VhcmNoKTtcclxuXHJcblx0XHRcdG9wY29kZSgweDE1MiwgJ2xpbmtlZHNlYXJjaCcsIDYsIDEsIFBlcmZvcm1MaW5rZWRTZWFyY2gpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4NTAsICdzdGtjb3VudCcsIDAsIDEsXHJcblx0XHRcdFx0ZnVuY3Rpb24gc3RrY291bnQoKXtcclxuXHRcdFx0XHRcdHJldHVybiAodGhpcy5TUCAtICh0aGlzLkZQICsgdGhpcy5mcmFtZUxlbikpIC8gNDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHg1MSwgJ3N0a3BlZWsnLCAxLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHN0a3BlZWsocG9zKXtcclxuXHRcdFx0XHRcdGxldCBhZGRyZXNzID0gdGhpcy5TUCAtIDQgKiAoMSArIHBvcylcclxuXHRcdFx0XHRcdGlmIChhZGRyZXNzIDwgdGhpcy5GUCArIHRoaXMuZnJhbWVMZW4pXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlN0YWNrIHVuZGVyZmxvd1wiKTtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLnN0YWNrLnJlYWRJbnQzMihhZGRyZXNzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHg1MiwgJ3N0a3N3YXAnLCAwLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHN0a3N3YXAocG9zKXtcclxuXHRcdFx0XHRcdGlmICh0aGlzLlNQIC0gKHRoaXMuRlAgKyB0aGlzLmZyYW1lTGVuKSA8IDgpXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlN0YWNrIHVuZGVyZmxvd1wiKTtcclxuXHRcdFx0XHRcdGxldCBhID0gdGhpcy5wb3AoKTtcclxuXHRcdFx0XHRcdGxldCBiID0gdGhpcy5wb3AoKTtcclxuXHRcdFx0XHRcdHRoaXMucHVzaChhKTtcclxuXHRcdFx0XHRcdHRoaXMucHVzaChiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblx0XHRcdFxyXG5cdFx0XHRvcGNvZGUoMHg1MywgJ3N0a3JvbGwnLCAyLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHN0a3JvbGwoaXRlbXMsIGRpc3RhbmNlKXtcclxuXHRcdFx0XHRcdC8vIFRPRE86IHRyZWF0IGRpc3RhbmNlIGFzIHNpZ25lZCB2YWx1ZVxyXG5cdFx0XHRcdFx0aWYgKGl0ZW1zID09PSAwKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRkaXN0YW5jZSAlPSBpdGVtcztcclxuXHRcdFx0XHRcdGlmIChkaXN0YW5jZSA9PT0gMClcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0Ly8gcm9sbGluZyBYIGl0ZW1zIGRvd24gWSBzbG90cyA9PSByb2xsaW5nIFggaXRlbXMgdXAgWC1ZIHNsb3RzXHJcbiAgICAgICAgICAgICBcdFx0aWYgKGRpc3RhbmNlIDwgMClcclxuXHRcdFx0XHRcdCBcdGRpc3RhbmNlICs9IGl0ZW1zO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuU1AgLSAodGhpcy5GUCArIHRoaXMuZnJhbWVMZW4pIDwgNCogaXRlbXMpXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlN0YWNrIHVuZGVyZmxvd1wiKTtcclxuXHRcdFx0XHRcdGxldCB0ZW1wMSA9IFtdO1xyXG5cdFx0XHRcdFx0bGV0IHRlbXAyID0gW107XHJcblx0XHRcdFx0XHRmb3IgKGxldCBpPTA7IGk8ZGlzdGFuY2U7IGkrKyl7XHJcblx0XHRcdFx0XHRcdHRlbXAxLnB1c2godGhpcy5wb3AoKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRmb3IgKGxldCBpPWRpc3RhbmNlOyBpPGl0ZW1zOyBpKyspe1xyXG5cdFx0XHRcdFx0XHR0ZW1wMi5wdXNoKHRoaXMucG9wKCkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0d2hpbGUodGVtcDEubGVuZ3RoKXtcclxuXHRcdFx0XHRcdFx0dGhpcy5wdXNoKHRlbXAxLnBvcCgpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHdoaWxlKHRlbXAyLmxlbmd0aCl7XHJcblx0XHRcdFx0XHRcdHRoaXMucHVzaCh0ZW1wMi5wb3AoKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4NTQsICdzdGtjb3B5JywxLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHN0a2NvcHkoY291bnQpe1xyXG5cdFx0XHRcdFx0bGV0IGJ5dGVzID0gY291bnQgKiA0O1xyXG5cdFx0XHRcdFx0aWYgKGJ5dGVzID4gdGhpcy5TUCAtICh0aGlzLkZQICsgdGhpcy5mcmFtZUxlbikpXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlN0YWNrIHVuZGVyZmxvd1wiKTtcclxuXHRcdFx0XHRcdGxldCBzdGFydCA9IHRoaXMuU1AgLSBieXRlcztcclxuXHRcdFx0XHRcdHdoaWxlKGNvdW50LS0pe1xyXG5cdFx0XHRcdFx0XHR0aGlzLnB1c2godGhpcy5zdGFjay5yZWFkSW50MzIoc3RhcnQpKVxyXG5cdFx0XHRcdFx0XHRzdGFydCs9IDQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHgxMDAsIFwiZ2VzdGFsdFwiLCAyLCAxLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIGdlc3RhbHQoc2VsZWN0b3IsIGFyZyl7XHJcblx0XHRcdFx0XHRzd2l0Y2goc2VsZWN0b3Ipe1xyXG5cdFx0XHRcdFx0XHRjYXNlIEdlc3RhbHQuR2x1bHhWZXJzaW9uOiByZXR1cm4gVmVyc2lvbnMuZ2x1bHg7XHJcblx0XHRcdFx0XHRcdGNhc2UgR2VzdGFsdC5UZXJwVmVyc2lvbjogcmV0dXJuIFZlcnNpb25zLnRlcnA7XHJcblx0XHRcdFx0XHRcdGNhc2UgR2VzdGFsdC5SZXNpemVNZW06XHJcblx0XHRcdFx0XHRcdGNhc2UgR2VzdGFsdC5Vbmljb2RlOlxyXG5cdFx0XHRcdFx0XHRjYXNlIEdlc3RhbHQuTWVtQ29weTpcclxuXHRcdFx0XHRcdFx0Y2FzZSBHZXN0YWx0Lk1BbGxvYzpcclxuXHRcdFx0XHQgXHRcdGNhc2UgR2VzdGFsdC5VbmRvOlxyXG5cdFx0XHRcdFx0XHRjYXNlIEdlc3RhbHQuRXh0VW5kbzpcclxuXHRcdFx0XHRcdFx0Y2FzZSBHZXN0YWx0LkFjY2VsZXJhdGlvbjpcclxuXHRcdFx0XHRcdFx0IFx0cmV0dXJuIDE7XHJcblx0XHRcdFx0XHRcdGNhc2UgR2VzdGFsdC5GbG9hdDpcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0XHRcdFx0Y2FzZSBHZXN0YWx0LklPU3lzdGVtOlxyXG5cdFx0XHRcdFx0XHRcdGlmIChhcmcgPT09IDApIHJldHVybiAxOyAgLy8gTnVsbC1JT1xyXG5cdFx0XHRcdFx0XHRcdGlmIChhcmcgPT09IDEpIHJldHVybiAxOyAgLy8gRmlsdGVyXHJcblx0XHRcdFx0XHRcdFx0aWYgKGFyZyA9PT0gMjAgJiYgdGhpcy5lbmFibGVGeXJlVk0pIHJldHVybiAxOyAvLyBDaGFubmVsIElPXHJcblx0XHRcdFx0XHRcdFx0aWYgKGFyZyA9PSAyICYmIHRoaXMuZ2xrTW9kZSA9PT0gR2xrTW9kZS5XcmFwcGVyKSByZXR1cm4gMTsgLy8gR2xrXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdFx0XHRcdGNhc2UgR2VzdGFsdC5NQWxsb2NIZWFwOlxyXG5cdFx0XHRcdFx0XHRcdGlmICh0aGlzLmhlYXApIHJldHVybiB0aGlzLmhlYXAuaGVhcEFkZHJlc3M7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdFx0XHRcdGNhc2UgR2VzdGFsdC5BY2NlbEZ1bmM6XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIDA7IFxyXG5cdFx0XHRcdFx0fVx0XHRcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblxyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTIwLCAncXVpdCcsIDAsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gcXVpdCgpeyB0aGlzLnJ1bm5pbmcgPSBmYWxzZTsgfSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDEyMiwgJ3Jlc3RhcnQnLCAwLCAwLCBFbmdpbmUucHJvdG90eXBlLnJlc3RhcnQpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTIzLCAnc2F2ZScsIDEsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gc2F2ZShYLCBkZXN0VHlwZTpudW1iZXIsIGRlc3RBZGRyOm51bWJlcil7XHJcblx0XHRcdFx0XHQvLyBUT0RPOiBmaW5kIG91dCB3aGF0IHRoYXQgb25lIGFyZ3VtZW50IFggZG9lcyAuLi5cclxuXHRcdFx0XHRcdGxldCBlbmdpbmU6IEVuZ2luZSA9IHRoaXM7XHJcblx0XHRcdFx0XHRpZiAoZW5naW5lLnNhdmVSZXF1ZXN0ZWQpe1xyXG5cdFx0XHRcdFx0XHRsZXQgcSA9IGVuZ2luZS5zYXZlVG9RdWV0emFsKGRlc3RUeXBlLCBkZXN0QWRkcik7XHJcblx0XHRcdFx0XHRcdGxldCByZXN1bWUgPSB0aGlzLnJlc3VtZUFmdGVyV2FpdC5iaW5kKHRoaXMpO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0bGV0IGNhbGxiYWNrID0gZnVuY3Rpb24oc3VjY2Vzczpib29sZWFuKXtcclxuXHRcdFx0XHRcdFx0XHRpZiAoc3VjY2Vzcyl7XHJcblx0XHRcdFx0XHRcdFx0XHRlbmdpbmVbJ3BlcmZvcm1EZWxheWVkU3RvcmUnXShkZXN0VHlwZSwgZGVzdEFkZHIsIDApO1xyXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0ZW5naW5lWydwZXJmb3JtRGVsYXllZFN0b3JlJ10oZGVzdFR5cGUsIGRlc3RBZGRyLCAxKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0cmVzdW1lKCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZW5naW5lLnNhdmVSZXF1ZXN0ZWQocSwgY2FsbGJhY2spO1xyXG5cdFx0XHRcdFx0XHRsZXQgd2FpdDogYW55ID0gJ3dhaXQnO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gd2FpdDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVuZ2luZVsncGVyZm9ybURlbGF5ZWRTdG9yZSddKGRlc3RUeXBlLCBkZXN0QWRkciwgMSk7XHRcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdE9wY29kZVJ1bGUuRGVsYXllZFN0b3JlXHJcblx0XHRcdClcclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDEyNCwgXCJyZXN0b3JlXCIsIDEsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gcmVzdG9yZShYLCBkZXN0VHlwZTpudW1iZXIsIGRlc3RBZGRyOm51bWJlcil7XHJcblx0XHRcdFx0XHQvLyBUT0RPOiBmaW5kIG91dCB3aGF0IHRoYXQgb25lIGFyZ3VtZW50IFggZG9lcyAuLi5cclxuXHRcdFx0XHRcdGxldCBlbmdpbmU6IEVuZ2luZSA9IHRoaXM7XHJcblx0XHRcdFx0XHRpZiAoZW5naW5lLmxvYWRSZXF1ZXN0ZWQpe1xyXG5cdFx0XHRcdFx0XHRsZXQgcmVzdW1lID0gdGhpcy5yZXN1bWVBZnRlcldhaXQuYmluZCh0aGlzKTtcclxuXHRcdFx0XHRcdFx0bGV0IGNhbGxiYWNrID0gZnVuY3Rpb24ocXVldHphbDpRdWV0emFsKXtcclxuXHRcdFx0XHRcdFx0XHRpZiAocXVldHphbCl7XHJcblx0XHRcdFx0XHRcdFx0XHRlbmdpbmUubG9hZEZyb21RdWV0emFsKHF1ZXR6YWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzdW1lKCk7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGVuZ2luZVsncGVyZm9ybURlbGF5ZWRTdG9yZSddKGRlc3RUeXBlLCBkZXN0QWRkciwgMSk7XHJcblx0XHRcdFx0XHRcdFx0cmVzdW1lKCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZW5naW5lLmxvYWRSZXF1ZXN0ZWQoY2FsbGJhY2spO1xyXG5cdFx0XHRcdFx0XHRsZXQgd2FpdDogYW55ID0gJ3dhaXQnO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gd2FpdDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVuZ2luZVsncGVyZm9ybURlbGF5ZWRTdG9yZSddKGRlc3RUeXBlLCBkZXN0QWRkciwgMSk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRPcGNvZGVSdWxlLkRlbGF5ZWRTdG9yZVxyXG5cdFx0XHQpXHJcblxyXG5cdFx0XHRvcGNvZGUoMHgxMjUsICdzYXZldW5kbycsIDAsIDAsIFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHNhdmV1bmRvKGRlc3RUeXBlOm51bWJlciwgZGVzdEFkZHI6bnVtYmVyKXtcclxuXHRcdFx0XHRcdGxldCBxID0gdGhpcy5zYXZlVG9RdWV0emFsKGRlc3RUeXBlLCBkZXN0QWRkcik7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGlmICh0aGlzLnVuZG9CdWZmZXJzKXtcclxuXHRcdFx0XHRcdFx0Ly8gVE9ETyBtYWtlIE1BWF9VTkRPX0xFVkVMIGNvbmZpZ3VyYWJsZVxyXG5cdFx0XHRcdFx0XHRpZiAodGhpcy51bmRvQnVmZmVycy5sZW5ndGggPj0gMyl7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy51bmRvQnVmZmVycy51bnNoaWZ0KCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0dGhpcy51bmRvQnVmZmVycy5wdXNoKHEpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHRoaXMudW5kb0J1ZmZlcnMgPSBbIHEgXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHRoaXMucGVyZm9ybURlbGF5ZWRTdG9yZShkZXN0VHlwZSwgZGVzdEFkZHIsIDApO1xyXG5cdFx0XHR9LCBPcGNvZGVSdWxlLkRlbGF5ZWRTdG9yZSk7XHJcblxyXG5cdFx0XHRvcGNvZGUoMHgxMjYsICdyZXN0b3JldW5kbycsIDAsIDAsXHJcblx0XHRcdFx0ZnVuY3Rpb24gcmVzdG9yZXVuZG8oZGVzdFR5cGU6bnVtYmVyLCBkZXN0QWRkcjpudW1iZXIpe1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMudW5kb0J1ZmZlcnMgJiYgdGhpcy51bmRvQnVmZmVycy5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0XHRsZXQgcSA9IHRoaXMudW5kb0J1ZmZlcnMucG9wKCk7XHJcblx0XHRcdFx0XHRcdHRoaXMubG9hZEZyb21RdWV0emFsKHEpO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHRoaXMucGVyZm9ybURlbGF5ZWRTdG9yZShkZXN0VHlwZSwgZGVzdEFkZHIsIDEpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0fSwgT3Bjb2RlUnVsZS5EZWxheWVkU3RvcmUpO1xyXG5cclxuXHJcblx0XHRcdG9wY29kZSgweDEyNywgJ3Byb3RlY3QnLCAyLCAwLFxyXG5cdFx0XHRcdGZ1bmN0aW9uIHByb3RlY3Qoc3RhcnQsIGxlbmd0aCl7XHJcblx0XHRcdFx0XHRpZiAoc3RhcnQgPCB0aGlzLmltYWdlLmdldEVuZE1lbSgpKXtcclxuXHRcdFx0XHRcdFx0dGhpcy5wcm90ZWN0aW9uU3RhcnQgPSBzdGFydDtcclxuXHRcdFx0XHRcdFx0dGhpcy5wcm90ZWN0aW9uTGVuZ3RoID0gbGVuZ3RoO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KVxyXG5cdFx0XHRcclxuXHRcdFx0b3Bjb2RlKDB4MTI4LCAnaGFzdW5kbycsIDAsIDEsXHJcblx0XHRcdFx0Ly8gVGVzdCB3aGV0aGVyIGEgVk0gc3RhdGUgaXMgYXZhaWxhYmxlIGluIHRlbXBvcmFyeSBzdG9yYWdlLiBcclxuXHRcdFx0XHQvLyByZXR1cm4gMCBpZiBhIHN0YXRlIGlzIGF2YWlsYWJsZSwgMSBpZiBub3QuIFxyXG5cdFx0XHRcdC8vIElmIHRoaXMgcmV0dXJucyAwLCB0aGVuIHJlc3RvcmV1bmRvIGlzIGV4cGVjdGVkIHRvIHN1Y2NlZWQuXHJcblx0XHRcdFx0ZnVuY3Rpb24gaGFzdW5kbygpe1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMudW5kb0J1ZmZlcnMgJiYgdGhpcy51bmRvQnVmZmVycy5sZW5ndGgpIHJldHVybiAwO1xyXG5cdFx0XHRcdFx0cmV0dXJuIDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpXHJcblxyXG5cdFx0XHRvcGNvZGUoMHgxMjksICdkaXNjYXJkdW5kbycsIDAsIDAsXHJcblx0XHRcdFx0Ly8gRGlzY2FyZCBhIFZNIHN0YXRlICh0aGUgbW9zdCByZWNlbnRseSBzYXZlZCkgZnJvbSB0ZW1wb3Jhcnkgc3RvcmFnZS4gSWYgbm9uZSBpcyBhdmFpbGFibGUsIHRoaXMgZG9lcyBub3RoaW5nLlxyXG5cdFx0XHRcdGZ1bmN0aW9uIGRpc2NhcmR1bmRvKCl7XHJcblx0XHRcdFx0XHRpZiAodGhpcy51bmRvQnVmZmVycyl7XHJcblx0XHRcdFx0XHRcdHRoaXMudW5kb0J1ZmZlcnMucG9wKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpXHJcblxyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTEwLCAncmFuZG9tJywgMSwgMSxcclxuXHRcdFx0XHRmdW5jdGlvbiByYW5kb20obWF4KXtcclxuXHRcdFx0XHRcdGlmIChtYXggPT09IDEgfHwgbWF4ID09PSAweEZGRkZGRkZGKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0bGV0IHJhbmRvbTogTWVyc2VubmVUd2lzdGVyID0gdGhpcy5yYW5kb207XHJcblx0XHRcdFx0XHRpZiAoIXJhbmRvbSl7XHJcblx0XHRcdFx0XHRcdHJhbmRvbSA9IHRoaXMucmFuZG9tID0gbmV3IE1lcnNlbm5lVHdpc3RlcigpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKG1heCA9PT0gMCl7XHJcblx0XHRcdFx0XHRcdHJldHVybiByYW5kb20uZ2VucmFuZF9pbnQzMigpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRtYXggPSBpbnQzMihtYXgpO1xyXG5cdFx0XHRcdFx0aWYgKG1heCA8IDApe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gIHVpbnQzMiggLSAocmFuZG9tLmdlbnJhbmRfaW50MzEoKSAlIC1tYXgpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiByYW5kb20uZ2VucmFuZF9pbnQzMSgpICUgbWF4O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcdFx0XHJcblx0XHRcdG9wY29kZSgweDExMSwgJ3NldHJhbmRvbScsMSwgMCxcclxuXHRcdFx0XHRmdW5jdGlvbiBzZXRyYW5kb20oc2VlZCl7XHJcblx0XHRcdFx0XHRpZiAoIXNlZWQpIHNlZWQgPSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0XHR0aGlzLnJhbmRvbSA9IG5ldyBNZXJzZW5uZVR3aXN0ZXIoc2VlZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0b3Bjb2RlKDB4MTAwMCwgJ2Z5cmVjYWxsJywgMywgMSwgRW5naW5lLnByb3RvdHlwZS5meXJlQ2FsbCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gb3Bjb2RlcztcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Y29uc3QgZW51bSBTZWFyY2hPcHRpb25zIHtcclxuXHRcdEtleUluZGlyZWN0ID0gMSxcclxuICAgICAgICBaZXJvS2V5VGVybWluYXRlcyA9IDIsXHJcbiAgICAgICAgUmV0dXJuSW5kZXggPSA0XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIFBlcmZvcm1CaW5hcnlTZWFyY2goa2V5LCBrZXlTaXplLCBzdGFydCwgc3RydWN0U2l6ZSwgbnVtU3RydWN0cywga2V5T2Zmc2V0LCBvcHRpb25zKXtcclxuXHRcdGlmIChvcHRpb25zICYgU2VhcmNoT3B0aW9ucy5aZXJvS2V5VGVybWluYXRlcylcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiWmVyb0tleVRlcm1pbmF0ZWQgb3B0aW9uIG1heSBub3QgYmUgdXNlZCB3aXRoIGJpbmFyeSBzZWFyY2hcIik7XHJcblx0XHRpZiAoa2V5U2l6ZSA+IDQgJiYgIShvcHRpb25zICYgU2VhcmNoT3B0aW9ucy5LZXlJbmRpcmVjdCkgKVxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJLZXlJbmRpcmVjdCBvcHRpb24gbXVzdCBiZSB1c2VkIHdoZW4gc2VhcmNoaW5nIGZvciBhID40IGJ5dGUga2V5XCIpO1xyXG5cdFx0bGV0IHJldHVybkluZGV4ID0gb3B0aW9ucyAmIFNlYXJjaE9wdGlvbnMuUmV0dXJuSW5kZXg7XHJcblx0XHRsZXQgbG93ID0wLCBoaWdoID0gbnVtU3RydWN0cztcclxuXHRcdGtleSA9IGtleSA+Pj4gMDtcclxuXHRcdHdoaWxlIChsb3cgPCBoaWdoKXtcclxuXHRcdFx0bGV0IGluZGV4ID0gTWF0aC5mbG9vcigobG93K2hpZ2gpIC8gMik7XHJcblx0XHRcdGxldCBjbXAgPSBjb21wYXJlS2V5cy5jYWxsKHRoaXMsIGtleSwgc3RhcnQgKyBpbmRleCpzdHJ1Y3RTaXplICsga2V5T2Zmc2V0LCBrZXlTaXplLCBvcHRpb25zKTtcclxuXHRcdFx0aWYgKGNtcCA9PT0gMCl7XHJcblx0XHRcdFx0Ly8gZm91bmQgaXRcclxuXHRcdFx0XHRpZiAocmV0dXJuSW5kZXgpIHJldHVybiBpbmRleDtcclxuXHRcdFx0XHRyZXR1cm4gc3RhcnQraW5kZXgqc3RydWN0U2l6ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoY21wIDwgMCl7XHJcblx0XHRcdFx0aGlnaCA9IGluZGV4O1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRsb3cgPSBpbmRleCArIDE7XHRcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gZGlkIG5vdCBmaW5kXHJcblx0XHRyZXR1cm4gcmV0dXJuSW5kZXggPyAweEZGRkZGRkZGIDogMDtcclxuXHR9XHJcblx0XHJcblx0XHJcblx0ZnVuY3Rpb24gUGVyZm9ybUxpbmVhclNlYXJjaChrZXksIGtleVNpemUsIHN0YXJ0LCBzdHJ1Y3RTaXplLCBudW1TdHJ1Y3RzLCBrZXlPZmZzZXQsIG9wdGlvbnMpe1xyXG5cdFx0aWYgKGtleVNpemUgPiA0ICYmICEob3B0aW9ucyAmIFNlYXJjaE9wdGlvbnMuS2V5SW5kaXJlY3QpIClcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiS2V5SW5kaXJlY3Qgb3B0aW9uIG11c3QgYmUgdXNlZCB3aGVuIHNlYXJjaGluZyBmb3IgYSA+NCBieXRlIGtleVwiKTtcclxuXHRcdGxldCByZXR1cm5JbmRleCA9IG9wdGlvbnMgJiBTZWFyY2hPcHRpb25zLlJldHVybkluZGV4O1xyXG5cdFx0a2V5ID0ga2V5ID4+PiAwO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IG51bVN0cnVjdHMgPT09IC0xIHx8IGk8bnVtU3RydWN0czsgaSsrKXtcclxuXHRcdFx0bGV0IGNtcCA9IGNvbXBhcmVLZXlzLmNhbGwodGhpcywga2V5LCBzdGFydCArIGkqc3RydWN0U2l6ZSArIGtleU9mZnNldCwga2V5U2l6ZSwgb3B0aW9ucyk7XHJcblx0XHRcdGlmIChjbXAgPT09IDApe1xyXG5cdFx0XHRcdC8vIGZvdW5kIGl0XHJcblx0XHRcdFx0aWYgKHJldHVybkluZGV4KSByZXR1cm4gaTtcclxuXHRcdFx0XHRyZXR1cm4gc3RhcnQraSpzdHJ1Y3RTaXplO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChvcHRpb25zICYgU2VhcmNoT3B0aW9ucy5aZXJvS2V5VGVybWluYXRlcyl7XHJcblx0XHRcdFx0aWYgKGtleUlzWmVyby5jYWxsKHRoaXMsIHN0YXJ0ICsgaSpzdHJ1Y3RTaXplICsga2V5T2Zmc2V0LCBrZXlTaXplKSl7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIGRpZCBub3QgZmluZFxyXG5cdFx0cmV0dXJuIHJldHVybkluZGV4ID8gMHhGRkZGRkZGRiA6IDA7XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIFBlcmZvcm1MaW5rZWRTZWFyY2goa2V5LCBrZXlTaXplLCBzdGFydCwga2V5T2Zmc2V0LCBuZXh0T2Zmc2V0LCBvcHRpb25zKXtcclxuXHRcdGlmIChvcHRpb25zICYgU2VhcmNoT3B0aW9ucy5SZXR1cm5JbmRleClcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiUmV0dXJuSW5kZXggb3B0aW9uIG1heSBub3QgYmUgdXNlZCB3aXRoIGxpbmtlZCBzZWFyY2hcIik7XHJcblx0XHRsZXQgbm9kZSA9IHN0YXJ0O1xyXG5cdFx0a2V5ID0ga2V5ID4+PiAwO1xyXG5cdFx0d2hpbGUgKG5vZGUpe1xyXG5cdFx0XHRsZXQgY21wID0gY29tcGFyZUtleXMuY2FsbCh0aGlzLCBrZXksIG5vZGUgKyBrZXlPZmZzZXQsIGtleVNpemUsIG9wdGlvbnMpO1xyXG5cdFx0XHRpZiAoY21wID09PSAwKXtcclxuXHRcdFx0XHQvLyBmb3VuZCBpdFxyXG5cdFx0XHRcdHJldHVybiBub2RlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChvcHRpb25zICYgU2VhcmNoT3B0aW9ucy5aZXJvS2V5VGVybWluYXRlcyl7XHJcblx0XHRcdFx0aWYgKGtleUlzWmVyby5jYWxsKHRoaXMsIG5vZGUgKyBrZXlPZmZzZXQsIGtleVNpemUpKXtcclxuXHRcdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBhZHZhbmNlIHRoZSBuZXh0IGl0ZW1cclxuXHRcdFx0bm9kZSA9IHRoaXMuaW1hZ2UucmVhZEludDMyKG5vZGUrbmV4dE9mZnNldCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIGtleUlzWmVybyhhZGRyZXNzLCBzaXplKXtcclxuXHRcdHdoaWxlKHNpemUtLSl7XHJcblx0XHRcdGlmICh0aGlzLmltYWdlLnJlYWRCeXRlKGFkZHJlc3Mrc2l6ZSkgIT09IDApXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cdFxyXG5cdGZ1bmN0aW9uIGNvbXBhcmVLZXlzKHF1ZXJ5Om51bWJlciwgY2FuZGlkYXRlQWRkcjogbnVtYmVyLCBrZXlTaXplOiBudW1iZXIsIG9wdGlvbnM6IG51bWJlcil7XHJcblx0XHRsZXQgeyBpbWFnZSB9ID0gdGhpcztcclxuXHRcdGlmIChvcHRpb25zICYgU2VhcmNoT3B0aW9ucy5LZXlJbmRpcmVjdCl7XHJcblx0XHRcdC8vIEtleUluZGlyZWN0ICppcyogc2V0XHJcbiAgICAgICAgICAgIC8vIGNvbXBhcmUgdGhlIGJ5dGVzIHN0b3JlZCBhdCBxdWVyeSB2cy4gY2FuZGlkYXRlQWRkclxyXG4gXHRcdFx0Zm9yIChsZXQgaT0wOyBpPGtleVNpemU7IGkrKyl7XHJcblx0XHRcdFx0bGV0IGIxID0gaW1hZ2UucmVhZEJ5dGUocXVlcnkrKyk7XHJcblx0XHRcdFx0bGV0IGIyID0gaW1hZ2UucmVhZEJ5dGUoY2FuZGlkYXRlQWRkcisrKTtcclxuXHRcdFx0XHRpZiAoYjEgPCBiMilcclxuXHRcdFx0XHRcdHJldHVybiAtMTtcclxuXHRcdFx0XHRpZiAoYjEgPiBiMilcclxuXHRcdFx0XHRcdHJldHVybiAxOyBcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH1cdFxyXG5cdFx0XHJcblx0XHQvLyBLZXlJbmRpcmVjdCBpcyAqbm90KiBzZXRcclxuICAgICAgICAvLyBtYXNrIHF1ZXJ5IHRvIHRoZSBhcHByb3ByaWF0ZSBzaXplIGFuZCBjb21wYXJlIGl0IGFnYWluc3QgdGhlIHZhbHVlIHN0b3JlZCBhdCBjYW5kaWRhdGVBZGRyXHJcblx0XHRsZXQgY2tleTtcclxuXHRcdHN3aXRjaChrZXlTaXplKXtcclxuXHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdGNrZXkgPSBpbWFnZS5yZWFkQnl0ZShjYW5kaWRhdGVBZGRyKTtcclxuXHRcdFx0XHRxdWVyeSAmPSAweEZGO1xyXG5cdFx0XHRcdHJldHVybiBxdWVyeSAtIGNrZXk7XHJcblx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRja2V5ID0gaW1hZ2UucmVhZEludDE2KGNhbmRpZGF0ZUFkZHIpO1xyXG5cdFx0XHRcdHF1ZXJ5ICY9IDB4RkZGRjtcclxuXHRcdFx0XHRyZXR1cm4gcXVlcnkgLSBja2V5O1xyXG5cdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0Y2tleSA9IGltYWdlLnJlYWRJbnQzMihjYW5kaWRhdGVBZGRyKSAmIDB4RkZGRkZGO1xyXG5cdFx0XHRcdHF1ZXJ5ICY9IDB4RkZGRkZGO1xyXG5cdFx0XHRcdHJldHVybiBxdWVyeSAtIGNrZXk7XHJcblx0XHRcdGNhc2UgNDpcclxuXHRcdFx0XHRja2V5ID0gaW1hZ2UucmVhZEludDMyKGNhbmRpZGF0ZUFkZHIpO1xyXG5cdFx0XHRcdHJldHVybiBxdWVyeSAtIGNrZXk7XHJcblx0XHR9XHJcblx0XHRcclxuXHR9XHJcbn0iLCIvLyBXcml0dGVuIGluIDIwMTUgYnkgVGhpbG8gUGxhbnogXHJcbi8vIFRvIHRoZSBleHRlbnQgcG9zc2libGUgdW5kZXIgbGF3LCBJIGhhdmUgZGVkaWNhdGVkIGFsbCBjb3B5cmlnaHQgYW5kIHJlbGF0ZWQgYW5kIG5laWdoYm9yaW5nIHJpZ2h0cyBcclxuLy8gdG8gdGhpcyBzb2Z0d2FyZSB0byB0aGUgcHVibGljIGRvbWFpbiB3b3JsZHdpZGUuIFRoaXMgc29mdHdhcmUgaXMgZGlzdHJpYnV0ZWQgd2l0aG91dCBhbnkgd2FycmFudHkuIFxyXG4vLyBodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9wdWJsaWNkb21haW4vemVyby8xLjAvXHJcblxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPSdHbGtXcmFwcGVyLnRzJyAvPlxyXG5cclxuXHJcbm1vZHVsZSBGeXJlVk0ge1xyXG5cdFxyXG5cdCAvLy8gSWRlbnRpZmllcyBhbiBvdXRwdXQgc3lzdGVtIGZvciB1c2Ugd2l0aCBAc2V0aW9zeXMuXHJcblx0ZXhwb3J0IGNvbnN0IGVudW0gSU9TeXN0ZW0ge1xyXG5cdFx0Ly8vIE91dHB1dCBpcyBkaXNjYXJkZWQuXHJcblx0XHROdWxsLFxyXG5cdFx0Ly8vIE91dHB1dCBpcyBmaWx0ZXJlZCB0aHJvdWdoIGEgR2x1bHggZnVuY3Rpb24uXHJcblx0XHRGaWx0ZXIsXHJcblx0XHQvLy8gT3V0cHV0IGlzIHNlbnQgdGhyb3VnaCBGeXJlVk0ncyBjaGFubmVsIHN5c3RlbS5cclxuXHRcdENoYW5uZWxzLFxyXG5cdFx0Ly8vIE91dHB1dCBpcyBzZW50IHRocm91Z2ggR2xrLlxyXG5cdFx0R2xrXHJcblx0fVxyXG5cdFxyXG5cdGV4cG9ydCBmdW5jdGlvbiBTZW5kQ2hhclRvT3V0cHV0KHg6IG51bWJlcil7XHJcblx0XHRzd2l0Y2godGhpcy5vdXRwdXRTeXN0ZW0pe1xyXG5cdFx0XHRjYXNlIElPU3lzdGVtLk51bGw6IHJldHVybjtcclxuXHRcdFx0Y2FzZSBJT1N5c3RlbS5DaGFubmVsczpcclxuXHRcdFx0XHQvLyBUT0RPPyBuZWVkIHRvIGhhbmRsZSBVbmljb2RlIGNoYXJhY3RlcnMgbGFyZ2VyIHRoYW4gMTYgYml0c1xyXG5cdFx0XHRcdHRoaXMub3V0cHV0QnVmZmVyLndyaXRlKFN0cmluZy5mcm9tQ2hhckNvZGUoeCkpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0Y2FzZSBJT1N5c3RlbS5HbGs6XHJcblx0XHRcdFx0aWYgKHRoaXMuZ2xrTW9kZSA9PT0gR2xrTW9kZS5XcmFwcGVyKVxyXG5cdFx0XHRcdFx0R2xrV3JhcHBlcldyaXRlLmNhbGwodGhpcywgU3RyaW5nLmZyb21DaGFyQ29kZSh4KSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdFxyXG5cdFx0fVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBvdXRwdXQgc3lzdGVtICR7dGhpcy5vdXRwdXRTeXN0ZW19YCk7XHJcblx0fVxyXG5cdFxyXG5cdGV4cG9ydCBmdW5jdGlvbiBTZW5kU3RyaW5nVG9PdXRwdXQoeDogc3RyaW5nKXtcclxuXHRcdHN3aXRjaCh0aGlzLm91dHB1dFN5c3RlbSl7XHJcblx0XHRcdGNhc2UgSU9TeXN0ZW0uTnVsbDogcmV0dXJuO1xyXG5cdFx0XHRjYXNlIElPU3lzdGVtLkNoYW5uZWxzOlxyXG5cdFx0XHRcdHRoaXMub3V0cHV0QnVmZmVyLndyaXRlKHgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0Y2FzZSBJT1N5c3RlbS5HbGs6XHJcblx0XHRcdFx0aWYgKHRoaXMuZ2xrTW9kZSA9PT0gR2xrTW9kZS5XcmFwcGVyKVxyXG5cdFx0XHRcdFx0R2xrV3JhcHBlcldyaXRlLmNhbGwodGhpcywgeCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBvdXRwdXQgc3lzdGVtICR7dGhpcy5vdXRwdXRTeXN0ZW19YCk7XHJcblx0fVxyXG5cdFxyXG5cdFxyXG5cdGV4cG9ydCBjb25zdCBlbnVtIEdMVUxYX0hVRkYge1xyXG5cdFx0Ly8gU3RyaW5nIGRlY29kaW5nIHRhYmxlOiBoZWFkZXIgZmllbGQgb2Zmc2V0c1xyXG4gICAgICAgIFRBQkxFU0laRV9PRkZTRVQgPSAwLFxyXG4gICAgICAgIE5PREVDT1VOVF9PRkZTRVQgPSA0LFxyXG4gICAgICAgIFJPT1ROT0RFX09GRlNFVCA9IDgsXHJcblxyXG4gICAgICAgIC8vIFN0cmluZyBkZWNvZGluZyB0YWJsZTogbm9kZSB0eXBlc1xyXG4gICAgICAgIE5PREVfQlJBTkNIID0gMCxcclxuICAgICAgICBOT0RFX0VORCA9IDEsXHJcbiAgICAgICAgTk9ERV9DSEFSID0gMixcclxuICAgICAgICBOT0RFX0NTVFIgPSAzLFxyXG4gICAgICAgIE5PREVfVU5JQ0hBUiA9IDQsXHJcbiAgICAgICAgTk9ERV9VTklTVFIgPSA1LFxyXG4gICAgICAgIE5PREVfSU5ESVJFQ1QgPSA4LFxyXG4gICAgICAgXHROT0RFX0RCTElORElSRUNUID0gOSxcclxuICAgICAgICBOT0RFX0lORElSRUNUX0FSR1MgPSAxMCxcclxuICAgICAgICBOT0RFX0RCTElORElSRUNUX0FSR1MgPSAxMVxyXG5cdH1cclxuXHRcclxuXHQvKipcclxuXHQgKiBQcmludHMgdGhlIG5leHQgY2hhcmFjdGVyIG9mIGEgY29tcHJlc3NlZCBzdHJpbmcsIGNvbnN1bWluZyBvbmUgb3IgbW9yZSBiaXRzLlxyXG4gICAgICpcclxuXHQgKi9cclxuXHRleHBvcnQgZnVuY3Rpb24gTmV4dENvbXByZXNzZWRDaGFyKCl7XHJcblx0XHRsZXQgZW5naW5lOiBFbmdpbmUgPSB0aGlzO1xyXG5cdFx0bGV0IHtpbWFnZX0gPSBlbmdpbmU7XHJcblx0XHRsZXQgbm9kZSA9IGltYWdlLnJlYWRJbnQzMih0aGlzLmRlY29kaW5nVGFibGUgKyBHTFVMWF9IVUZGLlJPT1ROT0RFX09GRlNFVCk7XHJcblx0XHRcclxuXHRcdHdoaWxlICh0cnVlKXtcclxuXHRcdFx0bGV0IG5vZGVUeXBlID0gaW1hZ2UucmVhZEJ5dGUobm9kZSsrKTtcclxuXHRcdFx0c3dpdGNoKG5vZGVUeXBlKXtcclxuXHRcdFx0XHRjYXNlIEdMVUxYX0hVRkYuTk9ERV9CUkFOQ0g6XHJcblx0XHRcdFx0XHRpZiAobmV4dENvbXByZXNzZWRTdHJpbmdCaXQoZW5naW5lKSl7XHJcblx0XHRcdFx0XHRcdG5vZGUgPSBpbWFnZS5yZWFkSW50MzIobm9kZSs0KTsgLy8gZ28gcmlnaHRcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRub2RlID0gaW1hZ2UucmVhZEludDMyKG5vZGUpOyAvLyBnbyBsZWZ0XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIEdMVUxYX0hVRkYuTk9ERV9FTkQ6XHJcblx0XHRcdFx0XHR0aGlzLnJlc3VtZUZyb21DYWxsU3R1YigwKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRjYXNlIEdMVUxYX0hVRkYuTk9ERV9DSEFSOlxyXG5cdFx0XHRcdGNhc2UgR0xVTFhfSFVGRi5OT0RFX1VOSUNIQVI6XHJcblx0XHRcdFx0XHRsZXQgYyA9IChub2RlVHlwZSA9PT0gR0xVTFhfSFVGRi5OT0RFX1VOSUNIQVIpID8gaW1hZ2UucmVhZEludDMyKG5vZGUpIDogaW1hZ2UucmVhZEJ5dGUobm9kZSk7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5vdXRwdXRTeXN0ZW0gPT09IElPU3lzdGVtLkZpbHRlcil7XHJcblx0XHRcdFx0XHRcdHRoaXMucGVyZm9ybUNhbGwodGhpcy5maWx0ZXJBZGRyZXNzLCBbIGMgXSwgR0xVTFhfU1RVQi5SRVNVTUVfSFVGRlNUUiwgdGhpcy5wcmludGluZ0RpZ2l0LCB0aGlzLlBDKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRTZW5kQ2hhclRvT3V0cHV0LmNhbGwodGhpcywgYyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0Y2FzZSBHTFVMWF9IVUZGLk5PREVfQ1NUUjpcclxuXHRcdFx0XHRcdGlmICh0aGlzLm91dHB1dFN5c3RlbSA9PT0gSU9TeXN0ZW0uRmlsdGVyKXtcclxuXHRcdFx0XHRcdFx0dGhpcy5wdXNoQ2FsbFN0dWIoR0xVTFhfU1RVQi5SRVNVTUVfSFVGRlNUUiwgdGhpcy5wcmludGluZ0RpZ2l0LCB0aGlzLlBDLCB0aGlzLkZQKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5QQyA9IG5vZGU7XHJcblx0XHRcdFx0XHRcdHRoaXMuZXhlY01vZGUgPSBFeGVjdXRpb25Nb2RlLkNTdHJpbmc7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0U2VuZFN0cmluZ1RvT3V0cHV0LmNhbGwodGhpcywgdGhpcy5pbWFnZS5yZWFkQ1N0cmluZyhub2RlKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0Ly8gVE9ETzogdGhlIG90aGVyIG5vZGUgdHlwZXNcclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbnJlY29nbml6ZWQgY29tcHJlc3NlZCBzdHJpbmcgbm9kZSB0eXBlICR7bm9kZVR5cGV9YCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0XHJcblx0ZnVuY3Rpb24gbmV4dENvbXByZXNzZWRTdHJpbmdCaXQoZW5naW5lKTogYm9vbGVhbntcclxuXHRcdGxldCByZXN1bHQgPSAoKGVuZ2luZS5pbWFnZS5yZWFkQnl0ZShlbmdpbmUuUEMpICYgKCAxIDw8IGVuZ2luZS5wcmludGluZ0RpZ2l0KSkgIT09IDApXHJcblx0XHRlbmdpbmUucHJpbnRpbmdEaWdpdCsrO1xyXG5cdFx0aWYgKGVuZ2luZS5wcmludGluZ0RpZ2l0ID09PSA4KXtcclxuXHRcdFx0ZW5naW5lLnByaW50aW5nRGlnaXQgPSAwO1xyXG5cdFx0XHRlbmdpbmUuUEMrKztcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fVxyXG5cdFxyXG5cdGV4cG9ydCBmdW5jdGlvbiBOZXh0Q1N0cmluZ0NoYXIoKXtcclxuXHRcdGxldCBjaCA9IHRoaXMuaW1hZ2UucmVhZEJ5dGUodGhpcy5QQysrKTtcclxuXHRcdGlmIChjaCA9PT0gMCl7XHJcblx0XHRcdHRoaXMucmVzdW1lRnJvbUNhbGxTdHViKDApO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5vdXRwdXRTeXN0ZW0gPT09IElPU3lzdGVtLkZpbHRlcil7XHJcblx0XHRcdHRoaXMucGVyZm9ybUNhbGwodGhpcy5maWx0ZXJBZGRyZXNzLCBbY2hdLCAgR0xVTFhfU1RVQi5SRVNVTUVfQ1NUUiwgMCwgdGhpcy5QQyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0U2VuZENoYXJUb091dHB1dChjaCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGV4cG9ydCBmdW5jdGlvbiBOZXh0VW5pU3RyaW5nQ2hhcigpe1xyXG5cdFx0bGV0IGNoID0gdGhpcy5pbWFnZS5yZWFkSW50MzIodGhpcy5QQyk7XHJcblx0XHR0aGlzLlBDICs9IDQ7XHJcblx0XHRpZiAoY2ggPT09IDApe1xyXG5cdFx0XHR0aGlzLnJlc3VtZUZyb21DYWxsU3R1YigwKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMub3V0cHV0U3lzdGVtID09PSBJT1N5c3RlbS5GaWx0ZXIpe1xyXG5cdFx0XHR0aGlzLnBlcmZvcm1DYWxsKHRoaXMuZmlsdGVyQWRkcmVzcywgW2NoXSwgIEdMVUxYX1NUVUIuUkVTVU1FX1VOSVNUUiwgMCwgdGhpcy5QQyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0U2VuZENoYXJUb091dHB1dChjaCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGV4cG9ydCBmdW5jdGlvbiBOZXh0RGlnaXQoKXtcclxuXHRcdGxldCBzOnN0cmluZyA9IHRoaXMuUEMudG9TdHJpbmcoKTtcclxuXHRcdGlmICh0aGlzLnByaW50aW5nRGlnaXQgPCBzLmxlbmd0aCl7XHJcblx0XHRcdGxldCBjaCA9IHMuY2hhckF0KHRoaXMucHJpbnRpbmdEaWdpdCk7XHJcblx0XHRcdGlmICh0aGlzLm91dHB1dFN5c3RlbSA9PT0gSU9TeXN0ZW0uRmlsdGVyKXtcclxuXHRcdFx0XHR0aGlzLnBlcmZvcm1DYWxsKHRoaXMuZmlsdGVyQWRkcmVzcywgW2NoLmNoYXJDb2RlQXQoMCldLCAgR0xVTFhfU1RVQi5SRVNVTUVfTlVNQkVSLCB0aGlzLnByaW50aW5nRGlnaXQrMSwgdGhpcy5QQyk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFNlbmRTdHJpbmdUb091dHB1dChjaCk7XHJcblx0XHRcdFx0dGhpcy5wcmludGluZ0RpZ2l0Kys7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHR0aGlzLnJlc3VtZUZyb21DYWxsU3R1YigwKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0ZXhwb3J0IGludGVyZmFjZSBDaGFubmVsRGF0YSB7XHJcblx0XHRbY2hhbm5lbDogc3RyaW5nXSA6IHN0cmluZzsgXHJcblx0XHRNQUlOPzogc3RyaW5nO1xyXG5cdFx0UFJQVD86IHN0cmluZztcdC8vIHByb21wdFxyXG5cdFx0TE9DTj86IHN0cmluZzsgIC8vIGxvY2F0aW9uXHJcblx0XHRTQ09SPzogc3RyaW5nOyAgLy8gc2NvcmVcclxuXHRcdFRJTUU/OiBzdHJpbmc7ICAvLyB0aW1lIChoaG1tKVxyXG5cdFx0VFVSTj86IHN0cmluZzsgIC8vIHR1cm4gY291bnRcclxuXHRcdFBMT0c/OiBzdHJpbmc7ICAvLyBwcm9sb2d1ZSxcclxuXHRcdERFQUQ/OiBzdHJpbmc7ICAvLyBEZWF0aCB0ZXh0IChzaG93biB3aGVuIHBsYXllciBkaWVzKVxyXG5cdFx0RU5ERz86IHN0cmluZzsgIC8vIEVuZCBnYW1lIHRleHRcclxuXHRcdElORk8/OiBzdHJpbmc7ICAvLyBTdG9yeSBpbmZvIHRleHQgKGNvbWVzIG91dCBhcyBKU09OKVxyXG5cdFx0U05PVD86IHN0cmluZzsgIC8vICBOb3RpZnkgaWYgc2NvcmUgY2hhbmdlc1xyXG5cdH1cclxuXHRcclxuXHRcclxuXHRleHBvcnQgY2xhc3MgT3V0cHV0QnVmZmVyIHtcclxuXHRcdFxyXG5cdFx0Ly8gTm8gc3BlY2lhbCBcIlN0cmluZ0J1aWxkZXJcIlxyXG5cdFx0Ly8gc2ltcGxlIFN0cmluZyBjb25jYXRlbmF0aW9uIGlzIHNhaWQgdG8gYmUgZmFzdCBvbiBtb2Rlcm4gYnJvd3NlcnNcclxuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI3MTI2MzU1LzE0OTU1XHJcblx0XHRcclxuXHRcdHByaXZhdGUgY2hhbm5lbCA9ICdNQUlOJztcclxuXHRcdFxyXG5cdFx0cHJpdmF0ZSBjaGFubmVsRGF0YTogQ2hhbm5lbERhdGEgID0ge1xyXG5cdFx0XHRcdE1BSU46ICcnXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGdldENoYW5uZWwoKTogc3RyaW5ne1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5jaGFubmVsO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvKiogIElmIHRoZSBvdXRwdXQgY2hhbm5lbCBpcyBjaGFuZ2VkIHRvIGFueSBjaGFubmVsIG90aGVyIHRoYW5cclxuICAgICAgICAqIFwiTUFJTlwiLCB0aGUgY2hhbm5lbCdzIGNvbnRlbnRzIHdpbGwgYmVcclxuICAgICAgICAqIGNsZWFyZWQgZmlyc3QuXHJcblx0XHQqL1xyXG5cdFx0c2V0Q2hhbm5lbChjOiBzdHJpbmcpe1xyXG5cdFx0XHRpZiAoYyA9PT0gdGhpcy5jaGFubmVsKSByZXR1cm47XHJcblx0XHRcdHRoaXMuY2hhbm5lbCA9IGM7XHJcblx0XHRcdGlmIChjICE9PSAnTUFJTicpe1xyXG5cdFx0XHRcdHRoaXMuY2hhbm5lbERhdGFbY10gPSAnJztcdFxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8qKiBcclxuXHRcdCAqIFdyaXRlcyBhIHN0cmluZyB0byB0aGUgYnVmZmVyIGZvciB0aGUgY3VycmVudGx5XHJcblx0XHQgKiBzZWxlY3RlZCBvdXRwdXQgY2hhbm5lbC5cclxuXHRcdCAqL1xyXG5cdFx0d3JpdGUoczogc3RyaW5nKXtcclxuXHRcdFx0dGhpcy5jaGFubmVsRGF0YVt0aGlzLmNoYW5uZWxdICs9IHM7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogIFBhY2thZ2VzIGFsbCB0aGUgb3V0cHV0IHRoYXQgaGFzIGJlZW4gc3RvcmVkIHNvIGZhciwgcmV0dXJucyBpdCxcclxuICAgICAgICAgKiAgYW5kIGVtcHRpZXMgdGhlIGJ1ZmZlci5cclxuXHRcdCAqL1xyXG5cdFx0Zmx1c2goKSA6IENoYW5uZWxEYXRhe1xyXG5cdFx0XHRsZXQge2NoYW5uZWxEYXRhfSA9IHRoaXM7XHJcblx0XHRcdGxldCByIDogQ2hhbm5lbERhdGE9IHt9O1xyXG5cdFx0XHRmb3IgKGxldCBjIGluIGNoYW5uZWxEYXRhKSB7XHJcblx0XHRcdFx0bGV0IHMgPSBjaGFubmVsRGF0YVtjXTtcclxuXHRcdFx0XHRpZiAocyl7XHJcblx0XHRcdFx0XHRyW2NdID0gcztcclxuXHRcdFx0XHRcdGNoYW5uZWxEYXRhW2NdID0gJyc7XHRcdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0XHJcblx0fVxyXG5cdFxyXG59IiwiLy8gV3JpdHRlbiBpbiAyMDE1IGJ5IFRoaWxvIFBsYW56IGFuZCBBbmRyZXcgUGxvdGtpblxyXG4vLyBUbyB0aGUgZXh0ZW50IHBvc3NpYmxlIHVuZGVyIGxhdywgSSBoYXZlIGRlZGljYXRlZCBhbGwgY29weXJpZ2h0IGFuZCByZWxhdGVkIGFuZCBuZWlnaGJvcmluZyByaWdodHMgXHJcbi8vIHRvIHRoaXMgc29mdHdhcmUgdG8gdGhlIHB1YmxpYyBkb21haW4gd29ybGR3aWRlLiBUaGlzIHNvZnR3YXJlIGlzIGRpc3RyaWJ1dGVkIHdpdGhvdXQgYW55IHdhcnJhbnR5LiBcclxuLy8gaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvcHVibGljZG9tYWluL3plcm8vMS4wL1xyXG5cclxubW9kdWxlIEZ5cmVWTSB7XHJcblx0XHJcblx0LyoqXHJcblx0ICogYSBzdHJ1Y3QgdG8ga2VlcCB0cmFjayBvZiBoZWFwIGZyYWdtZW50c1xyXG5cdCAqL1xyXG5cdFxyXG5cdGNsYXNzIEhlYXBFbnRyeSB7XHJcblx0XHRvZmZzZXQ6IG51bWJlcjtcclxuXHRcdGxlbmd0aDogbnVtYmVyO1xyXG5cdFx0Y29uc3RydWN0b3Iob2Zmc2V0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyKXtcclxuXHRcdFx0dGhpcy5vZmZzZXQgPSBvZmZzZXQ7XHJcblx0XHRcdHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogTWFuYWdlcyB0aGUgaGVhcCBzaXplIGFuZCBibG9jayBhbGxvY2F0aW9uIGZvciB0aGUgbWFsbG9jL21mcmVlIG9wY29kZXMuXHJcblx0ICogXHJcblx0ICogSWYgSW5mb3JtIGV2ZXIgc3RhcnRzIHVzaW5nIHRoZSBtYWxsb2Mgb3Bjb2RlIGRpcmVjdGx5LCBpbnN0ZWFkIG9mXHJcbiAgICAgKiBpdHMgb3duIGhlYXAgYWxsb2NhdG9yLCB0aGlzIHNob3VsZCBiZSBtYWRlIGEgbGl0dGxlIHNtYXJ0ZXIuXHJcbiAgICAgKiBDdXJyZW50bHkgd2UgbWFrZSBubyBhdHRlbXB0IHRvIGF2b2lkIGhlYXAgZnJhZ21lbnRhdGlvbi5cclxuXHQgKi9cclxuXHRcclxuXHRleHBvcnQgY2xhc3MgSGVhcEFsbG9jYXRvciB7XHJcblx0XHRwcml2YXRlIGhlYXBBZGRyZXNzOiBudW1iZXI7XHJcblx0XHRwcml2YXRlIGVuZE1lbTogbnVtYmVyO1xyXG5cdFx0cHJpdmF0ZSBoZWFwRXh0ZW50ID0gMDtcclxuXHQgXHRtYXhIZWFwRXh0ZW50ID0gMFxyXG5cdFx0cHJpdmF0ZSBtZW1vcnk6IE1lbW9yeUFjY2VzcztcclxuXHRcdHByaXZhdGUgYmxvY2tzOiBIZWFwRW50cnlbXSA9IFtdO1xyXG5cdFx0cHJpdmF0ZSBmcmVlTGlzdDogSGVhcEVudHJ5W10gPSBbXTtcclxuXHRcdFxyXG5cdFx0XHJcblx0XHRjb25zdHJ1Y3RvcihoZWFwQWRkcmVzczogbnVtYmVyLCBtZW1vcnk6IE1lbW9yeUFjY2Vzcyl7XHJcblx0XHRcdHRoaXMuaGVhcEFkZHJlc3MgPSBoZWFwQWRkcmVzcztcclxuXHRcdFx0dGhpcy5tZW1vcnkgPSBtZW1vcnk7XHJcblx0XHRcdHRoaXMuZW5kTWVtID0gaGVhcEFkZHJlc3M7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogc2F2ZXMgdGhlIGhlYXAgc3RhdGUgaW50byBhIFVpbnQ4QXJyYXkuXHJcblx0XHQgKiBEb2VzIG5vdCBpbmNsdWRlIHRoZSBtZW1vcnkgaXRzZWxmLCBvbmx5IHRoZSBibG9jayBhbGxvY2F0aW9uIGluZm9ybWF0aW9uLlxyXG5cdFx0ICovXHJcblx0XHQgc2F2ZSgpOiBVaW50OEFycmF5IHtcclxuXHRcdFx0IGxldCBjb3VudCA9IHRoaXMuYmxvY2tDb3VudCgpIDtcclxuXHRcdFx0IGxldCByZXN1bHQgPSBuZXcgTWVtb3J5QWNjZXNzKDggKyBjb3VudCAqIDgpO1xyXG5cdFx0XHQgcmVzdWx0LndyaXRlSW50MzIoMCwgdGhpcy5oZWFwQWRkcmVzcyk7XHJcblx0XHRcdCByZXN1bHQud3JpdGVJbnQzMig0LCBjb3VudCk7XHJcblx0XHRcdCBsZXQge2Jsb2Nrc30gPSB0aGlzO1xyXG5cdFx0XHQgZm9yKGxldCBpPTA7IGk8Y291bnQ7IGkrKyl7XHJcblx0XHRcdFx0IHJlc3VsdC53cml0ZUludDMyKDgqaSs4LCBibG9ja3NbaV0ub2Zmc2V0KTtcclxuXHRcdFx0XHQgcmVzdWx0LndyaXRlSW50MzIoOCppKjEyLCBibG9ja3NbaV0ubGVuZ3RoKTtcclxuXHRcdFx0IH1cclxuXHRcdFx0IHJldHVybiByZXN1bHQuYnVmZmVyO1xyXG5cdFx0IH1cclxuXHRcdCBcclxuXHRcdCAvKipcclxuXHRcdCAgKiByZXN0b3JlcyB0aGUgaGVhcCBzdGF0ZSBmcm9tIGFuIFVpbnQ4QXJyYXkgKGFzIGNyZWF0ZWQgYnkgdGhlIFwic2F2ZVwiIG1ldGhvZClcclxuXHRcdCAgKi9cclxuXHRcdHN0YXRpYyByZXN0b3JlKGJ1ZmZlcjogVWludDhBcnJheSwgbWVtb3J5OiBNZW1vcnlBY2Nlc3MpIDogSGVhcEFsbG9jYXRvcntcclxuXHRcdFx0bGV0IG0gPSBuZXcgTWVtb3J5QWNjZXNzKDApO1xyXG5cdFx0XHRtLmJ1ZmZlciA9IGJ1ZmZlcjtcclxuXHRcdFx0bGV0IGNvdW50ID0gbS5yZWFkSW50MzIoNCk7XHJcblx0XHRcclxuXHRcdFx0aWYgKGNvdW50ID09PSAwKVxyXG5cdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHJcblx0XHRcdGxldCBoZWFwID0gbmV3IEhlYXBBbGxvY2F0b3IobS5yZWFkSW50MzIoMCksIG1lbW9yeSk7XHJcblx0XHRcdGxldCBuZXh0QWRkcmVzcyA9IGhlYXAuaGVhcEFkZHJlc3M7XHJcblx0XHRcdGZvciAobGV0IGk9MDsgaTxjb3VudDsgaSsrKXtcclxuXHRcdFx0XHRsZXQgc3RhcnQgPSBtLnJlYWRJbnQzMig4KmkrOCk7XHJcblx0XHRcdFx0bGV0IGxlbmd0aCA9IG0ucmVhZEludDMyKDgqaSsxMik7XHJcblx0XHRcdFx0aGVhcC5ibG9ja3MucHVzaChuZXcgSGVhcEVudHJ5KHN0YXJ0LCBsZW5ndGgpKTtcclxuXHRcdFx0XHRpZiAobmV4dEFkZHJlc3MgPCBzdGFydCl7XHJcblx0XHRcdFx0XHRoZWFwLmZyZWVMaXN0LnB1c2gobmV3IEhlYXBFbnRyeShuZXh0QWRkcmVzcywgc3RhcnQtbmV4dEFkZHJlc3MpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV4dEFkZHJlc3MgPSBzdGFydCtsZW5ndGg7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGhlYXAuZW5kTWVtID0gbmV4dEFkZHJlc3M7XHJcblx0XHRcdGhlYXAuaGVhcEV4dGVudCA9IG5leHRBZGRyZXNzIC0gaGVhcC5oZWFwQWRkcmVzcztcclxuXHRcdFx0aWYgKCFoZWFwLm1lbW9yeS5zZXRFbmRNZW0oaGVhcC5lbmRNZW0pKXtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBhbGxvY2F0ZSBWTSBtZW1vcnkgdG8gZml0IHNhdmVkIGhlYXBcIilcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBUT0RPOiBzb3J0IGJsb2NrbGlzdCBhbmQgZnJlZWxpc3RcclxuXHRcdFx0cmV0dXJuIGhlYXA7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdFxyXG5cdFx0LyoqXHJcblx0XHQgKiBhbGxvY2F0ZXMgYSBuZXcgYmxvY2sgb24gdGhlIGhlYXBcclxuXHRcdCAqIEByZXR1cm4gdGhlIGFkZHJlc3Mgb2YgdGhlIG5ldyBibG9jaywgb3IgbnVsbCBpZiBhbGxvY2F0aW9uIGZhaWxlZFxyXG5cdFx0ICovXHJcblx0XHRhbGxvYyhzaXplOiBudW1iZXIpIDogbnVtYmVye1xyXG5cdFx0XHRcdGxldCB7YmxvY2tzLCBmcmVlTGlzdH0gPSB0aGlzO1xyXG5cdFx0XHJcblx0XHRcdFx0bGV0IHJlc3VsdCA9IG5ldyBIZWFwRW50cnkoLTEsIHNpemUpO1xyXG5cdFx0XHRcdC8vIGxvb2sgZm9yIGEgZnJlZSBibG9ja1xyXG5cdFx0XHRcdGZvcihsZXQgaT0wOyBpPGZyZWVMaXN0Lmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0XHRcdGxldCBlbnRyeSA9IGZyZWVMaXN0W2ldO1xyXG5cdFx0XHRcdFx0aWYoZW50cnkgJiYgZW50cnkubGVuZ3RoID49IHNpemUpe1xyXG5cdFx0XHRcdFx0XHRyZXN1bHQub2Zmc2V0ID0gZW50cnkub2Zmc2V0O1xyXG5cdFx0XHRcdFx0XHRpZiAoZW50cnkubGVuZ3RoID4gc2l6ZSl7XHJcblx0XHRcdFx0XHRcdFx0Ly8ga2VlcCB0aGUgcmVzdCBpbiB0aGUgZnJlZSBsaXN0XHJcblx0XHRcdFx0XHRcdFx0ZW50cnkub2Zmc2V0ICs9IHNpemU7XHJcblx0XHRcdFx0XHRcdFx0ZW50cnkubGVuZ3RoIC09IHNpemU7XHJcblx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdGZyZWVMaXN0W2ldID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHJlc3VsdC5vZmZzZXQgPT09IC0xKXtcclxuXHRcdFx0XHRcdC8vIGVuZm9yY2UgbWF4IGhlYXAgc2l6ZVxyXG5cdFx0XHRcdFx0aWYgKHRoaXMubWF4SGVhcEV4dGVudCAmJiB0aGlzLmhlYXBFeHRlbnQgKyBzaXplID4gdGhpcy5tYXhIZWFwRXh0ZW50KXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyBhZGQgYSBuZXcgYmxvY2tcclxuXHRcdFx0XHRcdHJlc3VsdC5vZmZzZXQgPSB0aGlzLmhlYXBBZGRyZXNzICsgdGhpcy5oZWFwRXh0ZW50O1xyXG5cdFx0XHRcdFx0aWYgKHJlc3VsdC5vZmZzZXQgKyBzaXplID4gdGhpcy5lbmRNZW0pe1xyXG5cdFx0XHRcdFx0XHQvLyBncm93IHRoZSBoZWFwXHJcblx0XHRcdFx0XHRcdGxldCBuZXdIZWFwQWxsb2NhdGlvbiA9IE1hdGgubWF4KFxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuaGVhcEV4dGVudCAqIDUgLyA0LCB0aGlzLmhlYXBFeHRlbnQgKyBzaXplKTtcclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMubWF4SGVhcEV4dGVudCl7XHJcblx0XHRcdFx0XHRcdFx0bmV3SGVhcEFsbG9jYXRpb24gPSBNYXRoLm1pbihuZXdIZWFwQWxsb2NhdGlvbiwgdGhpcy5tYXhIZWFwRXh0ZW50KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0aWYgKCEgdGhpcy5zZXRFbmRNZW0obmV3SGVhcEFsbG9jYXRpb24pKXtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR0aGlzLmhlYXBFeHRlbnQgKz0gc2l6ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly8gVE9ETzoga2VlcCB0aGUgbGlzdCBzb3J0ZWRcclxuXHRcdFx0XHRibG9ja3MucHVzaChyZXN1bHQpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHJldHVybiByZXN1bHQub2Zmc2V0O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRwcml2YXRlIHNldEVuZE1lbShuZXdIZWFwQWxsb2NhdGlvbjogbnVtYmVyKSA6IGJvb2xlYW57XHJcblx0XHRcdGxldCBuZXdFbmRNZW0gPSB0aGlzLmhlYXBBZGRyZXNzICsgbmV3SGVhcEFsbG9jYXRpb247XHJcblx0XHRcdGlmICh0aGlzLm1lbW9yeS5zZXRFbmRNZW0obmV3RW5kTWVtKSl7XHJcblx0XHRcdFx0dGhpcy5lbmRNZW0gPSBuZXdFbmRNZW07XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRibG9ja0NvdW50KCkgOiBudW1iZXIge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5ibG9ja3MubGVuZ3RoO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdCAqIGRlYWxsb2NhdGVzIGEgcHJldmlvdXNseSBhbGxvY2F0ZWQgYmxvY2tcclxuXHRcdCAqL1xyXG5cdFx0ZnJlZShhZGRyZXNzOiBudW1iZXIpe1xyXG5cdFx0XHRsZXQge2Jsb2NrcywgZnJlZUxpc3R9ID0gdGhpcztcclxuXHRcdFx0Ly8gZmluZCB0aGUgYmxvY2tcclxuXHRcdFx0Zm9yKGxldCBpPTA7IGk8YmxvY2tzLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0XHRsZXQgYmxvY2sgPSBibG9ja3NbaV07XHJcblx0XHRcdFx0aWYgKGJsb2NrLm9mZnNldCA9PT0gYWRkcmVzcyl7XHJcblx0XHRcdFx0XHQvLyByZW1vdmUgaXRcclxuXHRcdFx0XHRcdGJsb2Nrcy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdFx0XHQvLyBzaHJpbmsgdGhlIGhlYXAgaWYgdGhhdCB3YXMgYXQgdGhlIGVuZFxyXG5cdFx0XHRcdFx0aWYgKGFkZHJlc3MrYmxvY2subGVuZ3RoLXRoaXMuaGVhcEFkZHJlc3MgPT09IHRoaXMuaGVhcEV4dGVudCl7XHJcblx0XHRcdFx0XHRcdGxldCBuZXdIZWFwRXh0ZW50ID0gdGhpcy5oZWFwQWRkcmVzcztcclxuXHRcdFx0XHRcdFx0Zm9yKGxldCBqPTA7IGo8YmxvY2tzLmxlbmd0aDsgaisrKXtcclxuXHRcdFx0XHRcdFx0XHRsZXQgYiA9IGJsb2Nrc1tqXTtcclxuXHRcdFx0XHRcdFx0XHRuZXdIZWFwRXh0ZW50ID0gTWF0aC5tYXgobmV3SGVhcEV4dGVudCwgYi5sZW5ndGggKyBiLm9mZnNldCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0dGhpcy5oZWFwRXh0ZW50ID0gbmV3SGVhcEV4dGVudCAtIHRoaXMuaGVhcEFkZHJlc3M7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvLyBhZGQgdG8gdGhlIGZyZWUgbGlzdFxyXG5cdFx0XHRcdFx0XHRmcmVlTGlzdC5wdXNoKGJsb2NrKTtcclxuXHRcdFx0XHRcdFx0Ly8gVE9ETzoga2VlcCBzb3J0ZWQgYW5kIGNvYWxlc2NlIGZyZWUgbGlzdFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQvLyBzaHJpbmsgdGhlIGhlYXBcclxuXHRcdFx0XHRcdGlmIChibG9ja3MubGVuZ3RoID4gMCAmJiB0aGlzLmhlYXBFeHRlbnQgPD0gKHRoaXMuZW5kTWVtIC0gdGhpcy5oZWFwQWRkcmVzcykgLyAyKXtcclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuc2V0RW5kTWVtKHRoaXMuaGVhcEV4dGVudCkpe1xyXG5cdFx0XHRcdFx0XHRcdHZhciBuZXdFbmRNZW0gPSB0aGlzLmVuZE1lbTtcclxuXHRcdFx0XHRcdFx0XHRmb3IobGV0IGk9MDsgaTxmcmVlTGlzdC5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgZW50cnkgPSBmcmVlTGlzdFtpXTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChlbnRyeSAmJiBlbnRyeS5vZmZzZXQgPj0gbmV3RW5kTWVtKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnJlZUxpc3RbaV0gPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cdFx0XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0cmV0dXJuO1x0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqICBXcmFwcGVyIGFyb3VuZCBFQ01BU2NyaXB0IDYgc3RhbmRhcmQgVWludDhBcnJheS5cclxuXHQgKiAgUHJvdmlkZXMgYWNjZXNzIHRvIGEgbWVtb3J5IGJ1ZmZlci5cclxuXHQgKi9cclxuXHRleHBvcnQgY2xhc3MgTWVtb3J5QWNjZXNzIHtcclxuXHRcdFxyXG5cdFx0cHVibGljIGJ1ZmZlcjogVWludDhBcnJheTtcclxuXHRcdFxyXG5cdFx0cHJpdmF0ZSBtYXhTaXplOiBudW1iZXI7XHJcblx0XHRcclxuXHRcdGNvbnN0cnVjdG9yKHNpemU6IG51bWJlciwgbWF4U2l6ZT1zaXplKXtcclxuXHRcdFx0dGhpcy5idWZmZXIgPSBuZXcgVWludDhBcnJheShzaXplKTtcclxuXHRcdFx0dGhpcy5tYXhTaXplID0gbWF4U2l6ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZWFkcyBhIHNpbmdsZSBieXRlICh1bnNpZ25lZClcclxuXHRcdCAqL1xyXG5cdFx0cmVhZEJ5dGUob2Zmc2V0OiBudW1iZXIpe1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5idWZmZXJbb2Zmc2V0XTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0IC8qKlxyXG5cdFx0ICogV3JpdGVzIGEgc2luZ2xlIGJ5dGUgKHVuc2lnbmVkKS5cclxuXHRcdCAqIFdyaXRlcyAwIHdoZW4gdmFsdWUgaXMgdW5kZWZpbmVkIG9yIG51bGwuXHJcblx0XHQgKi9cclxuXHRcdHdyaXRlQnl0ZShvZmZzZXQ6IG51bWJlciwgdmFsdWU6bnVtYmVyKXtcclxuXHRcdFx0aWYgKHZhbHVlIDwgMCB8fCB2YWx1ZSA+IDI1NSlcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYCR7dmFsdWV9IGlzIG91dCBvZiByYW5nZSBmb3IgYSBieXRlYCk7XHJcblx0XHRcdHRoaXMuYnVmZmVyW29mZnNldF0gPSB2YWx1ZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZWFkcyBhbiB1bnNpZ25lZCwgYmlnLWVuZGlhbiwgMTYtYml0IG51bWJlclxyXG5cdFx0ICovXHJcblx0XHRyZWFkSW50MTYob2Zmc2V0OiBudW1iZXIpe1xyXG5cdFx0XHRyZXR1cm4gKHRoaXMuYnVmZmVyW29mZnNldF0gKiAyNTYpICsgdGhpcy5idWZmZXJbb2Zmc2V0KzFdO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBUeXBlU2NyaXB0IGRvZXMgbm90IGxpa2UgdXMgY2FsbGluZyBcInNldFwiIHdpdGggYW4gYXJyYXkgZGlyZWN0bHlcclxuXHRcdHByaXZhdGUgc2V0KG9mZnNldDogbnVtYmVyLCB2YWx1ZTogYW55KXtcclxuXHRcdFx0dGhpcy5idWZmZXIuc2V0KHZhbHVlLCBvZmZzZXQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdCAqIFdyaXRlcyBhbiB1bnNpZ25lZCwgYmlnLWVuZGlhbiwgMTYtYml0IG51bWJlci5cclxuXHRcdCAqIFdyaXRlcyAwIHdoZW4gdmFsdWUgaXMgdW5kZWZpbmVkIG9yIG51bGwuXHJcblx0XHQgKi9cclxuXHRcdHdyaXRlSW50MTYob2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpe1xyXG5cdFx0XHRpZiAodmFsdWUgPCAwIHx8IHZhbHVlID4gMHhGRkZGKVxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgJHt2YWx1ZX0gaXMgb3V0IG9mIHJhbmdlIGZvciB1aW50MTZgKTtcclxuXHRcdFx0dGhpcy5zZXQob2Zmc2V0LCBbdmFsdWUgPj4gOCwgdmFsdWUgJiAweEZGXSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdCAvKipcclxuXHRcdCAqIFJlYWRzIGFuIHVuc2lnbmVkLCBiaWctZW5kaWFuLCAzMi1iaXQgbnVtYmVyXHJcblx0XHQgKi9cclxuXHRcdHJlYWRJbnQzMihvZmZzZXQ6IG51bWJlcil7XHJcblx0XHRcdHJldHVybiB0aGlzLmJ1ZmZlcltvZmZzZXRdICogMHgxMDAwMDAwIFxyXG5cdFx0XHQrIHRoaXMuYnVmZmVyW29mZnNldCsxXSAqIDB4MTAwMDAgXHJcblx0XHRcdCsgdGhpcy5idWZmZXJbb2Zmc2V0KzJdICogMHgxMDAgXHJcblx0XHRcdCsgdGhpcy5idWZmZXJbb2Zmc2V0KzNdO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdCAqIFdyaXRlcyBhbiB1bnNpZ25lZCwgYmlnLWVuZGlhbiwgMzItYml0IG51bWJlclxyXG5cdFx0ICogV3JpdGVzIDAgd2hlbiB2YWx1ZSBpcyB1bmRlZmluZWQgb3IgbnVsbC5cclxuXHRcdCAqL1xyXG5cdFx0d3JpdGVJbnQzMihvZmZzZXQ6IG51bWJlciwgdmFsdWU6IG51bWJlcil7XHJcblx0XHRcdHZhbHVlID0gdmFsdWUgPj4+IDA7XHJcblx0XHRcdHRoaXMuc2V0KG9mZnNldCwgWyB2YWx1ZSA+PiAyNCwgdmFsdWUgPj4gMTYgJiAweEZGLCB2YWx1ZSA+PiA4ICYgMHhGRiwgdmFsdWUgJiAweEZGXSlcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0IC8qKlxyXG5cdFx0ICAqIENvbnZlcnRzIHBhcnQgb2YgdGhlIGJ1ZmZlciBpbnRvIGEgU3RyaW5nLFxyXG5cdFx0ICAqIGFzc3VtZXMgdGhhdCB0aGUgZGF0YSBpcyB2YWxpZCBBU0NJSVxyXG5cdFx0ICAqL1xyXG5cdFx0cmVhZEFTQ0lJKG9mZnNldDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IHN0cmluZ3tcclxuXHRcdFx0bGV0IGxlbiA9IDAsIHtidWZmZXJ9ID0gdGhpcywgZCA9IFtdO1xyXG5cdFx0XHR3aGlsZShsZW4gPCBsZW5ndGgpe1xyXG5cdFx0XHRcdGxldCB4ID0gYnVmZmVyW29mZnNldCtsZW5dO1xyXG5cdFx0XHRcdGxlbisrO1x0XHJcblx0XHRcdFx0ZC5wdXNoKHgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKC4uLmQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQgLyoqXHJcblx0XHQgICogcmVhZHMgYSAwLXRlcm1pbmF0ZWQgQy1zdHJpbmdcclxuXHRcdCAgKi9cclxuXHRcdHJlYWRDU3RyaW5nKG9mZnNldDpudW1iZXIpOiBzdHJpbmd7XHJcblx0XHRcdGxldCBsZW4gPSAwLCB7YnVmZmVyfSA9IHRoaXMsIGQgPSBbXTtcclxuXHRcdFx0d2hpbGUodHJ1ZSl7XHJcblx0XHRcdFx0bGV0IHggPSBidWZmZXJbb2Zmc2V0K2xlbl07XHJcblx0XHRcdFx0aWYgKHggPT09IDApXHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRsZW4rKztcdFxyXG5cdFx0XHRcdGQucHVzaCh4KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSguLi5kKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0IC8qKlxyXG5cdFx0ICAqIFdyaXRlcyBhbiBBU0NJSSBTdHJpbmdcclxuXHRcdCAgKi9cclxuXHRcdHdyaXRlQVNDSUkob2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBzdHJpbmcpe1xyXG5cdFx0XHRsZXQgY29kZXMgPSBbXTtcclxuXHRcdFx0Zm9yIChsZXQgaT0wOyBpPHZhbHVlLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0XHRjb2Rlcy5wdXNoKHZhbHVlLmNoYXJDb2RlQXQoaSkpXHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5zZXQob2Zmc2V0LCBjb2Rlcyk7XHJcblx0XHR9XHJcblx0XHQgXHJcblx0XHQgIC8qKlxyXG5cdFx0ICAqIFJlc2l6ZXMgdGhlIGF2YWlsYWJsZSBtZW1vcnlcclxuXHRcdCAgKi9cdFx0IFxyXG5cdFx0c2V0RW5kTWVtKG5ld0VuZE1lbTogbnVtYmVyKSA6IGJvb2xlYW4ge1xyXG5cdFx0XHRpZiAobmV3RW5kTWVtID4gdGhpcy5tYXhTaXplKVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdCAvKipcclxuXHRcdCAgKiBDb3B5IGEgcGFydCBvZiB0aGUgbWVtb3J5IGludG8gYSBuZXcgYnVmZmVyLlxyXG5cdFx0ICAqIFxyXG5cdFx0ICAqIFRoZSBsZW5ndGggY2FuIGJlIG1vcmUgdGhhbiB0aGVyZSBpcyBkYXRhXHJcblx0XHQgICogaW4gdGhlIG9yaWdpbmFsIGJ1ZmZlci4gSW4gdGhpcyBjYXNlIHRoZVxyXG5cdFx0ICAqIG5ldyBidWZmZXIgd2lsbCBjb250YWluIHVuc3BlY2lmaWVkIGRhdGFcclxuXHRcdCAgKiBhdCB0aGUgZW5kLlxyXG5cdFx0ICAqL1xyXG5cdFx0Y29weShvZmZzZXQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpIDogTWVtb3J5QWNjZXNzIHtcclxuXHRcdFx0Ly8gVE9ETzogcmFuZ2UgY2hlY2tcclxuXHRcdFx0aWYgKGxlbmd0aCA+IHRoaXMubWF4U2l6ZSlcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYE1lbW9yeSByZXF1ZXN0IGZvciAke2xlbmd0aH0gYnl0ZXMgZXhjZWVkcyBsaW1pdCBvZiAke3RoaXMubWF4U2l6ZX1gKTtcclxuXHRcdFx0bGV0IHJlc3VsdCA9IG5ldyBNZW1vcnlBY2Nlc3MobGVuZ3RoKTtcclxuXHRcdFx0cmVzdWx0LmJ1ZmZlci5zZXQodGhpcy5idWZmZXIuc3ViYXJyYXkob2Zmc2V0LCBvZmZzZXQrbGVuZ3RoKSk7XHJcblx0XHRcdHJlc3VsdC5tYXhTaXplID0gdGhpcy5tYXhTaXplO1xyXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQgLyoqXHJcblx0XHQgICAqIHJldHVybnMgdGhlIG51bWJlciBvZiBieXRlcyBhdmFpbGFibGVcclxuXHRcdCAgICovXHJcblx0XHRzaXplKCl7XHJcblx0XHRcdHJldHVybiB0aGlzLmJ1ZmZlci5sZW5ndGg7XHJcblx0XHR9XHJcblx0XHRcclxuXHR9XHJcblx0XHJcblx0XHJcbn1cclxuXHJcblxyXG5cclxuIiwiLy8gV3JpdHRlbiBpbiAyMDE1IGJ5IFRoaWxvIFBsYW56IFxyXG4vLyBUbyB0aGUgZXh0ZW50IHBvc3NpYmxlIHVuZGVyIGxhdywgSSBoYXZlIGRlZGljYXRlZCBhbGwgY29weXJpZ2h0IGFuZCByZWxhdGVkIGFuZCBuZWlnaGJvcmluZyByaWdodHMgXHJcbi8vIHRvIHRoaXMgc29mdHdhcmUgdG8gdGhlIHB1YmxpYyBkb21haW4gd29ybGR3aWRlLiBUaGlzIHNvZnR3YXJlIGlzIGRpc3RyaWJ1dGVkIHdpdGhvdXQgYW55IHdhcnJhbnR5LiBcclxuLy8gaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvcHVibGljZG9tYWluL3plcm8vMS4wL1xyXG5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD0nTWVtb3J5QWNjZXNzLnRzJyAvPlxyXG5cclxuLyoqXHJcbiAqIFJlcHJlc2VudHMgdGhlIFJPTSBhbmQgUkFNIG9mIGEgR2x1bHggZ2FtZSBpbWFnZS5cclxuICovXHJcblxyXG5tb2R1bGUgRnlyZVZNIHtcclxuXHJcblx0Ly8gSGVhZGVyIHNpemUgYW5kIGZpZWxkIG9mZnNldHNcclxuXHRjb25zdCBlbnVtIEdMVUxYX0hEUiB7XHJcblx0XHRTSVpFID0gMzYsXHJcbiAgICAgICAgTUFHSUNfT0ZGU0VUID0gMCxcclxuXHRcdFZFUlNJT05fT0ZGU0VUID0gNCxcclxuICAgICAgICBSQU1TVEFSVF9PRkZTRVQgPSA4LFxyXG4gICAgICAgIEVYVFNUQVJUX09GRlNFVCA9IDEyLFxyXG4gICAgICAgIEVORE1FTV9PRkZTRVQgPSAxNixcclxuICAgICAgICBTVEFDS1NJWkVfT0ZGU0VUID0gMjAsXHJcbiAgICAgICAgU1RBUlRGVU5DX09GRlNFVCA9IDI0LFxyXG4gICAgICAgIERFQ09ESU5HVEJMX09GRlNFVCA9IDI4LFxyXG4gICAgICAgIENIRUNLU1VNX09GRlNFVCA9IDMyXHJcblx0fTtcclxuXHJcblx0ZXhwb3J0IGludGVyZmFjZSBHbHVseEhlYWRlciB7XHJcblx0XHRtYWdpYz86IHN0cmluZztcclxuXHRcdHZlcnNpb24/OiBudW1iZXI7XHJcblx0XHRyYW1TdGFydD86IG51bWJlcjtcclxuXHRcdGV4dFN0YXJ0PzogbnVtYmVyO1xyXG5cdFx0ZW5kTWVtPyA6IG51bWJlcjtcclxuXHRcdHN0YWNrU2l6ZT86IG51bWJlcjtcclxuXHRcdHN0YXJ0RnVuYz86IG51bWJlcjtcclxuXHRcdGRlY29kaW5nVGJsPzogbnVtYmVyO1xyXG5cdFx0Y2hlY2tzdW0/OiBudW1iZXI7XHJcblx0fVxyXG5cdFxyXG5cclxuXHJcblx0ZXhwb3J0IGNsYXNzIFVseEltYWdle1xyXG5cdFx0XHJcblx0XHRwcml2YXRlIG1lbW9yeTogTWVtb3J5QWNjZXNzO1xyXG5cdFx0cHJpdmF0ZSByYW1zdGFydDogbnVtYmVyO1xyXG5cdFx0cHJpdmF0ZSBvcmlnaW5hbDogTWVtb3J5QWNjZXNzO1xyXG5cdFx0XHJcblx0XHRjb25zdHJ1Y3RvcihvcmlnaW5hbDogTWVtb3J5QWNjZXNzKXtcclxuXHRcdFx0dGhpcy5vcmlnaW5hbCA9IG9yaWdpbmFsO1xyXG5cdFx0XHR0aGlzLmxvYWRGcm9tT3JpZ2luYWwoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cHJpdmF0ZSBsb2FkRnJvbU9yaWdpbmFsKCl7XHJcblx0XHRcdGxldCBzdHJlYW0gPSB0aGlzLm9yaWdpbmFsO1xyXG5cdFx0XHQvLyByZWFkIHRoZSBoZWFkZXIsIHRvIGZpbmQgb3V0IGhvdyBtdWNoIG1lbW9yeSB3ZSBuZWVkXHJcblx0XHRcdGxldCBoZWFkZXIgPSBzdHJlYW0uY29weSgwLCBHTFVMWF9IRFIuU0laRSk7XHJcblx0XHRcdGxldCBtYWdpYyA9IGhlYWRlci5yZWFkQVNDSUkoMCwgNCk7XHJcblx0XHRcdGlmIChtYWdpYyAhPT0gJ0dsdWwnKXtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYC51bHggZmlsZSBoYXMgd3JvbmcgbWFnaWMgbnVtYmVyICR7bWFnaWN9YCk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGxldCBlbmRtZW0gPSBoZWFkZXIucmVhZEludDMyKEdMVUxYX0hEUi5FTkRNRU1fT0ZGU0VUKTtcclxuXHRcdFx0aWYgKGVuZG1lbSA8IEdMVUxYX0hEUi5TSVpFKXtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgZW5kTWVtICR7ZW5kbWVtfSBpbiAudWx4IGZpbGUuIFRvbyBzbWFsbCB0byBldmVuIGZpdCB0aGUgaGVhZGVyLmApO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIG5vdyByZWFkIHRoZSB3aG9sZSB0aGluZ1xyXG5cdFx0XHR0aGlzLm1lbW9yeSA9IHN0cmVhbS5jb3B5KDAsIGVuZG1lbSk7XHJcblx0XHRcdC8vIFRPRE86IHZlcmlmeSBjaGVja3N1bVxyXG5cdFx0XHR0aGlzLnJhbXN0YXJ0ID0gaGVhZGVyLnJlYWRJbnQzMihHTFVMWF9IRFIuUkFNU1RBUlRfT0ZGU0VUKTtcclxuXHRcdFx0aWYgKHRoaXMucmFtc3RhcnQgPiBlbmRtZW0pe1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgaW52YWxpZCByYW1TdGFydCAke3RoaXMucmFtc3RhcnR9IGJleW9uZCBlbmRNZW0gJHtlbmRtZW19LmApO1xyXG5cdFx0XHR9XHRcdFx0XHJcblx0XHR9XHJcblx0XHJcblx0XHRnZXRNYWpvclZlcnNpb24oKTogbnVtYmVye1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5tZW1vcnkucmVhZEludDE2KEdMVUxYX0hEUi5WRVJTSU9OX09GRlNFVCk7XHJcblx0XHR9XHJcblx0XHJcblx0XHRnZXRNaW5vclZlcnNpb24oKTogbnVtYmVye1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5tZW1vcnkucmVhZEludDE2KEdMVUxYX0hEUi5WRVJTSU9OX09GRlNFVCsyKSA+PiA4O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRnZXRTdGFja1NpemUoKTogbnVtYmVyIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMubWVtb3J5LnJlYWRJbnQzMihHTFVMWF9IRFIuU1RBQ0tTSVpFX09GRlNFVCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGdldEVuZE1lbSgpOiBudW1iZXIge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5tZW1vcnkuc2l6ZSgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRnZXRSYW1BZGRyZXNzKHJlbGF0aXZlQWRkcmVzczogbnVtYmVyKTogbnVtYmVye1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5yYW1zdGFydCArIHJlbGF0aXZlQWRkcmVzcztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0LyoqXHJcblx0XHQgKiBzZXRzIHRoZSBhZGRyZXNzIGF0IHdoaWNoIG1lbW9yeSBlbmRzLlxyXG5cdFx0ICogVGhpcyBjYW4gYmUgY2hhbmdlZCBieSB0aGUgZ2FtZSB3aXRoIHNldG1lbXNpemUsXHJcblx0XHQgKiBvciBtYW5hZ2VkIGF1dG9tYXRpY2FsbHkgYmUgdGhlIGhlYXAgYWxsb2NhdG9yLlxyXG5cdFx0ICovXHJcblx0XHRzZXRFbmRNZW0odmFsdWU6IG51bWJlcil7XHJcblx0XHRcdC8vIHJvdW5kIHVwIHRvIHRoZSBuZXh0IG11bHRpcGxlIG9mIDI1NlxyXG5cdFx0XHRpZiAodmFsdWUgJSAyNTYgIT0gMCl7XHJcblx0XHRcdFx0dmFsdWUgPSAodmFsdWUgKyAyNTUpICYgMHhGRkZGRkYwMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGhpcy5tZW1vcnkuc2l6ZSgpICE9IHZhbHVlKXtcclxuXHRcdFx0XHR0aGlzLm1lbW9yeSA9IHRoaXMubWVtb3J5LmNvcHkoMCwgdmFsdWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGdldFN0YXJ0RnVuYygpOiBudW1iZXIge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5tZW1vcnkucmVhZEludDMyKEdMVUxYX0hEUi5TVEFSVEZVTkNfT0ZGU0VUKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Z2V0RGVjb2RpbmdUYWJsZSgpOiBudW1iZXIge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5tZW1vcnkucmVhZEludDMyKEdMVUxYX0hEUi5ERUNPRElOR1RCTF9PRkZTRVQpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzYXZlVG9RdWV0emFsKCk6IFF1ZXR6YWwge1xyXG5cdFx0XHRsZXQgcXVldHphbCA9IG5ldyBRdWV0emFsKCk7XHJcblx0XHRcdC8vICdJRmhkJyBpZGVudGlmaWVzIHRoZSBmaXJzdCAxMjggYnl0ZXMgb2YgdGhlIGdhbWUgZmlsZVxyXG5cdFx0XHRxdWV0emFsLnNldENodW5rKCdJRmhkJywgdGhpcy5vcmlnaW5hbC5jb3B5KDAsIDEyOCkuYnVmZmVyKTtcclxuXHRcdFx0Ly8gJ0NNZW0nIG9yICdVTWVtJyBhcmUgdGhlIGNvbXByZXNzZWQvdW5jb21wcmVzc2VkIGNvbnRlbnRzIG9mIFJBTVxyXG4gICAgICAgICAgIFx0Ly8gVE9ETzogaW1wbGVtZW50IGNvbXByZXNzaW9uXHJcblx0XHRcdGxldCByYW1TaXplID0gdGhpcy5nZXRFbmRNZW0oKSAtIHRoaXMucmFtc3RhcnQ7XHJcblx0XHRcdGxldCB1bWVtID0gbmV3IE1lbW9yeUFjY2VzcyhyYW1TaXplKzQpO1xyXG5cdFx0XHR1bWVtLndyaXRlSW50MzIoMCwgcmFtU2l6ZSk7XHJcblx0XHRcdHVtZW0uYnVmZmVyLnNldChuZXcgVWludDhBcnJheSh0aGlzLm1lbW9yeS5idWZmZXIpLnN1YmFycmF5KHRoaXMucmFtc3RhcnQsIHRoaXMucmFtc3RhcnQrcmFtU2l6ZSksIDQpO1xyXG5cdFx0XHRxdWV0emFsLnNldENodW5rKFwiVU1lbVwiLCB1bWVtLmJ1ZmZlcik7XHJcblx0XHRcdHJldHVybiBxdWV0emFsO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZWFkQnl0ZShhZGRyZXNzOiBudW1iZXIpIDogbnVtYmVyIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMubWVtb3J5LnJlYWRCeXRlKGFkZHJlc3MpO1xyXG5cdFx0fVxyXG5cdFxyXG5cdFx0cmVhZEludDE2KGFkZHJlc3M6IG51bWJlcikgOiBudW1iZXIge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5tZW1vcnkucmVhZEludDE2KGFkZHJlc3MpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZWFkSW50MzIoYWRkcmVzczogbnVtYmVyKSA6IG51bWJlciB7XHJcblx0XHRcdHJldHVybiB0aGlzLm1lbW9yeS5yZWFkSW50MzIoYWRkcmVzcyk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJlYWRDU3RyaW5nKGFkZHJlc3M6IG51bWJlcik6IHN0cmluZyB7XHJcblx0XHRcdHJldHVybiB0aGlzLm1lbW9yeS5yZWFkQ1N0cmluZyhhZGRyZXNzKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0d3JpdGVJbnQzMihhZGRyZXNzOiBudW1iZXIsIHZhbHVlOiBudW1iZXIpIHtcclxuXHRcdFx0aWYgKGFkZHJlc3MgPCB0aGlzLnJhbXN0YXJ0KVxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgV3JpdGluZyBpbnRvIFJPTSEgb2Zmc2V0OiAke2FkZHJlc3N9YCk7XHJcblx0XHRcdHRoaXMubWVtb3J5LndyaXRlSW50MzIoYWRkcmVzcywgdmFsdWUpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR3cml0ZUJ5dGVzKGFkZHJlc3M6IG51bWJlciwgLi4uYnl0ZXM6IG51bWJlcltdKXtcclxuXHRcdFx0aWYgKGFkZHJlc3MgPCB0aGlzLnJhbXN0YXJ0KVxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgV3JpdGluZyBpbnRvIFJPTSEgb2Zmc2V0OiAke2FkZHJlc3N9YCk7XHJcblx0XHRcdGZvciAobGV0IGk9MDsgaTxieXRlcy5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0dGhpcy5tZW1vcnkud3JpdGVCeXRlKGFkZHJlc3MraSwgYnl0ZXNbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHJcblx0XHR3cml0ZShydWxlOk9wY29kZVJ1bGUsIGFkZHJlc3M6bnVtYmVyLCB2YWx1ZTpudW1iZXIpe1xyXG5cdFx0XHRzd2l0Y2gocnVsZSl7XHJcblx0XHRcdFx0Y2FzZSBPcGNvZGVSdWxlLkluZGlyZWN0OEJpdDpcclxuXHRcdFx0XHRcdHRoaXMud3JpdGVCeXRlcyhhZGRyZXNzLCB2YWx1ZSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0Y2FzZSBPcGNvZGVSdWxlLkluZGlyZWN0MTZCaXQ6XHJcblx0XHRcdFx0XHR0aGlzLndyaXRlQnl0ZXMoYWRkcmVzcywgdmFsdWUgPj44LCB2YWx1ZSAmIDB4RkYpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHR0aGlzLndyaXRlSW50MzIoYWRkcmVzcywgdmFsdWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogQHBhcmFtIGxpbWl0OiB0aGUgbWF4aW11bSBudW1iZXIgb2YgYnl0ZXMgdG8gd3JpdGVcclxuXHRcdCAqIHJldHVybnMgdGhlIG51bWJlciBvZiBieXRlcyB3cml0dGVuXHJcblx0XHQgKi9cclxuXHRcdHdyaXRlQVNDSUkoYWRkcmVzczogbnVtYmVyLCB0ZXh0OiBzdHJpbmcsIGxpbWl0OiBudW1iZXIpOiBudW1iZXJ7XHJcblx0XHRcdGxldCBieXRlcyA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCBpPTA7IGk8dGV4dC5sZW5ndGggJiYgaTwgbGltaXQ7IGkrKyl7XHJcblx0XHRcdFx0bGV0IGMgPSB0ZXh0LmNoYXJDb2RlQXQoaSk7XHJcblx0XHRcdFx0aWYgKGMgPiAyNTUpe1xyXG5cdFx0XHRcdFx0YyA9IDYzOyAvLyAnPydcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ynl0ZXMucHVzaChjKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLndyaXRlQnl0ZXMoYWRkcmVzcywgLi4uYnl0ZXMpO1xyXG5cdFx0XHRyZXR1cm4gYnl0ZXMubGVuZ3RoO1xyXG5cdFx0fVxyXG5cdFxyXG5cdFx0c3RhdGljIHdyaXRlSGVhZGVyKGZpZWxkczogR2x1bHhIZWFkZXIsIG06IE1lbW9yeUFjY2Vzcywgb2Zmc2V0PTApe1xyXG5cdFx0XHRtLndyaXRlQVNDSUkob2Zmc2V0LCBmaWVsZHMubWFnaWMgfHwgJ0dsdWwnKTtcclxuXHRcdFx0bS53cml0ZUludDMyKG9mZnNldCArIEdMVUxYX0hEUi5WRVJTSU9OX09GRlNFVCwgZmllbGRzLnZlcnNpb24pO1xyXG5cdFx0XHRtLndyaXRlSW50MzIob2Zmc2V0ICsgR0xVTFhfSERSLlJBTVNUQVJUX09GRlNFVCwgZmllbGRzLnJhbVN0YXJ0KTtcclxuXHRcdFx0bS53cml0ZUludDMyKG9mZnNldCArIEdMVUxYX0hEUi5FWFRTVEFSVF9PRkZTRVQsIGZpZWxkcy5leHRTdGFydCk7XHJcblx0XHRcdG0ud3JpdGVJbnQzMihvZmZzZXQgKyBHTFVMWF9IRFIuRU5ETUVNX09GRlNFVCwgZmllbGRzLmVuZE1lbSk7XHJcblx0XHRcdG0ud3JpdGVJbnQzMihvZmZzZXQgKyBHTFVMWF9IRFIuU1RBQ0tTSVpFX09GRlNFVCwgZmllbGRzLnN0YWNrU2l6ZSk7XHJcblx0XHRcdG0ud3JpdGVJbnQzMihvZmZzZXQgKyBHTFVMWF9IRFIuU1RBUlRGVU5DX09GRlNFVCwgZmllbGRzLnN0YXJ0RnVuYyk7XHJcblx0XHRcdG0ud3JpdGVJbnQzMihvZmZzZXQgKyBHTFVMWF9IRFIuREVDT0RJTkdUQkxfT0ZGU0VULCBmaWVsZHMuZGVjb2RpbmdUYmwpO1xyXG5cdFx0XHRtLndyaXRlSW50MzIob2Zmc2V0ICsgR0xVTFhfSERSLkNIRUNLU1VNX09GRlNFVCwgZmllbGRzLmNoZWNrc3VtKTtcclxuXHRcdH1cclxuXHRcclxuXHRcclxuXHQgICAgLyoqIFJlbG9hZHMgdGhlIGdhbWUgZmlsZSwgZGlzY2FyZGluZyBhbGwgY2hhbmdlcyB0aGF0IGhhdmUgYmVlbiBtYWRlXHJcbiAgICAgICAgKiB0byBSQU0gYW5kIHJlc3RvcmluZyB0aGUgbWVtb3J5IG1hcCB0byBpdHMgb3JpZ2luYWwgc2l6ZS5cclxuXHRcdCogXHJcblx0XHQqIFVzZSB0aGUgb3B0aW9uYWwgXCJwcm90ZWN0aW9uXCIgcGFyYW1ldGVycyB0byBwcmVzZXJ2ZSBhIFJBTSByZWdpb25cclxuXHRcdCovXHJcblx0XHRyZXZlcnQocHJvdGVjdGlvblN0YXJ0PTAsIHByb3RlY3Rpb25MZW5ndGg9MCl7XHJcblx0XHRcdGxldCBwcm90ID0gdGhpcy5jb3B5UHJvdGVjdGVkUmFtKHByb3RlY3Rpb25TdGFydCwgcHJvdGVjdGlvbkxlbmd0aCk7XHJcblx0XHRcdHRoaXMubG9hZEZyb21PcmlnaW5hbCgpO1x0XHJcblx0XHRcdGlmIChwcm90KXtcclxuXHRcdFx0XHRsZXQgZCA9IFtdO1xyXG5cdFx0XHRcdGZvcihsZXQgaT0wOyBpPHByb3RlY3Rpb25MZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0XHRkLnB1c2gocHJvdC5yZWFkQnl0ZShpKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMud3JpdGVCeXRlcyhwcm90ZWN0aW9uU3RhcnQsIC4uLmQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHByaXZhdGUgY29weVByb3RlY3RlZFJhbShwcm90ZWN0aW9uU3RhcnQsIHByb3RlY3Rpb25MZW5ndGgpIDogTWVtb3J5QWNjZXNzIHtcclxuXHRcdFx0bGV0IHByb3QgOiBNZW1vcnlBY2Nlc3M9IG51bGw7XHJcblx0XHRcdGlmIChwcm90ZWN0aW9uTGVuZ3RoID4gMCl7XHJcblx0XHRcdFx0aWYgKHByb3RlY3Rpb25TdGFydCArIHByb3RlY3Rpb25MZW5ndGggPiB0aGlzLmdldEVuZE1lbSgpKXtcclxuXHRcdFx0XHRcdHByb3RlY3Rpb25MZW5ndGggPSB0aGlzLmdldEVuZE1lbSgpIC0gcHJvdGVjdGlvblN0YXJ0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBjYW4gb25seSBwcm90ZWN0IFJBTVxyXG5cdFx0XHRcdGxldCBzdGFydCA9IHByb3RlY3Rpb25TdGFydCAtIHRoaXMucmFtc3RhcnQ7XHJcblx0XHRcdFx0aWYgKHN0YXJ0IDwgMCl7XHJcblx0XHRcdFx0XHRwcm90ZWN0aW9uTGVuZ3RoICs9IHN0YXJ0O1xyXG5cdFx0XHRcdFx0c3RhcnQgPSAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRwcm90ID0gdGhpcy5tZW1vcnkuY29weShzdGFydCArIHRoaXMucmFtc3RhcnQsIHByb3RlY3Rpb25MZW5ndGgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBwcm90O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXN0b3JlRnJvbVF1ZXR6YWwocXVldHphbDogUXVldHphbCwgcHJvdGVjdGlvblN0YXJ0PTAsIHByb3RlY3Rpb25MZW5ndGg9MCl7XHJcblx0XHRcdC8vIFRPRE86IHN1cHBvcnQgY29tcHJlc3NlZCBSQU1cclxuXHRcdFx0bGV0IG5ld1JhbSA9IHF1ZXR6YWwuZ2V0Q2h1bmsoJ1VNZW0nKTtcclxuXHRcdFx0aWYgKG5ld1JhbSl7XHJcblx0XHRcdFx0bGV0IHByb3QgPSB0aGlzLmNvcHlQcm90ZWN0ZWRSYW0ocHJvdGVjdGlvblN0YXJ0LCBwcm90ZWN0aW9uTGVuZ3RoKTtcclxuXHRcdFx0XHJcblx0XHRcdFx0bGV0IHIgPSBuZXcgTWVtb3J5QWNjZXNzKDApO1xyXG5cdFx0XHRcdHIuYnVmZmVyPSBuZXcgVWludDhBcnJheShuZXdSYW0pO1xyXG5cdFx0XHRcdGxldCBsZW5ndGggPSByLnJlYWRJbnQzMigwKTtcclxuXHRcdFx0XHR0aGlzLnNldEVuZE1lbShsZW5ndGggKyB0aGlzLnJhbXN0YXJ0KTtcclxuXHRcdFx0XHRsZXQgaT00O1xyXG5cdFx0XHRcdGxldCBqPXRoaXMucmFtc3RhcnQ7XHJcblx0XHRcdFx0d2hpbGUoaTxuZXdSYW0uYnl0ZUxlbmd0aCl7XHJcblx0XHRcdFx0XHR0aGlzLm1lbW9yeS53cml0ZUJ5dGUoaisrLCByLnJlYWRCeXRlKGkrKykpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAocHJvdCl7XHJcblx0XHRcdFx0XHRsZXQgZCA9IFtdO1xyXG5cdFx0XHRcdFx0Zm9yKGxldCBpPTA7IGk8cHJvdGVjdGlvbkxlbmd0aDsgaSsrKXtcclxuXHRcdFx0XHRcdFx0ZC5wdXNoKHByb3QucmVhZEJ5dGUoaSkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGhpcy53cml0ZUJ5dGVzKHByb3RlY3Rpb25TdGFydCwgLi4uZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIENNZW0vVU1lbSBibG9ja3NcIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdH1cclxuXHRcclxufSIsIi8vIHNsaWdodGx5IGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vYmVhdGdhbW1pdC9iYXNlNjQtanNcclxuXHJcbm1vZHVsZSBCYXNlNjQge1xyXG5cclxuICB2YXIgbG9va3VwID0gW11cclxuICB2YXIgcmV2TG9va3VwID0gW11cclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIHZhciBjb2RlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nXHJcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY29kZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICBsb29rdXBbaV0gPSBjb2RlW2ldXHJcbiAgICAgIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaVxyXG4gICAgfVxyXG5cclxuICAgIHJldkxvb2t1cFsnLScuY2hhckNvZGVBdCgwKV0gPSA2MlxyXG4gICAgcmV2TG9va3VwWydfJy5jaGFyQ29kZUF0KDApXSA9IDYzXHJcbiAgfVxyXG5cclxuICBpbml0KClcclxuXHJcbiAgZXhwb3J0IGZ1bmN0aW9uIHRvQnl0ZUFycmF5KGI2NCk6IFVpbnQ4QXJyYXkge1xyXG4gICAgdmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcclxuICAgIHZhciBsZW4gPSBiNjQubGVuZ3RoXHJcblxyXG4gICAgaWYgKGxlbiAlIDQgPiAwKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcclxuICAgIC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcclxuICAgIC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxyXG4gICAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXHJcbiAgICAvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXHJcbiAgICBwbGFjZUhvbGRlcnMgPSBiNjRbbGVuIC0gMl0gPT09ICc9JyA/IDIgOiBiNjRbbGVuIC0gMV0gPT09ICc9JyA/IDEgOiAwXHJcblxyXG4gICAgLy8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXHJcbiAgICBhcnIgPSBuZXcgVWludDhBcnJheShsZW4gKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcclxuXHJcbiAgICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXHJcbiAgICBsID0gcGxhY2VIb2xkZXJzID4gMCA/IGxlbiAtIDQgOiBsZW5cclxuXHJcbiAgICB2YXIgTCA9IDBcclxuXHJcbiAgICBmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XHJcbiAgICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCAxMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfCByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxyXG4gICAgICBhcnJbTCsrXSA9ICh0bXAgPj4gMTYpICYgMHhGRlxyXG4gICAgICBhcnJbTCsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXHJcbiAgICAgIGFycltMKytdID0gdG1wICYgMHhGRlxyXG4gICAgfVxyXG5cclxuICAgIGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcclxuICAgICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcclxuICAgICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXHJcbiAgICB9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xyXG4gICAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxMCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcclxuICAgICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxyXG4gICAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXJyXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQobnVtKSB7XHJcbiAgICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICsgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICsgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gKyBsb29rdXBbbnVtICYgMHgzRl1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGVuY29kZUNodW5rKHVpbnQ4LCBzdGFydCwgZW5kKSB7XHJcbiAgICB2YXIgdG1wXHJcbiAgICB2YXIgb3V0cHV0ID0gW11cclxuICAgIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XHJcbiAgICAgIHRtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcclxuICAgICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0cHV0LmpvaW4oJycpXHJcbiAgfVxyXG5cclxuICBleHBvcnQgZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSh1aW50OCkge1xyXG4gICAgdmFyIHRtcFxyXG4gICAgdmFyIGxlbiA9IHVpbnQ4Lmxlbmd0aFxyXG4gICAgdmFyIGV4dHJhQnl0ZXMgPSBsZW4gJSAzIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXHJcbiAgICB2YXIgb3V0cHV0ID0gJydcclxuICAgIHZhciBwYXJ0cyA9IFtdXHJcbiAgICB2YXIgbWF4Q2h1bmtMZW5ndGggPSAxNjM4MyAvLyBtdXN0IGJlIG11bHRpcGxlIG9mIDNcclxuXHJcbiAgICAvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXHJcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XHJcbiAgICAgIHBhcnRzLnB1c2goZW5jb2RlQ2h1bmsodWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKSkpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xyXG4gICAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcclxuICAgICAgdG1wID0gdWludDhbbGVuIC0gMV1cclxuICAgICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMl1cclxuICAgICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl1cclxuICAgICAgb3V0cHV0ICs9ICc9PSdcclxuICAgIH0gZWxzZSBpZiAoZXh0cmFCeXRlcyA9PT0gMikge1xyXG4gICAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyAodWludDhbbGVuIC0gMV0pXHJcbiAgICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDEwXVxyXG4gICAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPj4gNCkgJiAweDNGXVxyXG4gICAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXVxyXG4gICAgICBvdXRwdXQgKz0gJz0nXHJcbiAgICB9XHJcblxyXG4gICAgcGFydHMucHVzaChvdXRwdXQpXHJcblxyXG4gICAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXHJcbiAgfVxyXG5cclxufVxyXG4iLCIvLyBXcml0dGVuIGluIDIwMTUgYnkgVGhpbG8gUGxhbnogXHJcbi8vIFRvIHRoZSBleHRlbnQgcG9zc2libGUgdW5kZXIgbGF3LCBJIGhhdmUgZGVkaWNhdGVkIGFsbCBjb3B5cmlnaHQgYW5kIHJlbGF0ZWQgYW5kIG5laWdoYm9yaW5nIHJpZ2h0cyBcclxuLy8gdG8gdGhpcyBzb2Z0d2FyZSB0byB0aGUgcHVibGljIGRvbWFpbiB3b3JsZHdpZGUuIFRoaXMgc29mdHdhcmUgaXMgZGlzdHJpYnV0ZWQgd2l0aG91dCBhbnkgd2FycmFudHkuIFxyXG4vLyBodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9wdWJsaWNkb21haW4vemVyby8xLjAvXHJcblxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPSdNZW1vcnlBY2Nlc3MudHMnIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9iNjQudHNcIiAvPlxyXG5cclxuXHJcbm1vZHVsZSBGeXJlVk0ge1xyXG5cdFxyXG5cdFxyXG5cdFxyXG5cdC8vLyBJbXBsZW1lbnRzIHRoZSBRdWV0emFsIHNhdmVkLWdhbWUgZmlsZSBzcGVjaWZpY2F0aW9uIGJ5IGhvbGRpbmcgYSBsaXN0IG9mXHJcbiAgICAvLy8gdHlwZWQgZGF0YSBjaHVua3Mgd2hpY2ggY2FuIGJlIHJlYWQgZnJvbSBvciB3cml0dGVuIHRvIHN0cmVhbXMuXHJcbiAgICAvLy8gaHR0cDovL3d3dy5pZmFyY2hpdmUub3JnL2lmLWFyY2hpdmUvaW5mb2NvbS9pbnRlcnByZXRlcnMvc3BlY2lmaWNhdGlvbi9zYXZlZmlsZV8xNC50eHRcclxuXHRleHBvcnQgY2xhc3MgUXVldHphbCB7XHJcblx0XHRcclxuXHRcdHByaXZhdGUgY2h1bmtzIDogeyBbICBuYW1lIDogc3RyaW5nIF0gOiBVaW50OEFycmF5IH0gPSB7fTtcclxuXHRcdFxyXG5cdFx0c2V0Q2h1bmsobmFtZTogc3RyaW5nLCB2YWx1ZTogVWludDhBcnJheSl7XHJcblx0XHRcdGlmIChuYW1lLmxlbmd0aCAhPSA0KXtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgY2h1bmsgaWQgJHtuYW1lfSwgbXVzdCBiZSBmb3VyIEFTQ0lJIGNoYXJzYCk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5jaHVua3NbbmFtZV0gPSB2YWx1ZTsgXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGdldENodW5rKG5hbWU6IHN0cmluZyk6IFVpbnQ4QXJyYXkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5jaHVua3NbbmFtZV07XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGdldElGaGRDaHVuaygpOiBVaW50OEFycmF5IHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZ2V0Q2h1bmsoJ0lGaGQnKVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRcclxuXHRcdHNlcmlhbGl6ZSgpIDogVWludDhBcnJheXtcclxuXHRcdFx0Ly8gZGV0ZXJtaW5lIHRoZSBidWZmZXIgc2l6ZVxyXG5cdFx0XHRsZXQgc2l6ZSA9IDEyOyAgLy8gdGhyZWUgaW50MzIgaGVhZGVyc1xyXG5cdFx0XHRsZXQgeyBjaHVua3MgfSA9IHRoaXM7XHJcblx0XHRcdGZvciAobGV0IG5hbWUgaW4gY2h1bmtzKSB7XHJcblx0XHRcdFx0c2l6ZSArPSA0OyAgLy8gdGhlIGtleVxyXG5cdFx0XHRcdHNpemUgKz0gNDsgIC8vIHRoZSB2YWx1ZSBsZW5ndGhcclxuXHRcdFx0XHRzaXplICs9IGNodW5rc1tuYW1lXS5ieXRlTGVuZ3RoOyBcdFxyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBmaWxlTGVuZ3RoID0gc2l6ZSAtIDg7XHJcblx0XHRcdGlmIChzaXplICUgMil7XHJcblx0XHRcdFx0c2l6ZSArKzsgIC8vIHBhZGRpbmdcdFx0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgbSA9IG5ldyBNZW1vcnlBY2Nlc3Moc2l6ZSk7XHJcblx0XHRcdG0ud3JpdGVCeXRlKHNpemUtMSwgMCk7XHJcblx0XHRcdG0ud3JpdGVBU0NJSSgwLCAnRk9STScpOyAvLyBJRkYgdGFnXHJcblx0XHRcdG0ud3JpdGVJbnQzMig0LCBmaWxlTGVuZ3RoKTsgXHJcblx0XHRcdG0ud3JpdGVBU0NJSSg4LCAnSUZaUycpOyAvLyBGT1JNIHN1Yi1JRCBmb3IgUXVldHphbFxyXG5cdFx0XHRsZXQgcG9zID0gMTI7XHJcblx0XHRcdGZvciAobGV0IG5hbWUgaW4gY2h1bmtzKSB7XHJcblx0XHRcdFx0bS53cml0ZUFTQ0lJKHBvcywgbmFtZSk7XHJcblx0XHRcdFx0bGV0IHZhbHVlID0gY2h1bmtzW25hbWVdO1xyXG5cdFx0XHRcdGxldCBsZW4gPSAgdmFsdWUuYnl0ZUxlbmd0aDtcclxuXHRcdFx0XHRtLndyaXRlSW50MzIocG9zKzQsIGxlbik7XHJcblx0XHRcdFx0bS5idWZmZXIuc2V0KG5ldyBVaW50OEFycmF5KHZhbHVlKSwgcG9zKzgpO1xyXG5cdFx0XHRcdHBvcyArPSA4ICsgbGVuO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gbS5idWZmZXI7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHN0YXRpYyBsb2FkKGJ1ZmZlcjogVWludDhBcnJheSk6IFF1ZXR6YWwge1xyXG5cdFx0XHRsZXQgcSA9IG5ldyBRdWV0emFsKCk7XHJcblx0XHRcdGxldCBtID0gbmV3IE1lbW9yeUFjY2VzcygwKTtcclxuXHRcdFx0bS5idWZmZXIgPSBidWZmZXI7XHJcblx0XHRcdGxldCB0eXBlID0gbS5yZWFkQVNDSUkoMCwgNCk7XHJcblx0XHRcdGlmICh0eXBlICE9PSAnRk9STScgJiYgdHlwZSAhPT0gJ0xJU1QnICYmIHR5cGUgIT09ICdDQVRfJyl7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIElGRiB0eXBlICR7dHlwZX1gKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgbGVuZ3RoID0gbS5yZWFkSW50MzIoNCk7XHJcblx0XHRcdGlmIChidWZmZXIuYnl0ZUxlbmd0aCA8IDggKyBsZW5ndGgpe1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlF1ZXR6YWwgZmlsZSBpcyB0b28gc2hvcnQgZm9yICR7bGVuZ3RofSBieXRlc1wiKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0eXBlID0gbS5yZWFkQVNDSUkoOCwgNCk7XHJcblx0XHRcdGlmICh0eXBlICE9PSAnSUZaUycpe1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgaW52YWxpZCBJRkYgc3ViLXR5cGUgJHt0eXBlfS4gTm90IGEgUXVldHphbCBmaWxlYCk7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHBvcyA9IDEyO1xyXG5cdFx0XHRsZXQgbGltaXQgPSA4ICsgbGVuZ3RoO1xyXG5cdFx0XHR3aGlsZSAocG9zIDwgbGltaXQpe1xyXG5cdFx0XHRcdGxldCBuYW1lID0gbS5yZWFkQVNDSUkocG9zLCA0KTtcclxuXHRcdFx0XHRsZW5ndGggPSBtLnJlYWRJbnQzMihwb3MrNCk7XHJcblx0XHRcdFx0bGV0IHZhbHVlID0gbS5idWZmZXIuc3ViYXJyYXkocG9zKzgsIHBvcys4K2xlbmd0aCk7XHJcblx0XHRcdFx0cS5zZXRDaHVuayhuYW1lLCB2YWx1ZSk7XHJcblx0XHRcdFx0cG9zICs9IDggKyBsZW5ndGg7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHE7XHJcblx0XHR9XHJcblx0XHJcblx0XHQvKipcclxuXHRcdCAqIGNvbnZlbmllbmNlIG1ldGhvZCB0byBlbmNvZGUgYSBRdWV0emFsIGZpbGUgYXMgQmFzZTY0XHJcblx0XHQgKi9cclxuXHRcdGJhc2U2NEVuY29kZSgpe1xyXG5cdFx0XHRyZXR1cm4gQmFzZTY0LmZyb21CeXRlQXJyYXkobmV3IFVpbnQ4QXJyYXkodGhpcy5zZXJpYWxpemUoKSkpXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogY29udmVuaWVuY2UgbWV0aG9kIHRvIGRlY29kZSBhIFF1ZXR6YWwgZmlsZSBmcm9tIEJhc2U2NFxyXG5cdFx0ICovXHJcblx0XHRzdGF0aWMgYmFzZTY0RGVjb2RlKGJhc2U2NDogc3RyaW5nKSA6IFF1ZXR6YWwge1xyXG5cdFx0XHRyZXR1cm4gUXVldHphbC5sb2FkKEJhc2U2NC50b0J5dGVBcnJheShiYXNlNjQpKVxyXG5cdFx0fVxyXG5cdFxyXG5cdH1cclxuXHRcclxufSIsIi8vIFdyaXR0ZW4gZnJvbSAyMDE1IHRvIDIwMTYgYnkgVGhpbG8gUGxhbnogYW5kIEFuZHJldyBQbG90a2luXHJcbi8vIFRvIHRoZSBleHRlbnQgcG9zc2libGUgdW5kZXIgbGF3LCBJIGhhdmUgZGVkaWNhdGVkIGFsbCBjb3B5cmlnaHQgYW5kIHJlbGF0ZWQgYW5kIG5laWdoYm9yaW5nIHJpZ2h0cyBcclxuLy8gdG8gdGhpcyBzb2Z0d2FyZSB0byB0aGUgcHVibGljIGRvbWFpbiB3b3JsZHdpZGUuIFRoaXMgc29mdHdhcmUgaXMgZGlzdHJpYnV0ZWQgd2l0aG91dCBhbnkgd2FycmFudHkuIFxyXG4vLyBodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9wdWJsaWNkb21haW4vemVyby8xLjAvXHJcblxyXG5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD0nT3Bjb2Rlcy50cycgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD0nT3V0cHV0LnRzJyAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPSdVbHhJbWFnZS50cycgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD0nUXVldHphbC50cycgLz5cclxuXHJcbm1vZHVsZSBGeXJlVk0ge1xyXG5cdFxyXG5cdGV4cG9ydCBjb25zdCBlbnVtIFZlcnNpb25zIHtcclxuXHRcdHRlcnAgPSAxLFxyXG5cdFx0Z2x1bHggPSAweDAwMDMwMTAyXHJcblx0fVxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIERlc2NyaWJlcyB0aGUgdHlwZSBvZiBHbGsgc3VwcG9ydCBvZmZlcmVkIGJ5IHRoZSBpbnRlcnByZXRlci5cclxuXHQgKi9cclxuXHRleHBvcnQgY29uc3QgZW51bSBHbGtNb2RlIHtcclxuXHRcdC8vIE5vIEdsayBzdXBwb3J0LlxyXG5cdFx0Tm9uZSxcclxuXHRcdC8vIEEgbWluaW1hbCBHbGsgaW1wbGVtZW50YXRpb24sIHdpdGggSS9PIGZ1bmN0aW9ucyBtYXBwZWQgdG8gdGhlIGNoYW5uZWwgc3lzdGVtLlxyXG4gICAgICAgIFdyYXBwZXJcclxuXHR9XHJcblx0XHJcblx0XHJcblx0LyoqXHJcblx0ICogQSBkZWxlZ2F0ZSB0aGF0IGhhbmRsZXMgdGhlIExpbmVXYW50ZWQgZXZlbnRcclxuXHQgKi9cclxuXHQgZXhwb3J0IGludGVyZmFjZSBMaW5lV2FudGVkRXZlbnRIYW5kbGVyIHtcclxuXHRcdCAoY2FsbGJhY2s6IExpbmVSZWFkeUNhbGxiYWNrKSA6IHZvaWRcclxuXHQgfVxyXG5cdFxyXG5cdCBleHBvcnQgaW50ZXJmYWNlIExpbmVSZWFkeUNhbGxiYWNrIHtcclxuXHRcdCAobGluZTogc3RyaW5nKSA6IHZvaWRcclxuXHQgfVxyXG5cdCBcclxuXHQgLyoqXHJcblx0ICogQSBkZWxlZ2F0ZSB0aGF0IGhhbmRsZXMgdGhlIEtleVdhbnRlZCBldmVudFxyXG5cdCAqXHJcblx0ICogQWxzbyB1c2VzIExpbmVSZWFkeUNhbGxiYWNrLiBPbmx5IHRoZSBmaXJzdCBjaGFyYWN0ZXJcclxuXHQgKiB3aWxsIGJlIHVzZWQuXHJcblx0ICovXHJcblx0IGV4cG9ydCBpbnRlcmZhY2UgS2V5V2FudGVkRXZlbnRIYW5kbGVyIHtcclxuXHRcdCAoY2FsbGJhY2s6IExpbmVSZWFkeUNhbGxiYWNrKSA6IHZvaWRcclxuXHQgfVxyXG5cdFxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIEEgZGVsZWdhdGUgdGhhdCBoYW5kbGVzIHRoZSBPdXRwdXRSZWFkeSBldmVudFxyXG5cdCAqL1xyXG5cdFxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgT3V0cHV0UmVhZHlFdmVudEhhbmRsZXJ7XHJcblx0XHQocGFja2FnZTogQ2hhbm5lbERhdGEpIDogdm9pZFxyXG5cdH1cclxuXHRcdFxyXG5cdC8vIEEgZGVsZWdhdGUgdGhhdCByZWNlaXZlcyBhIFF1ZXR6YWwgd2hlbiB0aGUgdXNlclxyXG5cdC8vIHJlcXVlc3RzIHRvIHNhdmUgdGhlIGdhbWVcclxuXHRleHBvcnQgaW50ZXJmYWNlIFNhdmVHYW1lRXZlbnRIYW5kbGVyIHtcclxuXHRcdChxdWV0emFsOiBRdWV0emFsLCBjYWxsYmFjazogU2F2ZWRHYW1lQ2FsbGJhY2spIDogdm9pZFxyXG5cdH1cclxuXHRleHBvcnQgaW50ZXJmYWNlIFNhdmVkR2FtZUNhbGxiYWNrIHtcclxuXHRcdChzdWNjZXNzOiBib29sZWFuKTtcclxuXHR9XHJcblx0XHJcblx0ZXhwb3J0IGludGVyZmFjZSBMb2FkR2FtZUV2ZW50SGFuZGxlciB7XHJcblx0XHQoY2FsbGJhY2s6IFF1ZXR6YWxSZWFkeUNhbGxiYWNrKSA6IHZvaWRcclxuXHR9XHJcblx0ZXhwb3J0IGludGVyZmFjZSBRdWV0emFsUmVhZHlDYWxsYmFjayB7XHJcblx0XHQocXVldHphbDogUXVldHphbCk7XHJcblx0fVxyXG4gICAgLyoqIFxyXG5cdCAqICBEZXNjcmliZXMgdGhlIHRhc2sgdGhhdCB0aGUgaW50ZXJwcmV0ZXIgaXMgY3VycmVudGx5IHBlcmZvcm1pbmcuXHJcbiAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGVudW0gRXhlY3V0aW9uTW9kZVxyXG4gICAge1xyXG4gICAgICAgIC8vLyBXZSBhcmUgcnVubmluZyBmdW5jdGlvbiBjb2RlLiBQQyBwb2ludHMgdG8gdGhlIG5leHQgaW5zdHJ1Y3Rpb24uXHJcbiAgICAgICAgQ29kZSxcclxuICAgICAgICAvLy8gV2UgYXJlIHByaW50aW5nIGEgbnVsbC10ZXJtaW5hdGVkIHN0cmluZyAoRTApLiBQQyBwb2ludHMgdG8gdGhlXHJcbiAgICAgICAgLy8vIG5leHQgY2hhcmFjdGVyLlxyXG4gICAgICAgIENTdHJpbmcsXHJcbiAgICAgICAgLy8vIFdlIGFyZSBwcmludGluZyBhIGNvbXByZXNzZWQgc3RyaW5nIChFMSkuIFBDIHBvaW50cyB0byB0aGUgbmV4dFxyXG4gICAgICAgIC8vLyBjb21wcmVzc2VkIGJ5dGUsIGFuZCBwcmludGluZ0RpZ2l0IGlzIHRoZSBiaXQgcG9zaXRpb24gKDAtNykuXHJcbiAgICAgICAgQ29tcHJlc3NlZFN0cmluZyxcclxuICAgICAgICAvLy8gV2UgYXJlIHByaW50aW5nIGEgVW5pY29kZSBzdHJpbmcgKEUyKS4gUEMgcG9pbnRzIHRvIHRoZSBuZXh0XHJcbiAgICAgICAgLy8vIGNoYXJhY3Rlci5cclxuICAgICAgICBVbmljb2RlU3RyaW5nLFxyXG4gICAgICAgIC8vLyBXZSBhcmUgcHJpbnRpbmcgYSBkZWNpbWFsIG51bWJlci4gUEMgY29udGFpbnMgdGhlIG51bWJlciwgYW5kXHJcbiAgICAgICAgLy8vIHByaW50aW5nRGlnaXQgaXMgdGhlIG5leHQgZGlnaXQsIHN0YXJ0aW5nIGF0IDAgKGZvciB0aGUgZmlyc3RcclxuICAgICAgICAvLy8gZGlnaXQgb3IgbWludXMgc2lnbikuXHJcbiAgICAgICAgTnVtYmVyLFxyXG4gICAgICAgIC8vLyBXZSBhcmUgcmV0dXJuaW5nIGNvbnRyb2wgdG8gPHNlZSBjcmVmPVwiRW5naW5lLk5lc3RlZENhbGxcIi8+XHJcbiAgICAgICAgLy8vIGFmdGVyIGVuZ2luZSBjb2RlIGhhcyBjYWxsZWQgYSBHbHVseCBmdW5jdGlvbi5cclxuICAgICAgICBSZXR1cm4sXHJcbiAgICB9XHJcblx0XHJcblx0XHJcblx0ZXhwb3J0IGNvbnN0IGVudW0gTG9hZE9wZXJhbmRUeXBlIHtcclxuXHRcdHplcm8gPSAwLFxyXG5cdFx0Ynl0ZSA9IDEsXHJcblx0XHRpbnQxNiA9IDIsXHJcblx0XHRpbnQzMiA9IDMsXHJcblx0XHRwdHJfOCA9IDUsXHJcblx0XHRwdHJfMTYgPSA2LFxyXG5cdFx0cHRyXzMyID0gNyxcclxuXHRcdHN0YWNrID0gOCxcclxuXHRcdGxvY2FsXzggPSA5LFxyXG5cdFx0bG9jYWxfMTYgPSAxMCxcclxuXHRcdGxvY2FsXzMyID0gMTEsXHJcblx0XHRyYW1fOCA9IDEzLFxyXG5cdFx0cmFtXzE2ID0gMTQsXHJcblx0XHRyYW1fMzIgPSAxNVxyXG5cdH1cclxuXHRcclxuXHRleHBvcnQgY29uc3QgZW51bSBTdG9yZU9wZXJhbmRUeXBlIHtcclxuXHRcdGRpc2NhcmQgPSAwLFxyXG5cdFx0cHRyXzggPSA1LFxyXG5cdFx0cHRyXzE2ID0gNixcclxuXHRcdHB0cl8zMiA9IDcsXHJcblx0XHRzdGFjayA9IDgsXHJcblx0XHRsb2NhbF84ID0gOSxcclxuXHRcdGxvY2FsXzE2ID0gMTAsXHJcblx0XHRsb2NhbF8zMiA9IDExLFxyXG5cdFx0cmFtXzggPSAxMyxcclxuXHRcdHJhbV8xNiA9IDE0LFxyXG5cdFx0cmFtXzMyID0gMTVcclxuXHR9XHJcblx0XHJcblx0ZXhwb3J0IGNvbnN0IGVudW0gQ2FsbFR5cGUge1xyXG5cdFx0c3RhY2sgPSAweEMwLFxyXG5cdFx0bG9jYWxTdG9yYWdlID0gMHhDMVxyXG5cdH1cclxuXHRcclxuXHQvLyBDYWxsIHN0dWJcclxuXHRleHBvcnQgY29uc3QgZW51bSBHTFVMWF9TVFVCIHtcclxuXHRcdC8vIERlc3RUeXBlIHZhbHVlcyBmb3IgZnVuY3Rpb24gY2FsbHNcclxuXHRcdFNUT1JFX05VTEwgPSAwLFxyXG5cdFx0U1RPUkVfTUVNID0gMSxcclxuXHRcdFNUT1JFX0xPQ0FMID0gMixcclxuXHRcdFNUT1JFX1NUQUNLID0gMyxcclxuXHRcdC8vIERlc3RUeXBlIHZhbHVlcyBmb3Igc3RyaW5nIHByaW50aW5nXHJcblx0XHRSRVNVTUVfSFVGRlNUUiA9IDEwLFxyXG5cdFx0UkVTVU1FX0ZVTkMgPSAxMSxcclxuXHRcdFJFU1VNRV9OVU1CRVIgPSAxMixcclxuXHRcdFJFU1VNRV9DU1RSID0gMTMsXHJcblx0XHRSRVNVTUVfVU5JU1RSID0gMTRcclxuXHR9XHJcblx0XHJcblx0ZXhwb3J0IGNvbnN0IGVudW0gT3Bjb2RlUnVsZSB7XHJcblx0XHQvLyBObyBzcGVjaWFsIHRyZWF0bWVudFxyXG5cdFx0Tm9uZSxcclxuXHRcdC8vIEluZGlyZWN0IG9wZXJhbmRzIHdvcmsgd2l0aCBzaW5nbGUgYnl0ZXNcclxuXHRcdEluZGlyZWN0OEJpdCxcclxuXHRcdC8vIEluZGlyZWN0IG9wZXJhbmRzIHdvcmsgd2l0aCAxNi1iaXQgd29yZHNcclxuXHRcdEluZGlyZWN0MTZCaXQsXHJcblx0XHQvLyBIYXMgYW4gYWRkaXRpb25hbCBvcGVyYW5kIHRoYXQgcmVzZW1ibGVzIGEgc3RvcmUsIGJ1dCB3aGljaFxyXG4gICAgICAgIC8vIGlzIG5vdCBhY3R1YWxseSBwYXNzZWQgb3V0IGJ5IHRoZSBvcGNvZGUgaGFuZGxlci4gSW5zdGVhZCwgdGhlXHJcbiAgICAgICAgLy8gaGFuZGxlciByZWNlaXZlcyB0d28gdmFsdWVzLCBEZXN0VHlwZSBhbmQgRGVzdEFkZHIsIHdoaWNoIG1heVxyXG4gICAgICAgIC8vIGJlIHdyaXR0ZW4gaW50byBhIGNhbGwgc3R1YiBzbyB0aGUgcmVzdWx0IGNhbiBiZSBzdG9yZWQgbGF0ZXIuXHJcblx0XHREZWxheWVkU3RvcmUsXHJcblx0XHQvLyBTcGVjaWFsIGNhc2UgZm9yIG9wX2NhdGNoLiBUaGlzIG9wY29kZSBoYXMgYSBsb2FkIG9wZXJhbmQgXHJcbiAgICAgICAgLy8gKHRoZSBicmFuY2ggb2Zmc2V0KSBhbmQgYSBkZWxheWVkIHN0b3JlLCBidXQgdGhlIHN0b3JlIGNvbWVzIGZpcnN0LlxyXG4gICAgICAgIC8vIGFyZ3NbMF0gYW5kIFsxXSBhcmUgdGhlIGRlbGF5ZWQgc3RvcmUsIGFuZCBhcmdzWzJdIGlzIHRoZSBsb2FkLlxyXG5cdFx0Q2F0Y2hcclxuXHR9XHJcblx0XHRcclxuXHRjbGFzcyBDYWxsU3R1YiB7XHJcblx0XHQgICAgLy8vIFRoZSB0eXBlIG9mIHN0b3JhZ2UgbG9jYXRpb24gKGZvciBmdW5jdGlvbiBjYWxscykgb3IgdGhlXHJcbiAgICAgICAgICAgIC8vLyBwcmV2aW91cyB0YXNrIChmb3Igc3RyaW5nIHByaW50aW5nKS5cclxuICAgICAgICAgICAgZGVzdFR5cGUgOiBudW1iZXJcclxuICAgICAgICAgICAgLy8vIFRoZSBzdG9yYWdlIGFkZHJlc3MgKGZvciBmdW5jdGlvbiBjYWxscykgb3IgdGhlIGRpZ2l0XHJcbiAgICAgICAgICAgIC8vLyBiZWluZyBleGFtaW5lZCAoZm9yIHN0cmluZyBwcmludGluZykuXHJcbiAgICAgICAgICAgIGRlc3RBZGRyIDogbnVtYmVyXHJcbiAgICAgICAgICAgIC8vLyBUaGUgYWRkcmVzcyBvZiB0aGUgb3Bjb2RlIG9yIGNoYXJhY3RlciBhdCB3aGljaCB0byByZXN1bWUuXHJcbiAgICAgICAgICAgIFBDIDogbnVtYmVyXHJcbiAgICAgICAgICAgIC8vLyBUaGUgc3RhY2sgZnJhbWUgaW4gd2hpY2ggdGhlIGZ1bmN0aW9uIGNhbGwgb3Igc3RyaW5nIHByaW50aW5nXHJcbiAgICAgICAgICAgIC8vLyB3YXMgcGVyZm9ybWVkLlxyXG4gICAgICAgICAgICBmcmFtZVB0ciA6IG51bWJlclxyXG5cdH1cclxuXHRcclxuXHQvLyBjb2VyY2UgdWludDMyIG51bWJlciBpbnRvICAoc2lnbmVkISkgaW50MzIgcmFuZ2VcclxuXHRmdW5jdGlvbiBpbnQzMih4OiBudW1iZXIpIDpudW1iZXJ7XHJcblx0XHRpZiAoeCA+PSAweDgwMDAwMDAwKXtcclxuXHRcdFx0eCA9IC0gKDB4RkZGRkZGRkYgLSB4ICsgMSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4geDtcclxuXHR9XHJcblx0ZnVuY3Rpb24gaW50MTYoeDogbnVtYmVyKSA6bnVtYmVye1xyXG5cdFx0aWYgKHggPj0gMHg4MDAwKXtcclxuXHRcdFx0eCA9IC0gKDB4RkZGRiAtIHggKyAxKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB4O1xyXG5cdH1cclxuXHRmdW5jdGlvbiBpbnQ4KHg6IG51bWJlcikgOm51bWJlcntcclxuXHRcdGlmICh4ID49IDB4ODApe1xyXG5cdFx0XHR4ID0gLSAoMHhGRiAtIHggKyAxKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB4O1xyXG5cdH1cclxuXHRmdW5jdGlvbiB1aW50OCh4OiBudW1iZXIpIDpudW1iZXJ7XHJcblx0XHRpZiAoeCA8IDApe1xyXG5cdFx0XHR4ID0gMjU1ICsgeCArIDE7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4geCAlIDI1NjtcclxuXHR9XHJcblx0ZnVuY3Rpb24gdG9BU0NJSSh4Om51bWJlcil7XHJcblx0XHRyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShcclxuXHRcdFx0eCA+PiAyNCxcclxuXHRcdFx0KHggPj4gMTYpICYgMHhGRixcclxuXHRcdFx0KHggPj4gOCkgJiAweEZGLFxyXG5cdFx0XHR4ICYgMHhGRik7XHJcblx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcclxuXHRleHBvcnQgY2xhc3MgRW5naW5le1xyXG5cdFx0XHJcblx0XHRpbWFnZTogVWx4SW1hZ2U7XHJcblx0XHRwcml2YXRlIHN0YWNrOiBNZW1vcnlBY2Nlc3M7XHJcblx0XHRwcml2YXRlIGRlY29kaW5nVGFibGU6IG51bWJlcjtcclxuXHRcdHByaXZhdGUgU1A6IG51bWJlcjtcclxuXHRcdHByaXZhdGUgRlA6IG51bWJlcjtcclxuXHRcdHByaXZhdGUgUEM6IG51bWJlcjtcclxuXHRcdHByaXZhdGUgZnJhbWVMZW46IG51bWJlcjtcclxuXHRcdHByaXZhdGUgbG9jYWxzUG9zOiBudW1iZXI7XHJcblx0XHRwcml2YXRlIGV4ZWNNb2RlOiBFeGVjdXRpb25Nb2RlO1xyXG5cdFx0cHJpdmF0ZSBvcGNvZGVzOiBPcGNvZGVbXTtcclxuXHRcdHByaXZhdGUgcnVubmluZzogYm9vbGVhbjtcclxuXHRcdHByaXZhdGUgb3V0cHV0U3lzdGVtOiBJT1N5c3RlbTtcclxuXHRcdHByaXZhdGUgZmlsdGVyQWRkcmVzczogbnVtYmVyO1xyXG5cdFx0cHJpdmF0ZSBvdXRwdXRCdWZmZXIgPSBuZXcgT3V0cHV0QnVmZmVyKCk7XHJcblx0XHRwcml2YXRlIGhlYXA6IEhlYXBBbGxvY2F0b3I7XHJcblx0XHQvLyBjb3VudGVycyB0byBtZWFzdXJlIHBlcmZvcm1hbmNlXHJcblx0XHRwcml2YXRlIGN5Y2xlID0gMDtcdFxyXG5cdFx0cHJpdmF0ZSBzdGFydFRpbWUgPSAwO1xyXG5cdFx0XHJcblx0XHRwcml2YXRlIHByaW50aW5nRGlnaXQgPSAwOyAvLyBiaXQgbnVtYmVyIGZvciBjb21wcmVzc2VkIHN0cmluZ3MsIGRpZ2l0IGZvciBudW1iZXJzXHJcbiAgICAgICAgcHJpdmF0ZSBwcm90ZWN0aW9uU3RhcnQgPSAwO1xyXG5cdFx0cHJpdmF0ZSBwcm90ZWN0aW9uTGVuZ3RoID0gMDtcclxuXHRcdHByaXZhdGUgdmVuZWVyID0ge31cclxuXHRcdFxyXG5cdFx0Ly8gaWYgdHVybmVkIG9mZiwgbm8gRnlyZVZNIGZ1bmN0aW9ucyBhcmUgbWFkZSBhdmFpbGFibGUsIGp1c3Qgc3RhbmRhcmQgR2x1bHggc3R1ZmZcclxuXHRcdGVuYWJsZUZ5cmVWTSA9IHRydWU7XHJcblx0XHRcclxuXHRcdGdsa01vZGUgOiBHbGtNb2RlID0gR2xrTW9kZS5Ob25lO1xyXG5cdFx0XHJcblx0XHRvdXRwdXRSZWFkeTogT3V0cHV0UmVhZHlFdmVudEhhbmRsZXI7XHJcblx0XHRsaW5lV2FudGVkOiBMaW5lV2FudGVkRXZlbnRIYW5kbGVyO1xyXG5cdFx0a2V5V2FudGVkOiBLZXlXYW50ZWRFdmVudEhhbmRsZXI7XHJcblx0XHRzYXZlUmVxdWVzdGVkOiBTYXZlR2FtZUV2ZW50SGFuZGxlcjtcclxuXHRcdGxvYWRSZXF1ZXN0ZWQ6IExvYWRHYW1lRXZlbnRIYW5kbGVyO1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdGNvbnN0cnVjdG9yKGdhbWVGaWxlOiBVbHhJbWFnZSl7XHJcblx0XHRcdGxldCBtYWpvciA9IGdhbWVGaWxlLmdldE1ham9yVmVyc2lvbigpO1xyXG5cdFx0XHRpZiAobWFqb3IgPCAyIHx8IG1ham9yID4gMylcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJHYW1lIHZlcnNpb24gaXMgb3V0IG9mIHRoZSBzdXBwb3J0ZWQgcmFuZ2VcIik7XHJcblx0XHRcdGxldCBtaW5vciA9IGdhbWVGaWxlLmdldE1pbm9yVmVyc2lvbigpO1xyXG5cdFx0XHRpZiAobWFqb3IgPT0gMiAmJiBtaW5vciA8IDApXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiR2FtZSB2ZXJzaW9uIGlzIG91dCBvZiB0aGUgc3VwcG9ydGVkIHJhbmdlXCIpO1xyXG5cdFx0XHRpZiAobWFqb3IgPT0gMyAmJiBtaW5vciA+IDEpXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiR2FtZSB2ZXJzaW9uIGlzIG91dCBvZiB0aGUgc3VwcG9ydGVkIHJhbmdlXCIpO1xyXG5cdFx0XHR0aGlzLmltYWdlID0gZ2FtZUZpbGU7XHJcblx0XHRcdHRoaXMuc3RhY2sgPSBuZXcgTWVtb3J5QWNjZXNzKGdhbWVGaWxlLmdldFN0YWNrU2l6ZSgpICogNCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogY2xlYXJzIHRoZSBzdGFjayBhbmQgaW5pdGlhbGl6ZXMgVk0gcmVnaXN0ZXJzXHJcblx0XHQgKiBmcm9tIHZhbHVlcyBmb3VuZCBpbiBSQU1cclxuXHRcdCAqL1xyXG5cdFx0IGJvb3RzdHJhcCgpe1xyXG5cdFx0XHQgdGhpcy5vcGNvZGVzID0gT3Bjb2Rlcy5pbml0T3Bjb2RlcygpO1xyXG5cdFx0XHQgbGV0IG1haW5mdW5jID0gdGhpcy5pbWFnZS5nZXRTdGFydEZ1bmMoKTtcclxuXHRcdFx0IHRoaXMuZGVjb2RpbmdUYWJsZSA9IHRoaXMuaW1hZ2UuZ2V0RGVjb2RpbmdUYWJsZSgpO1xyXG5cdFx0XHQgdGhpcy5TUCA9IHRoaXMuRlAgPSB0aGlzLmZyYW1lTGVuID0gdGhpcy5sb2NhbHNQb3MgPSAwO1xyXG5cdFx0XHQgdGhpcy5vdXRwdXRTeXN0ZW0gPSBJT1N5c3RlbS5OdWxsO1xyXG5cdFx0XHQgdGhpcy5lbnRlckZ1bmN0aW9uKG1haW5mdW5jKTtcclxuXHRcdFx0IFxyXG5cdFx0IH1cclxuXHRcdCBcclxuXHRcdCAvKipcclxuXHRcdCAgKiAgUHVzaGVzIGEgZnJhbWUgZm9yIGEgZnVuY3Rpb24gY2FsbCwgdXBkYXRpbmcgRlAsIFNQLCBhbmQgUEMuXHJcbiAgICAgICBcdCAgKiAgKEEgY2FsbCBzdHViIHNob3VsZCBoYXZlIGFscmVhZHkgYmVlbiBwdXNoZWQuKVxyXG5cdFx0ICAqL1xyXG5cdFx0IHByaXZhdGUgZW50ZXJGdW5jdGlvbihhZGRyZXNzOiBudW1iZXIsIC4uLmFyZ3M6IG51bWJlcltdKXtcclxuXHRcdFx0IGxldCB7aW1hZ2UsIHN0YWNrfSA9IHRoaXM7XHJcblx0XHRcdCB0aGlzLmV4ZWNNb2RlID0gRXhlY3V0aW9uTW9kZS5Db2RlO1xyXG5cdFx0XHQgLy8gcHVzaCBhIGNhbGwgZnJhbWVcclxuXHRcdFx0IHRoaXMuRlAgPSB0aGlzLlNQO1xyXG5cdFx0XHQgdGhpcy5wdXNoKDApOyAvLyB0ZW1wb3JhcnkgRnJhbWVMZW5cclxuXHRcdFx0IHRoaXMucHVzaCgwKTsgLy8gdGVtcG9yYXJ5IExvY2Fsc1Bvc1xyXG5cdFx0XHQgXHJcblx0XHRcdCAvLyBjb3B5IGxvY2FscyBpbmZvIGludG8gdGhlIGZyYW1lXHJcblx0XHRcdCBsZXQgbG9jYWxTaXplID0gMDtcclxuXHRcdFx0IGZvcihsZXQgaT0gYWRkcmVzcysxOyB0cnVlOyBpKz0yKXtcclxuXHRcdFx0XHQgbGV0IHR5cGUgPSBpbWFnZS5yZWFkQnl0ZShpKTtcclxuXHRcdFx0XHQgbGV0IGNvdW50ID0gaW1hZ2UucmVhZEJ5dGUoaSsxKTtcclxuXHRcdFx0XHQgdGhpcy5wdXNoQnl0ZSh0eXBlKTtcclxuXHRcdFx0XHQgdGhpcy5wdXNoQnl0ZShjb3VudCk7XHJcblx0XHRcdFx0IGlmICh0eXBlID09PSAwIHx8IGNvdW50ID09PSAwKXtcclxuXHRcdFx0XHRcdCB0aGlzLlBDID0gaSArIDI7XHJcblx0XHRcdFx0XHQgYnJlYWs7XHJcblx0XHRcdFx0IH1cclxuXHRcdFx0XHQgaWYgKGxvY2FsU2l6ZSAlIHR5cGUgPiAwKXtcclxuXHRcdFx0XHRcdCBsb2NhbFNpemUgKz0gKHR5cGUgLSAobG9jYWxTaXplICUgdHlwZSkpO1xyXG5cdFx0XHRcdCB9XHJcblx0XHRcdFx0IGxvY2FsU2l6ZSArPSB0eXBlICogY291bnQ7XHJcblx0XHRcdCB9XHJcblx0XHRcdCAvLyBwYWRkaW5nXHJcblx0XHRcdCB3aGlsZSh0aGlzLlNQICU0ID4gMCl7XHJcblx0XHRcdFx0IHRoaXMucHVzaEJ5dGUoMCk7XHJcblx0XHRcdCB9XHJcblx0XHRcdFxyXG5cdFx0XHQgbGV0IHNwID0gdGhpcy5TUDtcclxuXHRcdFx0IGxldCBmcCA9IHRoaXMuRlA7XHJcblx0XHRcdCB0aGlzLmxvY2Fsc1BvcyA9IHNwIC0gZnA7XHJcblx0XHRcdCAvLyBmaWxsIGluIGxvY2Fsc1Bvc1xyXG5cdFx0XHQgc3RhY2sud3JpdGVJbnQzMihmcCArIDQsIHRoaXMubG9jYWxzUG9zKTtcclxuXHRcdFx0IFxyXG5cdFx0XHQgbGV0IGxhc3RPZmZzZXQgPSAwO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHQgaWYgKGFyZ3MgJiYgYXJncy5sZW5ndGgpe1xyXG5cdFx0XHRcdCAvLyBjb3B5IGluaXRpYWwgdmFsdWVzIGFzIGFwcHJvcHJpYXRlXHJcblx0XHRcdFx0IGxldCBvZmZzZXQgPSAwO1xyXG5cdFx0XHRcdCBsZXQgc2l6ZSA9IDA7XHJcblx0XHRcdFx0IGxldCBjb3VudCA9IDA7XHJcblx0XHRcdFx0IGFkZHJlc3MrKztcclxuXHRcdFx0XHQgZm9yKGxldCBhcmdudW09MDsgYXJnbnVtPGFyZ3MubGVuZ3RoOyBhcmdudW0rKyl7XHJcblx0XHRcdFx0XHQgaWYgKGNvdW50ID09PSAwKXtcclxuXHRcdFx0XHRcdFx0IHNpemUgPSBpbWFnZS5yZWFkQnl0ZShhZGRyZXNzKyspO1xyXG5cdFx0XHRcdFx0XHQgY291bnQgPSBpbWFnZS5yZWFkQnl0ZShhZGRyZXNzKyspO1xyXG5cdFx0XHRcdFx0XHQgaWYgKHNpemUgPT09IDAgfHwgY291bnQgPT09IDApIGJyZWFrO1xyXG5cdFx0XHRcdFx0XHQgaWYgKG9mZnNldCAlIHNpemUgPiAwKXtcclxuXHRcdFx0XHRcdFx0XHQgb2Zmc2V0ICs9IChzaXplIC0gKG9mZnNldCAlIHNpemUpKTtcclxuXHRcdFx0XHRcdFx0IH1cclxuXHRcdFx0XHRcdCB9XHJcblx0XHRcdFx0XHQgLy8gemVybyBhbnkgcGFkZGluZyBzcGFjZSBiZXR3ZWVuIGxvY2Fsc1xyXG5cdFx0XHRcdFx0IGZvciAobGV0IGk9bGFzdE9mZnNldDsgaTxvZmZzZXQ7IGkrKyl7XHJcblx0XHRcdFx0XHRcdCBzdGFjay53cml0ZUJ5dGUoc3AraSwgMCk7XHJcblx0XHRcdFx0XHQgfVxyXG5cdFx0XHRcdFx0IFxyXG5cdFx0XHRcdFx0IHN3aXRjaChzaXplKXtcclxuXHRcdFx0XHRcdFx0IGNhc2UgMTpcclxuXHRcdFx0XHRcdFx0IFx0c3RhY2sud3JpdGVCeXRlKHNwK29mZnNldCwgYXJnc1thcmdudW1dKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0IGNhc2UgMjpcclxuXHRcdFx0XHRcdFx0IFx0c3RhY2sud3JpdGVJbnQxNihzcCtvZmZzZXQsIGFyZ3NbYXJnbnVtXSk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdCBjYXNlIDQ6XHJcblx0XHRcdFx0XHRcdCAgICBzdGFjay53cml0ZUludDMyKHNwK29mZnNldCwgYXJnc1thcmdudW1dKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0IGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdCAgICB0aHJvdyBuZXcgRXJyb3IoYElsbGVnYWwgY2FsbCBwYXJhbSBzaXplICR7c2l6ZX0gYXQgcG9zaXRpb24gJHthcmdudW19YCk7XHJcblx0XHRcdFx0XHQgfVxyXG5cdFx0XHRcdFx0IG9mZnNldCArPSBzaXplO1xyXG5cdFx0XHRcdFx0IGxhc3RPZmZzZXQgPSBvZmZzZXQ7XHJcblx0XHRcdFx0XHQgY291bnQtLTtcclxuXHRcdFx0XHQgfVxyXG5cdFx0XHRcdCBcclxuXHRcdFx0XHQgXHJcblx0XHRcdCB9XHJcblx0XHQgICAgIC8vIHplcm8gYW55IHJlbWFpbmluZyBsb2NhbCBzcGFjZVxyXG5cdFx0XHQgZm9yKGxldCBpPWxhc3RPZmZzZXQ7IGk8bG9jYWxTaXplOyBpKyspe1xyXG5cdFx0XHRcdFx0c3RhY2sud3JpdGVCeXRlKHNwK2ksIDApO1xyXG5cdFx0XHQgfVxyXG5cdFx0XHQgXHJcblx0XHRcdCBzcCArPSBsb2NhbFNpemU7XHJcblx0XHRcdCAvLyBwYWRkaW5nXHJcblx0XHRcdCB3aGlsZShzcCU0ID4gMCl7XHJcblx0XHRcdFx0IHN0YWNrLndyaXRlQnl0ZShzcCsrLCAwKTtcclxuXHRcdFx0IH1cclxuXHRcdFx0IHRoaXMuZnJhbWVMZW4gPSBzcCAtIGZwO1xyXG5cdFx0XHQgc3RhY2sud3JpdGVJbnQzMihmcCwgc3AgLSBmcCk7XHJcblx0XHRcdCB0aGlzLlNQID0gc3A7XHJcblx0XHQgfVxyXG5cdFx0IFxyXG5cdFx0IHByaXZhdGUgcHVzaCh2YWx1ZTogbnVtYmVyKXtcclxuXHRcdFx0IHRoaXMuc3RhY2sud3JpdGVJbnQzMih0aGlzLlNQLCB2YWx1ZSk7XHJcblx0XHRcdCB0aGlzLlNQICs9IDQ7XHJcblx0XHQgfVxyXG5cdFx0IFxyXG5cdFx0IHByaXZhdGUgcG9wKCk6IG51bWJlciB7XHJcblx0XHRcdCB0aGlzLlNQIC09IDQ7XHJcblx0XHRcdCByZXR1cm4gdGhpcy5zdGFjay5yZWFkSW50MzIodGhpcy5TUCk7XHJcblx0XHQgfVxyXG5cdFx0IFxyXG5cdFx0IHByaXZhdGUgcHVzaEJ5dGUodmFsdWU6IG51bWJlcil7XHJcblx0XHRcdCB0aGlzLnN0YWNrLndyaXRlQnl0ZSh0aGlzLlNQKyssIHZhbHVlKTtcclxuXHRcdCB9XHJcblx0XHQgXHJcblx0XHQgcHJpdmF0ZSBwdXNoQ2FsbFN0dWIoZGVzdFR5cGU6IG51bWJlciwgZGVzdEFkZHI6IG51bWJlciwgUEM6IG51bWJlciwgZnJhbWVQdHI6IG51bWJlcil7XHJcblx0XHRcdCB0aGlzLnB1c2goZGVzdFR5cGUpO1xyXG5cdFx0XHQgdGhpcy5wdXNoKGRlc3RBZGRyKTtcclxuXHRcdFx0IHRoaXMucHVzaChQQyk7XHJcblx0XHRcdCB0aGlzLnB1c2goZnJhbWVQdHIpO1xyXG5cdFx0IH1cclxuXHRcdCBcclxuXHRcdCBwcml2YXRlIHBvcENhbGxTdHViKCk6IENhbGxTdHVie1xyXG5cdFx0XHQgbGV0IHN0dWIgPSBuZXcgQ2FsbFN0dWIoKTtcclxuXHRcdFx0IHN0dWIuZnJhbWVQdHIgPSB0aGlzLnBvcCgpO1xyXG5cdFx0XHQgc3R1Yi5QQyA9IHRoaXMucG9wKCk7XHJcblx0XHRcdCBzdHViLmRlc3RBZGRyID0gdGhpcy5wb3AoKTtcclxuXHRcdFx0IHN0dWIuZGVzdFR5cGUgPSB0aGlzLnBvcCgpO1xyXG5cdFx0XHQgcmV0dXJuIHN0dWI7XHJcblx0XHQgfVxyXG5cdFx0IFxyXG5cdFx0IFxyXG5cdFx0IC8qKlxyXG5cdFx0ICAqIGV4ZWN1dGVzIGEgc2luZ2xlIGN5Y2xlXHJcblx0XHQgICovXHJcblx0XHQgIHN0ZXAoKXtcclxuXHRcdFx0ICBsZXQge2ltYWdlfSA9IHRoaXM7XHJcblx0XHRcdCAgdGhpcy5jeWNsZSsrO1xyXG5cdFx0XHQgIHN3aXRjaCh0aGlzLmV4ZWNNb2RlKXtcclxuXHRcdFx0XHQgIGNhc2UgRXhlY3V0aW9uTW9kZS5Db2RlOlxyXG5cdFx0XHRcdCAgXHQvLyBkZWNvZGUgb3Bjb2RlIG51bWJlclxyXG5cdFx0XHRcdFx0bGV0IG9wbnVtID0gaW1hZ2UucmVhZEJ5dGUodGhpcy5QQyk7XHJcblx0XHRcdFx0XHRpZiAob3BudW0gPj0gMHhDMCl7XHJcblx0XHRcdFx0XHRcdG9wbnVtID0gaW1hZ2UucmVhZEludDMyKHRoaXMuUEMpIC0gMHhDMDAwMDAwMDtcclxuXHRcdFx0XHRcdFx0dGhpcy5QQyArPSA0O1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChvcG51bSA+PSAweDgwKXtcclxuXHRcdFx0XHRcdFx0b3BudW0gPSBpbWFnZS5yZWFkSW50MTYodGhpcy5QQykgLSAweDgwMDA7XHJcblx0XHRcdFx0XHRcdHRoaXMuUEMgKz0gMjtcclxuXHRcdFx0XHRcdH0gZWxzZXtcclxuXHRcdFx0XHRcdFx0dGhpcy5QQysrO1xyXG5cdFx0XHRcdFx0fSBcclxuXHRcdFx0XHRcdC8vIGxvb2sgdXAgb3Bjb2RlIGluZm9cclxuXHRcdFx0XHRcdGxldCBvcGNvZGUgPSB0aGlzLm9wY29kZXNbb3BudW1dO1xyXG5cdFx0XHRcdFx0aWYgKCFvcGNvZGUpe1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFVucmVjb2duaXplZCBvcGNvZGUgJHtvcG51bX1gKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0Ly8gZGVjb2RlIGxvYWQtb3BlcmFuZHNcclxuXHRcdFx0XHRcdGxldCBvcGNvdW50ID0gb3Bjb2RlLmxvYWRBcmdzICsgb3Bjb2RlLnN0b3JlQXJncztcclxuXHRcdFx0XHRcdGxldCBvcGVyYW5kcyA9IFtdO1xyXG5cdFx0XHRcdFx0aWYgKG9wY29kZS5ydWxlID09PSBPcGNvZGVSdWxlLkRlbGF5ZWRTdG9yZSlcclxuXHRcdFx0XHRcdFx0b3Bjb3VudCsrO1xyXG5cdFx0XHRcdFx0ZWxzZSBpZiAob3Bjb2RlLnJ1bGUgPT09IE9wY29kZVJ1bGUuQ2F0Y2gpXHJcblx0XHRcdFx0XHRcdG9wY291bnQrPSAyO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRsZXQgb3BlcmFuZFBvcyA9IE1hdGguZmxvb3IoIHRoaXMuUEMgKyAob3Bjb3VudCsxKSAvIDIpO1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgaT0wOyBpPG9wY29kZS5sb2FkQXJnczsgaSsrKXtcclxuXHRcdFx0XHRcdFx0bGV0IHR5cGU7XHJcblx0XHRcdFx0XHRcdGlmIChpJTIgPT09IDApe1xyXG5cdFx0XHRcdFx0XHRcdHR5cGUgPSBpbWFnZS5yZWFkQnl0ZSh0aGlzLlBDKSAmIDB4RjtcclxuXHRcdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdFx0dHlwZSA9IChpbWFnZS5yZWFkQnl0ZSh0aGlzLlBDKyspID4+IDQpICYgMHhGO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdG9wZXJhbmRQb3MgKz0gdGhpcy5kZWNvZGVMb2FkT3BlcmFuZChvcGNvZGUsIHR5cGUsIG9wZXJhbmRzLCBvcGVyYW5kUG9zKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0Ly8gZGVjb2RlIHN0b3JlLW9wZXJhbmRzXHJcblx0XHRcdFx0XHRsZXQgc3RvcmVQb3MgPSB0aGlzLlBDO1xyXG5cdFx0XHRcdFx0bGV0IHJlc3VsdFR5cGVzID0gW107XHJcblx0XHRcdFx0XHRsZXQgcmVzdWx0QWRkcnMgPSBbXTtcclxuXHRcdFx0XHRcdGZvcihsZXQgaT0wOyBpPG9wY29kZS5zdG9yZUFyZ3M7IGkrKyl7XHJcblx0XHRcdFx0XHRcdGxldCB0eXBlID0gaSArIG9wY29kZS5sb2FkQXJncztcclxuXHRcdFx0XHRcdFx0aWYgKHR5cGUlMiA9PT0gMCl7XHJcblx0XHRcdFx0XHRcdFx0dHlwZSA9IGltYWdlLnJlYWRCeXRlKHRoaXMuUEMpICYgMHhGO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHR0eXBlID0gKGltYWdlLnJlYWRCeXRlKHRoaXMuUEMrKykgPj4gNCkgJiAweEY7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0cmVzdWx0VHlwZXNbaV0gPSB0eXBlO1xyXG5cdFx0XHRcdFx0XHRvcGVyYW5kUG9zICs9IHRoaXMuZGVjb2RlU3RvcmVPcGVyYW5kKG9wY29kZSwgdHlwZSwgcmVzdWx0QWRkcnMsIG9wZXJhbmRQb3MpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cclxuXHRcdFx0XHRcdGlmKG9wY29kZS5ydWxlID09PSBPcGNvZGVSdWxlLkRlbGF5ZWRTdG9yZSB8fCBvcGNvZGUucnVsZSA9PT0gT3Bjb2RlUnVsZS5DYXRjaCl7XHJcblx0XHRcdFx0XHRcdGxldCB0eXBlID0gb3Bjb2RlLmxvYWRBcmdzICsgb3Bjb2RlLnN0b3JlQXJncztcclxuXHRcdFx0XHRcdFx0aWYgKHR5cGUlMiA9PT0gMCl7XHJcblx0XHRcdFx0XHRcdFx0dHlwZSA9IGltYWdlLnJlYWRCeXRlKHRoaXMuUEMpICYgMHhGO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHR0eXBlID0gKGltYWdlLnJlYWRCeXRlKHRoaXMuUEMrKykgPj4gNCkgJiAweEY7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0b3BlcmFuZFBvcyArPSB0aGlzLmRlY29kZURlbGF5ZWRTdG9yZU9wZXJhbmQob3Bjb2RlLCB0eXBlLCBvcGVyYW5kcywgb3BlcmFuZFBvcyk7XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAob3Bjb2RlLnJ1bGUgPT09IE9wY29kZVJ1bGUuQ2F0Y2gpe1xyXG5cdFx0XHRcdFx0XHQvLyBkZWNvZGUgZmluYWwgbG9hZCBvcGVyYW5kIGZvciBAY2F0Y2hcclxuXHRcdFx0XHRcdFx0bGV0IHR5cGUgPSBvcGNvZGUubG9hZEFyZ3MgKyBvcGNvZGUuc3RvcmVBcmdzICsgMTtcclxuXHRcdFx0XHRcdFx0aWYgKHR5cGUlMiA9PT0gMCl7XHJcblx0XHRcdFx0XHRcdFx0dHlwZSA9IGltYWdlLnJlYWRCeXRlKHRoaXMuUEMpICYgMHhGO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHR0eXBlID0gKGltYWdlLnJlYWRCeXRlKHRoaXMuUEMrKykgPj4gNCkgJiAweEY7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0b3BlcmFuZFBvcyArPSB0aGlzLmRlY29kZUxvYWRPcGVyYW5kKG9wY29kZSwgdHlwZSwgb3BlcmFuZHMsIG9wZXJhbmRQb3MpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHJcbi8vXHRcdFx0XHRcdGNvbnNvbGUuaW5mbyhvcGNvZGUubmFtZSwgb3BlcmFuZHMsIHRoaXMuUEMsIG9wZXJhbmRQb3MpO1xyXG5cclxuXHRcclxuXHRcdFx0XHRcdC8vIGNhbGwgb3Bjb2RlIGltcGxlbWVudGF0aW9uXHJcblx0XHRcdFx0XHR0aGlzLlBDID0gb3BlcmFuZFBvczsgLy8gYWZ0ZXIgdGhlIGxhc3Qgb3BlcmFuY1x0XHRcdFx0XHJcblx0XHRcdFx0XHRsZXQgcmVzdWx0ID0gb3Bjb2RlLmhhbmRsZXIuYXBwbHkodGhpcywgb3BlcmFuZHMpO1xyXG5cdFx0XHRcdFx0aWYgKHJlc3VsdFR5cGVzLmxlbmd0aCA9PT0gMSB8fCByZXN1bHQgPT09ICd3YWl0Jyl7XHJcblx0XHRcdFx0XHRcdHJlc3VsdCA9IFsgcmVzdWx0IF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vIHN0b3JlIHJlc3VsdHNcclxuXHRcdFx0XHRcdGlmIChyZXN1bHQpe1xyXG5cdFx0XHRcdFx0XHQvLyBmb3IgYXN5bmNocm9ub3VzIGlucHV0LCB3ZSBuZWVkIHRvIHN0b3AgcmlnaHQgbm93XHJcblx0XHRcdFx0XHRcdC8vIHVudGlsIHdlIGFyZSBhc2tlZCB0byByZXN1bWVcclxuXHRcdFx0XHRcdFx0aWYgKCd3YWl0JyA9PT0gcmVzdWx0WzBdKXtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnJlc3VtZUFmdGVyV2FpdF9yZXN1bHRUeXBlcyA9IHJlc3VsdFR5cGVzO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMucmVzdW1lQWZ0ZXJXYWl0X3Jlc3VsdEFkZHJzID0gcmVzdWx0QWRkcnM7XHJcblx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuICd3YWl0JztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdHRoaXMuc3RvcmVSZXN1bHRzKG9wY29kZS5ydWxlLCByZXN1bHRUeXBlcywgcmVzdWx0QWRkcnMsIHJlc3VsdCApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0ICBcdGJyZWFrO1xyXG5cdFx0XHRcdCAgY2FzZSBFeGVjdXRpb25Nb2RlLkNvbXByZXNzZWRTdHJpbmc6XHJcblx0XHRcdFx0ICBcdC8vIFRPRE86IG5hdGl2ZSBkZWNvZGluZyB0YWJsZVxyXG5cdFx0XHRcdFx0TmV4dENvbXByZXNzZWRDaGFyLmNhbGwodGhpcyk7XHJcblx0XHRcdFx0XHRicmVhazsgXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHQgIGNhc2UgRXhlY3V0aW9uTW9kZS5DU3RyaW5nOlxyXG5cdFx0XHRcdCAgXHROZXh0Q1N0cmluZ0NoYXIuY2FsbCh0aGlzKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0ICBjYXNlIEV4ZWN1dGlvbk1vZGUuVW5pY29kZVN0cmluZzpcclxuXHRcdFx0XHQgIFx0TmV4dFVuaVN0cmluZ0NoYXIuY2FsbCh0aGlzKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0ICBjYXNlIEV4ZWN1dGlvbk1vZGUuTnVtYmVyOlxyXG5cdFx0XHRcdCAgXHROZXh0RGlnaXQuY2FsbCh0aGlzKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQgIFxyXG5cdFx0XHRcdCAgZGVmYXVsdDpcclxuXHRcdFx0XHQgIFx0dGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBleGVjdXRpb24gbW9kZSAke3RoaXMuZXhlY01vZGV9YCk7XHJcblx0XHRcdCAgfVxyXG5cdFx0ICB9XHJcblx0XHQgIFxyXG5cdFx0ICAvKipcclxuXHRcdCAgICogU3RhcnRzIHRoZSBpbnRlcnByZXRlci5cclxuXHRcdCAgICogVGhpcyBtZXRob2QgZG9lcyBub3QgcmV0dXJuIHVudGlsIHRoZSBnYW1lIGZpbmlzaGVzLCBlaXRoZXIgYnlcclxuICAgICAgICAgICAqIHJldHVybmluZyBmcm9tIHRoZSBtYWluIGZ1bmN0aW9uIG9yIHdpdGggdGhlIHF1aXQgb3Bjb2RlXHJcblx0XHQgICAqICh1bmxlc3MgaXQgaXMgcGxhY2VkIGludG8gXCJ3YWl0aW5nXCIgbW9kZSBmb3IgYXN5bmNocm9ub3VzXHJcblx0XHQgICAqIHVzZXIgaW5wdXQuIEluIHRoaXMgY2FzZSwgdGhlcmUgd2lsbCBiZSBhIGNhbGxiYWNrIHRoYXQgcmVzdW1lc1xyXG5cdFx0ICAgKiBleGVjdXRpb24pXHJcblx0XHQgICAqL1xyXG5cdFx0ICBydW4oKXtcclxuXHRcdFx0ICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHQgIHRoaXMuYm9vdHN0cmFwKCk7XHJcblx0XHRcdCAgdGhpcy5yZXN1bWVBZnRlcldhaXQoKTtcclxuXHRcdCAgfVxyXG5cdFx0ICBcclxuXHRcdCAgXHJcblx0XHQgIC8qKlxyXG5cdFx0ICAgKiBAcmV0dXJuIGhvdyBtYW55IGV4dHJhIGJ5dGVzIHdlcmUgcmVhZCAoc28gdGhhdCBvcGVyYW5kUG9zIGNhbiBiZSBhZHZhbmNlZClcclxuXHRcdCAgICovXHJcblx0XHQgIHByaXZhdGUgZGVjb2RlTG9hZE9wZXJhbmQob3Bjb2RlOiBPcGNvZGUsIHR5cGU6bnVtYmVyLCBvcGVyYW5kczogbnVtYmVyW10sIG9wZXJhbmRQb3M6IG51bWJlcil7XHJcblx0XHRcdCAgbGV0IHtpbWFnZSwgc3RhY2ssIEZQLCBsb2NhbHNQb3MsIGZyYW1lTGVufSA9IHRoaXM7XHJcblx0XHRcdCAgZnVuY3Rpb24gbG9hZExvY2FsKGFkZHJlc3M6IG51bWJlcil7XHJcblx0XHRcdFx0XHRhZGRyZXNzICs9IEZQICsgbG9jYWxzUG9zO1xyXG5cdFx0XHRcdFx0bGV0IG1heEFkZHJlc3MgPSBGUCArIGZyYW1lTGVuO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQgc3dpdGNoKG9wY29kZS5ydWxlKXtcclxuXHRcdFx0XHRcdFx0Y2FzZSBPcGNvZGVSdWxlLkluZGlyZWN0OEJpdDogXHJcblx0XHRcdFx0XHRcdFx0aWYgKGFkZHJlc3MgPiBtYXhBZGRyZXNzKVxyXG5cdFx0XHRcdFx0XHRcdCAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZWFkaW5nIG91dHNpZGUgbG9jYWwgc3RvcmFnZSBib3VuZHNcIik7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHN0YWNrLnJlYWRCeXRlKGFkZHJlc3MpO1xyXG5cdFx0XHRcdFx0XHRjYXNlIE9wY29kZVJ1bGUuSW5kaXJlY3QxNkJpdDogXHJcblx0XHRcdFx0XHRcdFx0aWYgKGFkZHJlc3MrMSA+IG1heEFkZHJlc3MpXHJcblx0XHRcdFx0XHRcdFx0ICAgIHRocm93IG5ldyBFcnJvcihcIlJlYWRpbmcgb3V0c2lkZSBsb2NhbCBzdG9yYWdlIGJvdW5kc1wiKTtcclxuXHRcdFx0XHRcdFx0ICAgIHJldHVybiBzdGFjay5yZWFkSW50MTYoYWRkcmVzcyk7XHJcblx0XHRcdFx0XHRcdGRlZmF1bHQ6IFxyXG5cdFx0XHRcdFx0XHRcdGlmIChhZGRyZXNzKzMgPiBtYXhBZGRyZXNzKVxyXG5cdFx0XHRcdFx0XHRcdCAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZWFkaW5nIG91dHNpZGUgbG9jYWwgc3RvcmFnZSBib3VuZHNcIik7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHN0YWNrLnJlYWRJbnQzMihhZGRyZXNzKTtcclxuXHRcdFx0XHRcdH0gXHJcblx0XHRcdCAgfVxyXG5cdFx0XHQgIFxyXG5cdFx0XHQgIGZ1bmN0aW9uIGxvYWRJbmRpcmVjdChhZGRyZXNzOiBudW1iZXIpe1xyXG5cdFx0XHRcdCAgXHJcblx0XHRcdFx0XHRzd2l0Y2gob3Bjb2RlLnJ1bGUpe1xyXG5cdFx0XHRcdFx0XHRjYXNlIE9wY29kZVJ1bGUuSW5kaXJlY3Q4Qml0OiByZXR1cm4gaW1hZ2UucmVhZEJ5dGUoYWRkcmVzcyk7XHJcblx0XHRcdFx0XHRcdGNhc2UgT3Bjb2RlUnVsZS5JbmRpcmVjdDE2Qml0OiByZXR1cm4gaW1hZ2UucmVhZEludDE2KGFkZHJlc3MpO1xyXG5cdFx0XHRcdFx0XHRkZWZhdWx0OiByZXR1cm4gaW1hZ2UucmVhZEludDMyKGFkZHJlc3MpO1xyXG5cdFx0XHRcdFx0fVx0XHQgIFxyXG5cdFx0XHQgIH1cclxuXHJcblx0XHRcdCAgc3dpdGNoKHR5cGUpe1xyXG5cdFx0XHRcdCAgLy8gaW1tZWRpYXRlc1xyXG5cdFx0XHRcdCAgY2FzZSBMb2FkT3BlcmFuZFR5cGUuemVybzogb3BlcmFuZHMucHVzaCgwKTsgcmV0dXJuIDA7XHJcblx0XHRcdFx0ICBjYXNlIExvYWRPcGVyYW5kVHlwZS5ieXRlOiBvcGVyYW5kcy5wdXNoKGludDgoaW1hZ2UucmVhZEJ5dGUob3BlcmFuZFBvcykpKTsgcmV0dXJuIDE7XHJcblx0XHRcdFx0ICBjYXNlIExvYWRPcGVyYW5kVHlwZS5pbnQxNjogb3BlcmFuZHMucHVzaChpbnQxNihpbWFnZS5yZWFkSW50MTYob3BlcmFuZFBvcykpKTsgcmV0dXJuIDI7XHJcblx0XHRcdFx0ICBjYXNlIExvYWRPcGVyYW5kVHlwZS5pbnQzMjogb3BlcmFuZHMucHVzaChpbnQzMihpbWFnZS5yZWFkSW50MzIob3BlcmFuZFBvcykpKTsgcmV0dXJuIDQ7XHJcblx0XHRcdFx0ICAvLyBpbmRpcmVjdFxyXG5cdFx0XHRcdCAgY2FzZSBMb2FkT3BlcmFuZFR5cGUucHRyXzg6IG9wZXJhbmRzLnB1c2gobG9hZEluZGlyZWN0KGltYWdlLnJlYWRCeXRlKG9wZXJhbmRQb3MpKSk7IHJldHVybiAxO1xyXG5cdFx0XHRcdCAgY2FzZSBMb2FkT3BlcmFuZFR5cGUucHRyXzE2OiBvcGVyYW5kcy5wdXNoKGxvYWRJbmRpcmVjdChpbWFnZS5yZWFkSW50MTYob3BlcmFuZFBvcykpKTsgcmV0dXJuIDI7XHJcblx0XHRcdFx0ICBjYXNlIExvYWRPcGVyYW5kVHlwZS5wdHJfMzI6IG9wZXJhbmRzLnB1c2gobG9hZEluZGlyZWN0KGltYWdlLnJlYWRJbnQzMihvcGVyYW5kUG9zKSkpOyByZXR1cm4gNDtcclxuXHRcdFx0XHQgIC8vIHN0YWNrXHJcblx0XHRcdFx0ICBjYXNlIExvYWRPcGVyYW5kVHlwZS5zdGFjazogXHJcblx0XHRcdFx0ICBcdCBpZiAodGhpcy5TUCA8PSB0aGlzLkZQICsgdGhpcy5mcmFtZUxlbilcclxuXHRcdFx0IFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiU3RhY2sgdW5kZXJmbG93XCIpO1xyXG5cdFx0XHRcdCAgXHRvcGVyYW5kcy5wdXNoKHRoaXMucG9wKCkpOyBcclxuXHRcdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHRcdCAgLy8gaW5kaXJlY3QgZnJvbSBSQU1cclxuXHRcdFx0XHQgIGNhc2UgTG9hZE9wZXJhbmRUeXBlLnJhbV84OiBvcGVyYW5kcy5wdXNoKGxvYWRJbmRpcmVjdChpbWFnZS5nZXRSYW1BZGRyZXNzKGltYWdlLnJlYWRCeXRlKG9wZXJhbmRQb3MpKSkpOyByZXR1cm4gMTtcclxuXHRcdFx0XHQgIGNhc2UgTG9hZE9wZXJhbmRUeXBlLnJhbV8xNjogb3BlcmFuZHMucHVzaChsb2FkSW5kaXJlY3QoaW1hZ2UuZ2V0UmFtQWRkcmVzcyhpbWFnZS5yZWFkSW50MTYob3BlcmFuZFBvcykpKSk7IHJldHVybiAyO1xyXG5cdFx0XHRcdCAgY2FzZSBMb2FkT3BlcmFuZFR5cGUucmFtXzMyOiBvcGVyYW5kcy5wdXNoKGxvYWRJbmRpcmVjdChpbWFnZS5nZXRSYW1BZGRyZXNzKGltYWdlLnJlYWRJbnQzMihvcGVyYW5kUG9zKSkpKTsgcmV0dXJuIDQ7XHJcblx0XHRcdFx0ICAvLyBsb2NhbCBzdG9yYWdlXHJcblx0XHRcdFx0ICBjYXNlIExvYWRPcGVyYW5kVHlwZS5sb2NhbF84OiBvcGVyYW5kcy5wdXNoKGxvYWRMb2NhbChpbWFnZS5yZWFkQnl0ZShvcGVyYW5kUG9zKSkpOyByZXR1cm4gMTtcclxuXHRcdFx0XHQgIGNhc2UgTG9hZE9wZXJhbmRUeXBlLmxvY2FsXzE2OiBvcGVyYW5kcy5wdXNoKGxvYWRMb2NhbChpbWFnZS5yZWFkSW50MTYob3BlcmFuZFBvcykpKTsgcmV0dXJuIDI7XHJcblx0XHRcdFx0ICBjYXNlIExvYWRPcGVyYW5kVHlwZS5sb2NhbF8zMjogb3BlcmFuZHMucHVzaChsb2FkTG9jYWwoaW1hZ2UucmVhZEludDMyKG9wZXJhbmRQb3MpKSk7IHJldHVybiA0O1xyXG5cclxuXHRcdFx0XHQgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgbG9hZCBvcGVyYW5kIHR5cGUgJHt0eXBlfWApO1xyXG5cdFx0XHQgIH1cclxuXHRcdFx0ICBcclxuXHRcdCAgfVxyXG5cdFx0ICBcclxuXHRcdCAgLyoqXHJcblx0XHQgICAqIEByZXR1cm4gaG93IG1hbnkgZXh0cmEgYnl0ZXMgd2VyZSByZWFkIChzbyB0aGF0IG9wZXJhbmRQb3MgY2FuIGJlIGFkdmFuY2VkKVxyXG5cdFx0ICAgKi9cclxuXHRcdCAgcHJpdmF0ZSBkZWNvZGVTdG9yZU9wZXJhbmQob3Bjb2RlOiBPcGNvZGUsIHR5cGU6bnVtYmVyLCBvcGVyYW5kczogbnVtYmVyW10sIG9wZXJhbmRQb3M6IG51bWJlcil7XHJcblx0XHRcdCAgc3dpdGNoKHR5cGUpe1xyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLmRpc2NhcmQ6IFxyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLnN0YWNrOlxyXG5cdFx0XHRcdCAgXHRcdHJldHVybiAwOyBcclxuXHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5wdHJfODogXHJcblx0XHRcdFx0ICBjYXNlIFN0b3JlT3BlcmFuZFR5cGUubG9jYWxfODpcclxuXHRcdFx0XHQgIFx0XHRvcGVyYW5kcy5wdXNoKHRoaXMuaW1hZ2UucmVhZEJ5dGUob3BlcmFuZFBvcykpOyBcclxuXHRcdFx0XHRcdFx0cmV0dXJuIDE7XHJcblx0XHRcdFx0ICBjYXNlIFN0b3JlT3BlcmFuZFR5cGUucHRyXzE2OlxyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLmxvY2FsXzE2OiBcclxuXHRcdFx0XHQgIFx0XHRvcGVyYW5kcy5wdXNoKHRoaXMuaW1hZ2UucmVhZEludDE2KG9wZXJhbmRQb3MpKTsgXHJcblx0XHRcdFx0XHRcdHJldHVybiAyO1xyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLnB0cl8zMjogXHJcblx0XHRcdFx0ICBjYXNlIFN0b3JlT3BlcmFuZFR5cGUubG9jYWxfMzI6XHJcblx0XHRcdFx0ICBcdFx0b3BlcmFuZHMucHVzaCh0aGlzLmltYWdlLnJlYWRJbnQzMihvcGVyYW5kUG9zKSk7IFxyXG5cdFx0XHRcdFx0IFx0cmV0dXJuIDQ7XHJcblx0XHRcdFx0ICBjYXNlIFN0b3JlT3BlcmFuZFR5cGUucmFtXzg6XHJcblx0XHRcdFx0ICBcdFx0b3BlcmFuZHMucHVzaCh0aGlzLmltYWdlLmdldFJhbUFkZHJlc3ModGhpcy5pbWFnZS5yZWFkQnl0ZShvcGVyYW5kUG9zKSkpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gMTsgIFxyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLnJhbV8xNjpcclxuXHRcdFx0XHQgIFx0XHRvcGVyYW5kcy5wdXNoKHRoaXMuaW1hZ2UuZ2V0UmFtQWRkcmVzcyh0aGlzLmltYWdlLnJlYWRJbnQxNihvcGVyYW5kUG9zKSkpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gMjsgIFxyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLnJhbV8zMjpcclxuXHRcdFx0XHQgIFx0XHRvcGVyYW5kcy5wdXNoKHRoaXMuaW1hZ2UuZ2V0UmFtQWRkcmVzcyh0aGlzLmltYWdlLnJlYWRJbnQzMihvcGVyYW5kUG9zKSkpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gNDsgIFxyXG5cdFx0XHRcdCAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBzdG9yZSBvcGVyYW5kIHR5cGUgJHt0eXBlfWApO1xyXG5cdFx0XHQgIH1cclxuXHRcdCAgfVxyXG5cdFx0ICBcclxuXHRcdCAgLyoqXHJcblx0XHQgICAqIEByZXR1cm4gaG93IG1hbnkgZXh0cmEgYnl0ZXMgd2VyZSByZWFkIChzbyB0aGF0IG9wZXJhbmRQb3MgY2FuIGJlIGFkdmFuY2VkKVxyXG5cdFx0ICAgKi9cclxuXHRcdCAgcHJpdmF0ZSBkZWNvZGVEZWxheWVkU3RvcmVPcGVyYW5kKG9wY29kZTogT3Bjb2RlLCB0eXBlOm51bWJlciwgb3BlcmFuZHM6IG51bWJlcltdLCBvcGVyYW5kUG9zOiBudW1iZXIpe1xyXG5cdFx0XHQgIHN3aXRjaCh0eXBlKXtcclxuXHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5kaXNjYXJkOiBcclxuXHRcdFx0XHQgIFx0b3BlcmFuZHMucHVzaChHTFVMWF9TVFVCLlNUT1JFX05VTEwpO1xyXG5cdFx0XHRcdFx0b3BlcmFuZHMucHVzaCgwKTtcclxuXHRcdFx0XHQgIFx0cmV0dXJuIDA7XHJcblx0XHRcdFx0ICBjYXNlIFN0b3JlT3BlcmFuZFR5cGUucHRyXzg6IFxyXG5cdFx0XHRcdCAgXHRvcGVyYW5kcy5wdXNoKEdMVUxYX1NUVUIuU1RPUkVfTUVNKTtcclxuXHRcdFx0XHRcdG9wZXJhbmRzLnB1c2godGhpcy5pbWFnZS5yZWFkQnl0ZShvcGVyYW5kUG9zKSk7XHJcblx0XHRcdFx0ICBcdHJldHVybiAxO1xyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLnB0cl8xNjogXHJcblx0XHRcdFx0ICBcdG9wZXJhbmRzLnB1c2goR0xVTFhfU1RVQi5TVE9SRV9NRU0pO1xyXG5cdFx0XHRcdFx0b3BlcmFuZHMucHVzaCh0aGlzLmltYWdlLnJlYWRJbnQxNihvcGVyYW5kUG9zKSk7XHJcblx0XHRcdFx0ICBcdHJldHVybiAyO1xyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLnB0cl8zMjogXHJcblx0XHRcdFx0ICBcdG9wZXJhbmRzLnB1c2goR0xVTFhfU1RVQi5TVE9SRV9NRU0pO1xyXG5cdFx0XHRcdFx0b3BlcmFuZHMucHVzaCh0aGlzLmltYWdlLnJlYWRJbnQzMihvcGVyYW5kUG9zKSk7IFxyXG5cdFx0XHRcdFx0cmV0dXJuIDQ7XHJcblx0XHRcdFx0ICBjYXNlIFN0b3JlT3BlcmFuZFR5cGUuc3RhY2s6XHJcblx0XHRcdFx0ICBcdG9wZXJhbmRzLnB1c2goR0xVTFhfU1RVQi5TVE9SRV9TVEFDSyk7XHJcblx0XHRcdFx0XHRvcGVyYW5kcy5wdXNoKDApO1xyXG5cdFx0XHRcdFx0cmV0dXJuIDA7ICBcclxuXHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5sb2NhbF84OlxyXG5cdFx0XHRcdCAgICBvcGVyYW5kcy5wdXNoKEdMVUxYX1NUVUIuU1RPUkVfTE9DQUwpO1xyXG5cdFx0XHRcdFx0b3BlcmFuZHMucHVzaCh0aGlzLmltYWdlLnJlYWRCeXRlKG9wZXJhbmRQb3MpKTtcclxuXHRcdFx0XHQgIFx0cmV0dXJuIDE7XHJcblx0XHRcdFx0ICBjYXNlIFN0b3JlT3BlcmFuZFR5cGUubG9jYWxfMTY6IFxyXG5cdFx0XHRcdCAgXHRvcGVyYW5kcy5wdXNoKEdMVUxYX1NUVUIuU1RPUkVfTE9DQUwpO1xyXG5cdFx0XHRcdFx0b3BlcmFuZHMucHVzaCh0aGlzLmltYWdlLnJlYWRJbnQxNihvcGVyYW5kUG9zKSk7XHJcblx0XHRcdFx0ICBcdHJldHVybiAyO1xyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLmxvY2FsXzMyOiBcclxuXHRcdFx0XHQgIFx0b3BlcmFuZHMucHVzaChHTFVMWF9TVFVCLlNUT1JFX0xPQ0FMKTtcclxuXHRcdFx0XHRcdG9wZXJhbmRzLnB1c2godGhpcy5pbWFnZS5yZWFkSW50MzIob3BlcmFuZFBvcykpOyBcclxuXHRcdFx0XHRcdHJldHVybiA0O1xyXG5cdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLnJhbV84OlxyXG5cdFx0XHRcdCAgICBvcGVyYW5kcy5wdXNoKEdMVUxYX1NUVUIuU1RPUkVfTUVNKTtcclxuXHRcdFx0XHRcdG9wZXJhbmRzLnB1c2godGhpcy5pbWFnZS5nZXRSYW1BZGRyZXNzKHRoaXMuaW1hZ2UucmVhZEJ5dGUob3BlcmFuZFBvcykpKTtcclxuXHRcdFx0XHQgIFx0cmV0dXJuIDE7XHJcblx0XHRcdFx0ICBjYXNlIFN0b3JlT3BlcmFuZFR5cGUucmFtXzE2OiBcclxuXHRcdFx0XHQgIFx0b3BlcmFuZHMucHVzaChHTFVMWF9TVFVCLlNUT1JFX01FTSk7XHJcblx0XHRcdFx0XHRvcGVyYW5kcy5wdXNoKHRoaXMuaW1hZ2UuZ2V0UmFtQWRkcmVzcyh0aGlzLmltYWdlLnJlYWRJbnQxNihvcGVyYW5kUG9zKSkpO1xyXG5cdFx0XHRcdCAgXHRyZXR1cm4gMjtcclxuXHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5yYW1fMzI6IFxyXG5cdFx0XHRcdCAgXHRvcGVyYW5kcy5wdXNoKEdMVUxYX1NUVUIuU1RPUkVfTUVNKTtcclxuXHRcdFx0XHRcdG9wZXJhbmRzLnB1c2godGhpcy5pbWFnZS5nZXRSYW1BZGRyZXNzKHRoaXMuaW1hZ2UucmVhZEludDMyKG9wZXJhbmRQb3MpKSk7IFxyXG5cdFx0XHRcdFx0cmV0dXJuIDQ7XHRcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdCAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBkZWxheWVkIHN0b3JlIG9wZXJhbmQgdHlwZSAke3R5cGV9YCk7XHJcblx0XHRcdCAgfVxyXG5cdFx0ICB9XHJcblx0XHQgIFxyXG5cdFx0ICBcclxuXHRcdCAgcHJpdmF0ZSBwZXJmb3JtRGVsYXllZFN0b3JlKHR5cGU6bnVtYmVyLCBhZGRyZXNzOiBudW1iZXIsIHZhbHVlOiBudW1iZXIpe1xyXG5cdFx0XHQgIHN3aXRjaCh0eXBlKXtcclxuXHRcdFx0XHQgIGNhc2UgR0xVTFhfU1RVQi5TVE9SRV9OVUxMOiByZXR1cm47XHJcblx0XHRcdFx0ICBjYXNlIEdMVUxYX1NUVUIuU1RPUkVfTUVNOiB0aGlzLmltYWdlLndyaXRlSW50MzIoYWRkcmVzcywgdmFsdWUpOyByZXR1cm47XHJcblx0XHRcdFx0ICBjYXNlIEdMVUxYX1NUVUIuU1RPUkVfTE9DQUw6IHRoaXMuc3RhY2sud3JpdGVJbnQzMih0aGlzLkZQICsgdGhpcy5sb2NhbHNQb3MgKyBhZGRyZXNzLCB2YWx1ZSk7IHJldHVybjtcclxuXHRcdFx0XHQgIGNhc2UgR0xVTFhfU1RVQi5TVE9SRV9TVEFDSzogdGhpcy5wdXNoKHZhbHVlKTsgcmV0dXJuO1xyXG5cdFx0XHRcdCAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBkZWxheWVkIHN0b3JlIG1vZGUgJHt0eXBlfWApO1xyXG5cdFx0XHQgIH1cclxuXHRcdCAgfVxyXG5cdFx0ICBcclxuXHRcdCAgXHJcblx0XHQgIHByaXZhdGUgc3RvcmVSZXN1bHRzKHJ1bGU6IE9wY29kZVJ1bGUsIHJlc3VsdFR5cGVzOiBudW1iZXJbXSwgcmVzdWx0QWRkcnM6IG51bWJlcltdLCByZXN1bHRzOiBudW1iZXJbXSl7XHJcblx0XHRcdCBmb3IgKGxldCBpPTA7IGk8cmVzdWx0cy5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdFx0ICBsZXQgdmFsdWUgPSByZXN1bHRzW2ldO1xyXG5cdFx0XHRcdCAgbGV0IHR5cGUgPSByZXN1bHRUeXBlc1tpXTtcclxuXHRcdFx0XHQgIHN3aXRjaCh0eXBlKXtcclxuXHRcdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLmRpc2NhcmQ6IHJldHVybjtcclxuXHRcdFx0XHRcdCAgY2FzZSA1OiBjYXNlIDY6IGNhc2UgNzogY2FzZSAxMzogY2FzZSAxNDogY2FzZSAxNTpcclxuXHRcdFx0XHRcdCAgXHQvLyB3cml0ZSB0byBtZW1vcnlcclxuXHRcdFx0XHRcdFx0dGhpcy5pbWFnZS53cml0ZShydWxlLCByZXN1bHRBZGRyc1tpXSwgdmFsdWUpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLnN0YWNrOlxyXG5cdFx0XHRcdFx0ICBcdC8vIHB1c2ggb250byBzdGFja1xyXG5cdFx0XHRcdFx0XHR0aGlzLnB1c2godmFsdWUpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLmxvY2FsXzg6XHJcblx0XHRcdFx0XHQgIGNhc2UgU3RvcmVPcGVyYW5kVHlwZS5sb2NhbF8xNjpcclxuXHRcdFx0XHRcdCAgY2FzZSBTdG9yZU9wZXJhbmRUeXBlLmxvY2FsXzMyOlxyXG5cdFx0XHRcdFx0XHQvLyB3cml0ZSB0byBsb2NhbCBzdG9yYWdlXHJcblx0XHRcdFx0XHRcdGxldCBhZGRyZXNzID0gcmVzdWx0QWRkcnNbaV0gKyB0aGlzLkZQICsgdGhpcy5sb2NhbHNQb3M7XHJcblx0XHRcdFx0XHRcdGxldCBsaW1pdCA9IHRoaXMuRlAgKyB0aGlzLmZyYW1lTGVuO1xyXG5cdFx0XHRcdFx0XHRzd2l0Y2gocnVsZSl7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSBPcGNvZGVSdWxlLkluZGlyZWN0OEJpdDpcclxuXHRcdFx0XHRcdFx0XHRcdGlmKGFkZHJlc3MgPj0gbGltaXQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIndyaXRpbmcgb3V0c2lkZSBsb2NhbCBzdG9yYWdlIGJvdW5kc1wiKTtcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc3RhY2sud3JpdGVCeXRlKGFkZHJlc3MsIHZhbHVlKTtcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgT3Bjb2RlUnVsZS5JbmRpcmVjdDE2Qml0OlxyXG5cdFx0XHRcdFx0XHRcdFx0aWYoYWRkcmVzcysxID49IGxpbWl0KVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ3cml0aW5nIG91dHNpZGUgbG9jYWwgc3RvcmFnZSBib3VuZHNcIik7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnN0YWNrLndyaXRlSW50MTYoYWRkcmVzcywgdmFsdWUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdFx0XHRcdGlmKGFkZHJlc3MrMyA+PSBsaW1pdClcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwid3JpdGluZyBvdXRzaWRlIGxvY2FsIHN0b3JhZ2UgYm91bmRzXCIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zdGFjay53cml0ZUludDMyKGFkZHJlc3MsIHZhbHVlKTtcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJyZWFrO1x0XHRcdFx0XHQgIFxyXG5cdFx0XHRcdFx0ICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoYHVuc3VwcG9ydGVkIHN0b3JlIHJlc3VsdCBtb2RlICR7dHlwZX0gZm9yIHJlc3VsdCAke2l9IG9mICR7cmVzdWx0c31gKTtcclxuXHRcdFx0XHQgIH1cdFxyXG5cdFx0XHQgIH1cclxuXHRcdCAgfVxyXG5cdFx0ICBcclxuXHRcdCAgcHJpdmF0ZSBsZWF2ZUZ1bmN0aW9uKHJldFZhbDogbnVtYmVyKXtcclxuXHRcdFx0XHRpZiAodGhpcy5GUCA9PT0gMCl7XHJcblx0XHRcdFx0XHQvLyB0b3AtbGV2ZWwgZnVuY3Rpb25cclxuXHRcdFx0XHRcdHRoaXMucnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLlNQID0gdGhpcy5GUDtcclxuXHRcdFx0XHR0aGlzLnJlc3VtZUZyb21DYWxsU3R1YihyZXRWYWwpO1xyXG5cdFx0ICB9XHJcblx0XHQgIFxyXG5cdFx0ICBwcml2YXRlIHJlc3VtZUZyb21DYWxsU3R1YihyZXN1bHQ6IG51bWJlcil7XHJcblx0XHRcdCAgbGV0IHN0dWIgPSB0aGlzLnBvcENhbGxTdHViKCk7XHJcblx0XHRcdCAgXHJcblx0XHRcdCAgdGhpcy5QQyA9IHN0dWIuUEM7XHJcblx0XHRcdCAgdGhpcy5leGVjTW9kZSA9IEV4ZWN1dGlvbk1vZGUuQ29kZTtcclxuXHRcdFx0ICBcclxuXHRcdFx0ICBsZXQgbmV3RlAgPSBzdHViLmZyYW1lUHRyO1xyXG5cdFx0XHQgIGxldCBuZXdGcmFtZUxlbiA9IHRoaXMuc3RhY2sucmVhZEludDMyKG5ld0ZQKTtcclxuXHRcdFx0ICBsZXQgbmV3TG9jYWxzUG9zID0gdGhpcy5zdGFjay5yZWFkSW50MzIobmV3RlArNCk7XHJcblx0XHRcdCAgXHJcblx0XHRcdCAgc3dpdGNoKHN0dWIuZGVzdFR5cGUpe1xyXG5cdFx0XHRcdCAgY2FzZSBHTFVMWF9TVFVCLlNUT1JFX05VTEw6IGJyZWFrO1xyXG5cdFx0XHRcdCAgY2FzZSBHTFVMWF9TVFVCLlNUT1JFX01FTTpcclxuXHRcdFx0XHQgIFx0XHR0aGlzLmltYWdlLndyaXRlSW50MzIoc3R1Yi5kZXN0QWRkciwgcmVzdWx0KTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0ICBjYXNlIEdMVUxYX1NUVUIuU1RPUkVfTE9DQUw6XHJcblx0XHRcdFx0ICBcdFx0dGhpcy5zdGFjay53cml0ZUludDMyKG5ld0ZQICsgbmV3TG9jYWxzUG9zKyBzdHViLmRlc3RBZGRyLCByZXN1bHQpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHQgIGNhc2UgR0xVTFhfU1RVQi5TVE9SRV9TVEFDSzpcclxuXHRcdFx0XHQgIFx0XHR0aGlzLnB1c2gocmVzdWx0KTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0ICBjYXNlIEdMVUxYX1NUVUIuUkVTVU1FX0ZVTkM6XHJcblx0XHRcdFx0ICBcdFx0Ly8gcmVzdW1lIGV4ZWN1dGluZyBpbiB0aGUgc2FtZSBjYWxsIGZyYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgXHQvLyByZXR1cm4gdG8gYXZvaWQgY2hhbmdpbmcgRlBcclxuICAgICAgICAgICAgICAgICAgICBcdHJldHVybjtcclxuXHRcdFx0XHQgIGNhc2UgR0xVTFhfU1RVQi5SRVNVTUVfQ1NUUjpcclxuICAgICAgICAgICAgICAgICAgICBcdC8vIHJlc3VtZSBwcmludGluZyBhIEMtc3RyaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgXHR0aGlzLmV4ZWNNb2RlID0gRXhlY3V0aW9uTW9kZS5DU3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIFx0YnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgR0xVTFhfU1RVQi5SRVNVTUVfVU5JU1RSOlxyXG4gICAgICAgICAgICAgICAgICAgXHQgICAgLy8gcmVzdW1lIHByaW50aW5nIGEgVW5pY29kZSBzdHJpbmdcclxuICAgICAgICAgICAgICAgICAgICBcdHRoaXMuZXhlY01vZGUgPSBFeGVjdXRpb25Nb2RlLlVuaWNvZGVTdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICBjYXNlIEdMVUxYX1NUVUIuUkVTVU1FX05VTUJFUjpcclxuICAgICAgICAgICAgICAgICAgICBcdC8vIHJlc3VtZSBwcmludGluZyBhIGRlY2ltYWwgbnVtYmVyXHJcbiAgICAgICAgICAgICAgICAgICAgXHR0aGlzLmV4ZWNNb2RlID0gRXhlY3V0aW9uTW9kZS5OdW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgXHR0aGlzLnByaW50aW5nRGlnaXQgPSBzdHViLmRlc3RBZGRyO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICBjYXNlIEdMVUxYX1NUVUIuUkVTVU1FX0hVRkZTVFI6XHJcbiAgICAgICAgICAgICAgICAgICAgXHQvLyByZXN1bWUgcHJpbnRpbmcgYSBjb21wcmVzc2VkIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgICAgIFx0dGhpcy5leGVjTW9kZSA9IEV4ZWN1dGlvbk1vZGUuQ29tcHJlc3NlZFN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICBcdHRoaXMucHJpbnRpbmdEaWdpdCA9IHN0dWIuZGVzdEFkZHI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHRcdFxyXG5cdFx0XHRcdCAgLy8gVE9ETzogdGhlIG90aGVyIHJldHVybiBtb2Rlc1xyXG5cdFx0XHRcdCAgZGVmYXVsdDpcclxuXHRcdFx0XHQgIFx0XHR0aHJvdyBuZXcgRXJyb3IoYHVuc3VwcG9ydGVkIHJldHVybiBtb2RlICR7c3R1Yi5kZXN0VHlwZX1gKTtcclxuXHRcdFx0ICB9XHJcblx0XHRcdCAgXHJcblx0XHRcdCAgdGhpcy5GUCA9IG5ld0ZQO1xyXG5cdFx0XHQgIHRoaXMuZnJhbWVMZW4gPSBuZXdGcmFtZUxlbjtcclxuXHRcdFx0ICB0aGlzLmxvY2Fsc1BvcyA9IG5ld0xvY2Fsc1BvcztcclxuXHRcdCAgfVx0XHQgIFxyXG5cdFx0ICBcclxuXHRcdCAgdGFrZUJyYW5jaChqdW1wVmVjdG9yOiBudW1iZXIpe1xyXG5cdFx0XHRcdGlmIChqdW1wVmVjdG9yID09PSAwIHx8IGp1bXBWZWN0b3IgPT09IDEpe1xyXG5cdFx0XHRcdFx0dGhpcy5sZWF2ZUZ1bmN0aW9uKGp1bXBWZWN0b3IpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dGhpcy5QQyArPSBqdW1wVmVjdG9yIC0gMjtcclxuXHRcdFx0XHR9XHJcblx0XHQgIH1cclxuXHRcdCAgXHJcblx0XHQgIHBlcmZvcm1DYWxsKGFkZHJlc3M6IG51bWJlciwgYXJnczogbnVtYmVyW10sIGRlc3RUeXBlOm51bWJlciwgZGVzdEFkZHI6IG51bWJlciwgc3R1YlBDOiBudW1iZXIsIHRhaWxDYWxsID0gZmFsc2Upe1xyXG5cdFx0XHQgIFx0Ly8gaW50ZXJjZXB0IHZlbmVlciBjYWxsc1xyXG5cdFx0XHRcdGxldCB2ZW5lZXIgPSB0aGlzLnZlbmVlclthZGRyZXNzXTtcclxuXHRcdFx0XHRpZiAodmVuZWVyKSB7XHJcblx0XHRcdFx0XHR0aGlzLnBlcmZvcm1EZWxheWVkU3RvcmUoZGVzdFR5cGUsIGRlc3RBZGRyLCB2ZW5lZXIuYXBwbHkodGhpcywgYXJncykpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQgIFxyXG5cdFx0XHRcdGlmICh0YWlsQ2FsbCl7XHJcblx0XHRcdFx0XHQvLyBwb3AgdGhlIGN1cnJlbnQgZnJhbWUgYW5kIHVzZSB0aGUgY2FsbCBzdHViIGJlbG93IGl0XHJcblx0XHRcdFx0XHR0aGlzLlNQID0gdGhpcy5GUDtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdC8vIHVzZSBhIG5ldyBjYWxsIHN0dWJcclxuXHRcdFx0XHRcdHRoaXMucHVzaENhbGxTdHViKGRlc3RUeXBlLCBkZXN0QWRkciwgc3R1YlBDLCB0aGlzLkZQKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRcdGxldCB0eXBlID0gdGhpcy5pbWFnZS5yZWFkQnl0ZShhZGRyZXNzKTtcclxuXHRcdFx0XHRpZiAodHlwZSA9PT0gQ2FsbFR5cGUuc3RhY2spe1xyXG5cdFx0XHRcdFx0dGhpcy5lbnRlckZ1bmN0aW9uKGFkZHJlc3MpO1xyXG5cdFx0XHRcdFx0aWYgKCFhcmdzKXtcclxuXHRcdFx0XHRcdFx0dGhpcy5wdXNoKDApO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGZvcihsZXQgaT1hcmdzLmxlbmd0aC0xOyBpPj0wOyBpLS0pXHJcblx0XHRcdFx0XHRcdFx0dGhpcy5wdXNoKGFyZ3NbaV0pO1xyXG5cdFx0XHRcdFx0XHR0aGlzLnB1c2goYXJncy5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gQ2FsbFR5cGUubG9jYWxTdG9yYWdlKXtcclxuXHRcdFx0XHRcdGlmICghYXJncykgeyBhcmdzID0gW10gfVxyXG5cdFx0XHRcdFx0dGhpcy5lbnRlckZ1bmN0aW9uKGFkZHJlc3MsIC4uLmFyZ3MpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZnVuY3Rpb24gY2FsbCB0eXBlICR7dHlwZX1gKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHQgIH1cclxuXHRcdCAgXHJcblx0XHQgIHN0cmVhbUNoYXJDb3JlKHg6IG51bWJlcil7XHJcblx0XHRcdCAgIHRoaXMuc3RyZWFtVW5pQ2hhckNvcmUoeCAmIDB4RkYpO1xyXG5cdFx0ICB9XHJcblx0XHQgIFxyXG5cdFx0ICBzdHJlYW1VbmlDaGFyQ29yZSh4OiBudW1iZXIpe1xyXG5cdFx0XHQgICAgaWYgKHRoaXMub3V0cHV0U3lzdGVtID09PSBJT1N5c3RlbS5GaWx0ZXIpe1xyXG5cdFx0XHRcdFx0dGhpcy5wZXJmb3JtQ2FsbCh0aGlzLmZpbHRlckFkZHJlc3MsIFsgeCBdLCBHTFVMWF9TVFVCLlNUT1JFX05VTEwsIDAsIHRoaXMuUEMsIGZhbHNlKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFNlbmRDaGFyVG9PdXRwdXQuY2FsbCh0aGlzLCB4KTtcclxuXHRcdFx0XHR9XHJcblx0XHQgIH1cclxuXHJcbiBcdFx0ICBzdHJlYW1OdW1Db3JlKHg6IG51bWJlcil7XHJcblx0XHRcdCAgICB4ID0geCB8IDA7XHJcblx0XHRcdCAgICBpZiAodGhpcy5vdXRwdXRTeXN0ZW0gPT09IElPU3lzdGVtLkZpbHRlcil7XHJcblx0XHRcdFx0XHR0aGlzLnB1c2hDYWxsU3R1YihHTFVMWF9TVFVCLlJFU1VNRV9GVU5DLCAwLCB0aGlzLlBDLCB0aGlzLkZQKTtcclxuXHRcdFx0XHRcdGxldCBudW0gPSB4LnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0XHR0aGlzLnBlcmZvcm1DYWxsKHRoaXMuZmlsdGVyQWRkcmVzcywgWyBudW0uY2hhckNvZGVBdCgwKSBdLCBHTFVMWF9TVFVCLlJFU1VNRV9OVU1CRVIsIDEsIHgsIGZhbHNlKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFNlbmRTdHJpbmdUb091dHB1dC5jYWxsKHRoaXMsIHgudG9TdHJpbmcoKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0ICB9XHJcblxyXG5cdFx0ICBzdHJlYW1TdHJDb3JlKGFkZHJlc3M6IG51bWJlcil7XHJcblx0XHRcdCAgaWYgKHRoaXMub3V0cHV0U3lzdGVtID09IElPU3lzdGVtLk51bGwpIHJldHVybjtcclxuXHRcdFx0ICBsZXQgdHlwZSA9IHRoaXMuaW1hZ2UucmVhZEJ5dGUoYWRkcmVzcyk7XHJcblx0XHRcdCAgXHJcblx0XHRcdCAgaWYgKHR5cGUgPT09IDB4RTEgJiYgIXRoaXMuZGVjb2RpbmdUYWJsZSlcclxuXHRcdFx0ICBcdFx0dGhyb3cgbmV3IEVycm9yKFwiTm8gc3RyaW5nIGRlY29kaW5nIHRhYmxlIGlzIHNldFwiKTtcclxuXHRcdFx0ICBcdFxyXG5cdFx0XHQgIC8vIFRPRE86IG5hdGl2ZSBkZWNvZGluZyB0YWJsZVxyXG5cdFx0XHQgIC8vIGZvciBub3csIGp1c3QgZmFsbCBiYWNrIHRvIHVzaW5nIEV4ZWN1dGlvbk1vZGUuQ29tcHJlc3NlZFN0cmluZ1x0ICBcclxuXHRcdFx0ICBsZXQgZmFsbGJhY2tFbmNvZGluZyA9ICh0eXBlID09PSAweEUxKTtcclxuXHRcdFx0ICBcclxuXHRcdFx0ICBpZiAodGhpcy5vdXRwdXRTeXN0ZW0gPT0gSU9TeXN0ZW0uRmlsdGVyIHx8IGZhbGxiYWNrRW5jb2Rpbmcpe1xyXG5cdFx0XHRcdCAgdGhpcy5wdXNoQ2FsbFN0dWIoR0xVTFhfU1RVQi5SRVNVTUVfRlVOQywgMCwgdGhpcy5QQywgdGhpcy5GUCk7XHJcblx0XHRcdFx0ICBzd2l0Y2godHlwZSl7XHJcblx0XHRcdFx0XHQgIGNhc2UgMHhFMDpcclxuXHRcdFx0XHRcdCAgXHR0aGlzLmV4ZWNNb2RlID0gRXhlY3V0aW9uTW9kZS5DU3RyaW5nO1xyXG5cdFx0XHRcdFx0XHR0aGlzLlBDID0gYWRkcmVzcysxO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0ICAgICAgY2FzZSAweEUxOlxyXG5cdFx0XHRcdFx0ICBcdHRoaXMuZXhlY01vZGUgPSBFeGVjdXRpb25Nb2RlLkNvbXByZXNzZWRTdHJpbmc7XHJcblx0XHRcdFx0XHRcdHRoaXMuUEMgPSBhZGRyZXNzKzE7XHJcblx0XHRcdFx0XHRcdHRoaXMucHJpbnRpbmdEaWdpdCA9IDA7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdCAgY2FzZSAweEUyOlxyXG5cdFx0XHRcdFx0ICBcdHRoaXMuZXhlY01vZGUgPSBFeGVjdXRpb25Nb2RlLlVuaWNvZGVTdHJpbmc7XHJcblx0XHRcdFx0XHRcdHRoaXMuUEMgPSBhZGRyZXNzKzQ7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdCAgZGVmYXVsdDpcclxuXHRcdFx0XHRcdCAgXHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc3RyaW5nIHR5cGUgJHt0eXBlfSBhdCAke2FkZHJlc3N9YCk7XHJcblx0XHRcdFx0ICB9XHJcblx0XHRcdCAgfVxyXG5cdFx0XHQgIFxyXG5cdFx0XHQgIHN3aXRjaCh0eXBlKXtcclxuXHRcdFx0XHQgIGNhc2UgMHhFMDpcclxuXHRcdFx0XHQgIFx0U2VuZFN0cmluZ1RvT3V0cHV0LmNhbGwodGhpcywgdGhpcy5pbWFnZS5yZWFkQ1N0cmluZyhhZGRyZXNzKzEpKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHQgIGRlZmF1bHQ6XHJcblx0XHRcdFx0XHQgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzdHJpbmcgdHlwZSAke3R5cGV9IGF0ICR7YWRkcmVzc31gKTtcclxuXHRcdFx0ICB9XHJcblx0XHQgIH1cclxuXHJcblxyXG5cdFx0ICAvLyAgU2VuZHMgdGhlIHF1ZXVlZCBvdXRwdXQgdG8gdGhlIE91dHB1dFJlYWR5IGV2ZW50IGhhbmRsZXIuXHJcbiAgICAgIFx0ICBwcml2YXRlIGRlbGl2ZXJPdXRwdXQoKXtcclxuXHRcdFx0IGlmICh0aGlzLm91dHB1dFJlYWR5KXtcclxuXHRcdFx0IFx0bGV0IHBhY2sgPSB0aGlzLm91dHB1dEJ1ZmZlci5mbHVzaCgpO1xyXG5cdFx0XHQgXHR0aGlzLm91dHB1dFJlYWR5KHBhY2spO1xyXG5cdFx0XHQgfVxyXG5cdFx0ICB9XHJcblx0XHQgIFxyXG5cdFx0ICBcclxuXHRcdCAgc2F2ZVRvUXVldHphbChkZXN0VHlwZSwgZGVzdEFkZHIpIDogUXVldHphbHtcclxuXHRcdFx0ICBcclxuXHRcdFx0ICBsZXQgcXVldHphbCA9IHRoaXMuaW1hZ2Uuc2F2ZVRvUXVldHphbCgpO1xyXG5cdFx0XHQgIFxyXG5cdFx0XHQgIC8vICdTdGtzJyBpcyB0aGUgY29udGVudHMgb2YgdGhlIHN0YWNrLCB3aXRoIGEgc3R1YiBvbiB0b3BcclxuICAgICAgICAgICAgICAvLyBpZGVudGlmeWluZyB0aGUgZGVzdGluYXRpb24gb2YgdGhlIHNhdmUgb3Bjb2RlLlxyXG4gICAgICAgICBcdCAgdGhpcy5wdXNoQ2FsbFN0dWIoZGVzdFR5cGUsIGRlc3RBZGRyLCB0aGlzLlBDLCB0aGlzLkZQKTtcclxuXHRcdFx0ICBsZXQgdHJpbW1lZCA9IHRoaXMuc3RhY2suY29weSgwLCB0aGlzLlNQKTtcclxuXHRcdFx0ICBxdWV0emFsLnNldENodW5rKCdTdGtzJywgdHJpbW1lZC5idWZmZXIpO1xyXG5cdFx0ICAgICAgdGhpcy5wb3BDYWxsU3R1YigpO1xyXG5cdFx0XHQgIFxyXG5cdFx0XHQgIC8vICdNQWxsJyBpcyB0aGUgbGlzdCBvZiBoZWFwIGJsb2Nrc1xyXG5cdFx0XHQgIGlmICh0aGlzLmhlYXApe1xyXG5cdFx0XHRcdCAgcXVldHphbC5zZXRDaHVuaygnTUFsbCcsIHRoaXMuaGVhcC5zYXZlKCkpO1xyXG5cdFx0XHQgIH1cclxuXHRcdFx0ICBcclxuXHRcdFx0ICByZXR1cm4gcXVldHphbDtcclxuXHRcdFx0ICBcclxuXHRcdCAgfVxyXG5cdFx0ICBcclxuXHRcdCAgbG9hZEZyb21RdWV0emFsKHF1ZXR6YWw6IFF1ZXR6YWwpe1xyXG5cdFx0XHQgIC8vIG1ha2Ugc3VyZSB0aGUgc2F2ZSBmaWxlIG1hdGNoZXMgdGhlIGdhbWUgZmlsZVxyXG4gICAgICAgICAgIFx0ICBsZXQgaWZoZDEgPSBuZXcgVWludDhBcnJheShxdWV0emFsLmdldElGaGRDaHVuaygpKTtcclxuXHRcdFx0ICBpZiAoaWZoZDEuYnl0ZUxlbmd0aCAhPT0gMTI4KXtcclxuXHRcdFx0ICBcdHRocm93IG5ldyBFcnJvcignTWlzc2luZyBvciBpbnZhbGlkIElGaGQgYmxvY2snKTtcclxuXHRcdFx0ICB9XHJcblx0XHRcdCAgbGV0IHtpbWFnZX0gPSB0aGlzO1xyXG5cdFx0XHQgIGZvciAobGV0IGk9MDsgaTwxMjg7IGkrKyl7XHJcblx0XHRcdFx0ICBpZiAoaWZoZDFbaV0gIT09IGltYWdlLnJlYWRCeXRlKGkpKVxyXG5cdFx0XHRcdCAgXHR0aHJvdyBuZXcgRXJyb3IoXCJTYXZlZCBnYW1lIGRvZXNuJ3QgbWF0Y2ggdGhpcyBzdG9yeSBmaWxlXCIpO1xyXG5cdFx0XHQgIH1cclxuXHRcdFx0ICAvLyBsb2FkIHRoZSBzdGFja1xyXG5cdFx0XHQgIGxldCBuZXdTdGFjayA9IHF1ZXR6YWwuZ2V0Q2h1bmsoXCJTdGtzXCIpO1xyXG5cdFx0XHQgIGlmICghbmV3U3RhY2spe1xyXG5cdFx0XHRcdCAgdGhyb3cgbmV3IEVycm9yKFwiTWlzc2luZyBTdGtzIGJsb2NrXCIpO1xyXG5cdFx0XHQgIH1cclxuXHRcdFx0ICB0aGlzLnN0YWNrLmJ1ZmZlci5zZXQobmV3IFVpbnQ4QXJyYXkobmV3U3RhY2spKTtcclxuXHRcdFx0ICB0aGlzLlNQID0gbmV3U3RhY2suYnl0ZUxlbmd0aDtcclxuXHRcdFx0ICAvLyByZXN0b3JlIFJBTVxyXG5cdFx0XHQgIGltYWdlLnJlc3RvcmVGcm9tUXVldHphbChxdWV0emFsKTtcclxuXHRcdFx0IFxyXG5cdFx0XHQgIC8vIHBvcCBhIGNhbGwgc3R1YiB0byByZXN0b3JlIHJlZ2lzdGVyc1xyXG5cdFx0XHQgIGxldCBzdHViID0gdGhpcy5wb3BDYWxsU3R1YigpO1xyXG5cdFx0XHQgIHRoaXMuUEMgPSBzdHViLlBDO1xyXG5cdFx0XHQgIHRoaXMuRlAgPSBzdHViLmZyYW1lUHRyO1xyXG5cdFx0XHQgIHRoaXMuZnJhbWVMZW4gPSB0aGlzLnN0YWNrLnJlYWRJbnQzMih0aGlzLkZQKTtcclxuXHRcdFx0ICB0aGlzLmxvY2Fsc1BvcyA9IHRoaXMuc3RhY2sucmVhZEludDMyKHRoaXMuRlAgKyA0KTtcclxuXHRcdFx0ICB0aGlzLmV4ZWNNb2RlID0gRXhlY3V0aW9uTW9kZS5Db2RlO1xyXG5cdFx0XHQgIFxyXG5cdFx0XHQgIC8vIHJlc3RvcmUgdGhlIGhlYXAgaWYgYXZhaWxhYmxlXHJcblx0XHRcdCAgbGV0IGhlYXBDaHVuayA9IHF1ZXR6YWwuZ2V0Q2h1bmsoXCJNQWxsXCIpO1xyXG5cdFx0XHQgIGlmIChoZWFwQ2h1bmspe1xyXG5cdFx0XHRcdCAgdGhpcy5oZWFwID0gSGVhcEFsbG9jYXRvci5yZXN0b3JlKGhlYXBDaHVuaywgaW1hZ2VbJ21lbW9yeSddKTtcclxuXHRcdFx0ICB9XHJcblx0XHRcdCAgLy8gZ2l2ZSB0aGUgb3JpZ2luYWwgc2F2ZSBvcGNvZGUgYSByZXN1bHQgb2YgLTFcclxuXHRcdFx0ICAvLyB0byBzaG93IHRoYXQgaXQncyBiZWVuIHJlc3RvcmVkXHJcblx0XHRcdCAgdGhpcy5wZXJmb3JtRGVsYXllZFN0b3JlKHN0dWIuZGVzdFR5cGUsIHN0dWIuZGVzdEFkZHIsIDB4RkZGRkZGRkYpO1xyXG5cdFx0ICB9XHJcblx0XHQgIFxyXG5cdFx0ICBcclxuXHJcbiAgICAgICAgIC8qKiAgUmVsb2FkcyB0aGUgaW5pdGlhbCBjb250ZW50cyBvZiBtZW1vcnkgKGV4Y2VwdCB0aGUgcHJvdGVjdGVkIGFyZWEpXHJcbiAgICAgICAgICogYW5kIHN0YXJ0cyB0aGUgZ2FtZSBvdmVyIGZyb20gdGhlIHRvcCBvZiB0aGUgbWFpbiBmdW5jdGlvbi5cclxuXHRcdCAqL1xyXG5cdFx0ICByZXN0YXJ0KCl7XHJcblx0XHRcdCAgdGhpcy5pbWFnZS5yZXZlcnQodGhpcy5wcm90ZWN0aW9uU3RhcnQsIHRoaXMucHJvdGVjdGlvbkxlbmd0aCk7XHJcblx0XHRcdCAgdGhpcy5ib290c3RyYXAoKTtcclxuXHRcdCAgfVxyXG5cdFx0ICBcclxuXHRcdCAgZnlyZUNhbGwoY2FsbCwgeCwgeSkgOiBhbnl7XHJcblx0XHRcdCAgaWYgKCF0aGlzLmVuYWJsZUZ5cmVWTSlcclxuXHRcdFx0ICBcdHRocm93IG5ldyBFcnJvcihgRnlyZVZNIGZ1bmN0aW9uYWxpdHkgaGFzIGJlZW4gZGlzYWJsZWRgKTtcclxuXHRcdFx0ICBzd2l0Y2goY2FsbCl7XHJcblx0XHRcdFx0ICBjYXNlIEZ5cmVDYWxsLlJlYWRMaW5lOlxyXG5cdFx0XHRcdCAgXHR0aGlzLmRlbGl2ZXJPdXRwdXQoKTtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmlucHV0TGluZSh4LCB5KTtcclxuXHRcdFx0XHQgIGNhc2UgRnlyZUNhbGwuUmVhZEtleTpcclxuXHRcdFx0XHQgIFx0dGhpcy5kZWxpdmVyT3V0cHV0KCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5pbnB1dENoYXIoKTtcclxuXHRcdFx0XHQgIGNhc2UgRnlyZUNhbGwuVG9Mb3dlcjpcclxuXHRcdFx0XHQgIFx0cmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUodWludDgoeCkpLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdCgwKTtcclxuXHRcdFx0XHQgIGNhc2UgRnlyZUNhbGwuVG9VcHBlcjpcclxuXHRcdFx0XHQgIFx0cmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUodWludDgoeCkpLnRvVXBwZXJDYXNlKCkuY2hhckNvZGVBdCgwKTtcclxuXHRcdFx0XHQgIGNhc2UgRnlyZUNhbGwuQ2hhbm5lbDpcclxuXHRcdFx0XHQgICAgeCA9IHRvQVNDSUkoeCk7XHJcblx0XHRcdFx0ICAgIHRoaXMub3V0cHV0QnVmZmVyLnNldENoYW5uZWwoeCk7XHJcblx0XHRcdFx0ICBcdHJldHVybjtcclxuXHRcdFx0XHQgIGNhc2UgRnlyZUNhbGwuU2V0VmVuZWVyOlxyXG5cdFx0XHRcdCAgXHQgIHJldHVybiBzZXRTbG90RnlyZS5jYWxsKHRoaXMsIHgsIHkpID8gMTogMDtcclxuXHRcdFx0XHQgIGNhc2UgRnlyZUNhbGwuU2V0U3R5bGU6XHJcblx0XHRcdFx0ICBcdC8vIGlnbm9yZVxyXG5cdFx0XHRcdFx0cmV0dXJuIDE7XHJcblx0XHRcdFx0ICBjYXNlIEZ5cmVDYWxsLlhNTEZpbHRlcjpcclxuXHRcdFx0XHQgIFx0Ly8gaWdub3JlXHJcblx0XHRcdFx0XHRyZXR1cm4gMTtcclxuXHRcdFx0XHQgIGRlZmF1bHQ6XHJcblx0XHRcdFx0ICBcdHRocm93IG5ldyBFcnJvcihgVW5yZWNvZ25pemVkIEZ5cmVWTSBzeXN0ZW0gY2FsbCAke2NhbGx9KCR7eH0sJHt5fSlgKTtcdCAgXHJcblx0XHRcdCAgfVxyXG5cdFx0ICB9XHJcblxyXG5cdFx0ICBwcml2YXRlIGlucHV0TGluZShhZGRyZXNzOiBudW1iZXIsIGJ1ZlNpemU6IG51bWJlcikgOiBzdHJpbmd7XHJcblx0XHRcdFx0Ly8gd2UgbmVlZCBhdCBsZWFzdCA0IGJ5dGVzIHRvIGRvIGFueXRoaW5nIHVzZWZ1bFxyXG5cdFx0XHRcdGlmIChidWZTaXplIDwgNCl7XHJcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oXCJidWZmZXIgc2l6ZSAke2J1ZlNpemV9IHRvIHNtYWxsIHRvIGlucHV0IGxpbmVcIik7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCB7aW1hZ2V9ID0gdGhpcztcclxuXHRcdFx0XHRsZXQgcmVzdW1lID0gdGhpcy5yZXN1bWVBZnRlcldhaXQuYmluZCh0aGlzKTtcclxuXHRcdFx0XHQvLyBjYW4ndCBkbyBhbnl0aGluZyB3aXRob3V0IHRoaXMgZXZlbnQgaGFuZGxlclxyXG4gICAgICAgICAgIFx0XHRpZiAoIXRoaXMubGluZVdhbnRlZCl7XHJcblx0XHRcdFx0XHR0aGlzLmltYWdlLndyaXRlSW50MzIoYWRkcmVzcywgMCk7XHQgICBcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gYXNrIHRoZSBhcHBsaWNhdGlvbiB0byByZWFkIGEgbGluZVxyXG5cdFx0XHRcdGxldCBjYWxsYmFjayA9IGZ1bmN0aW9uKGxpbmU6c3RyaW5nKXtcclxuXHRcdFx0XHRcdGlmIChsaW5lICYmIGxpbmUubGVuZ3RoKXtcclxuXHRcdFx0XHRcdFx0Ly8gVE9ETz8gaGFuZGxlIFVuaWNvZGVcclxuXHRcdFx0XHRcdFx0Ly8gd3JpdGUgdGhlIGxlbmd0aCBmaXJzdFxyXG5cdFx0XHRcdFx0XHRpbWFnZS53cml0ZUludDMyKGFkZHJlc3MsIGxpbmUubGVuZ3RoKTtcclxuXHRcdFx0XHRcdFx0Ly8gZm9sbG93ZWQgYnkgdGhlIGNoYXJhY3RlciBkYXRhLCB0cnVuY2F0ZWQgdG8gZml0IHRoZSBidWZmZXJcclxuICAgICAgICAgICAgIFx0XHQgICBcdGltYWdlLndyaXRlQVNDSUkoYWRkcmVzcyArIDQsIGxpbmUsIGJ1ZlNpemUgLSA0KTsgIFxyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGltYWdlLndyaXRlSW50MzIoYWRkcmVzcywgMCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXN1bWUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5saW5lV2FudGVkKGNhbGxiYWNrKTtcclxuXHRcdFx0XHRyZXR1cm4gJ3dhaXQnOyAgIFxyXG5cdFx0ICB9XHJcblx0XHQgIFxyXG5cdFx0ICBwcml2YXRlIGlucHV0Q2hhcigpOmFueXtcclxuXHRcdFx0ICAvLyBjYW4ndCBkbyBhbnl0aGluZyB3aXRob3V0IHRoaXMgZXZlbnQgaGFuZGxlclxyXG4gICAgICAgICAgIFx0ICBpZiAoIXRoaXMua2V5V2FudGVkKXtcclxuXHRcdFx0XHQgcmV0dXJuIDA7XHJcblx0XHRcdCAgfVxyXG5cdFx0XHQgIGxldCByZXN1bWUgPSB0aGlzLnJlc3VtZUFmdGVyV2FpdC5iaW5kKHRoaXMpO1xyXG5cdFx0XHQgIFxyXG5cdFx0XHQgIC8vIGFzayB0aGUgYXBwbGljYXRpb24gdG8gcmVhZCBhIGNoYXJhY3RlclxyXG5cdFx0XHQgIGxldCBjYWxsYmFjayA9IGZ1bmN0aW9uKGxpbmU6c3RyaW5nKXtcclxuXHRcdFx0XHRcdGlmIChsaW5lICYmIGxpbmUubGVuZ3RoKXtcclxuXHRcdFx0XHRcdFx0cmVzdW1lKFtsaW5lLmNoYXJDb2RlQXQoMCldKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRyZXN1bWUoWzBdKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdCAgdGhpcy5rZXlXYW50ZWQoY2FsbGJhY2spO1xyXG5cdFx0XHQgIHJldHVybiAnd2FpdCc7ICAgXHRcclxuXHRcdCAgfVxyXG5cdFx0ICBcclxuXHRcdCAgcHJpdmF0ZSByZXN1bWVBZnRlcldhaXRfcmVzdWx0VHlwZXMgOiBudW1iZXJbXTtcclxuXHRcdCAgcHJpdmF0ZSByZXN1bWVBZnRlcldhaXRfcmVzdWx0QWRkcnMgOiBudW1iZXJbXTtcclxuXHRcdCAgXHJcblx0XHQgIHByaXZhdGUgcmVzdW1lQWZ0ZXJXYWl0KHJlc3VsdD86IG51bWJlcltdKXtcclxuXHRcdFx0ICB0aGlzLmN5Y2xlID0gMDtcclxuXHRcdFx0ICB0aGlzLnN0YXJ0VGltZSA9IERhdGUubm93KCk7XHJcblx0XHRcdCAgaWYgKHJlc3VsdCl7XHJcblx0XHRcdFx0ICB0aGlzLnN0b3JlUmVzdWx0cyhudWxsLCB0aGlzLnJlc3VtZUFmdGVyV2FpdF9yZXN1bHRUeXBlcywgdGhpcy5yZXN1bWVBZnRlcldhaXRfcmVzdWx0QWRkcnMsIHJlc3VsdCApO1xyXG5cdFx0XHRcdCAgdGhpcy5yZXN1bWVBZnRlcldhaXRfcmVzdWx0QWRkcnMgPSB0aGlzLnJlc3VtZUFmdGVyV2FpdF9yZXN1bHRUeXBlcyA9IG51bGw7XHJcblx0XHRcdCAgfVxyXG5cdFx0XHQgIFxyXG5cdFx0XHQgIHdoaWxlICh0aGlzLnJ1bm5pbmcpe1xyXG5cdFx0XHRcdCAgaWYoIHRoaXMuc3RlcCgpID09PSAnd2FpdCcpXHJcblx0XHRcdFx0ICBcdCAgcmV0dXJuO1xyXG5cdFx0XHQgIH1cclxuXHRcdFx0ICBcclxuXHRcdFx0ICAvLyBzZW5kIGFueSBvdXRwdXQgdGhhdCBtYXkgYmUgbGVmdFxyXG5cdFx0XHQgIHRoaXMuZGVsaXZlck91dHB1dCgpO1xyXG5cdFx0ICB9XHJcblxyXG5cdH1cclxuXHRcdFxyXG59IiwiLy8gV3JpdHRlbiBpbiAyMDE1IGFuZCAyMDE2IGJ5IFRoaWxvIFBsYW56IFxyXG4vLyBUbyB0aGUgZXh0ZW50IHBvc3NpYmxlIHVuZGVyIGxhdywgSSBoYXZlIGRlZGljYXRlZCBhbGwgY29weXJpZ2h0IGFuZCByZWxhdGVkIGFuZCBuZWlnaGJvcmluZyByaWdodHMgXHJcbi8vIHRvIHRoaXMgc29mdHdhcmUgdG8gdGhlIHB1YmxpYyBkb21haW4gd29ybGR3aWRlLiBUaGlzIHNvZnR3YXJlIGlzIGRpc3RyaWJ1dGVkIHdpdGhvdXQgYW55IHdhcnJhbnR5LiBcclxuLy8gaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvcHVibGljZG9tYWluL3plcm8vMS4wL1xyXG5cclxuLyoqXHJcbiAqIEEgd3JhcHBlciBhcm91bmQgRW5naW5lIHRoYXQgY2FuIGJlIGNvbW11bmljYXRlc1xyXG4gKiB2aWEgc2ltcGxlIEpTT04tc2VyaWFsaXphYmxlIG1lc3NhZ2VzLlxyXG4gKiBcclxuICovXHJcblxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPSdFbmdpbmUudHMnIC8+XHJcbm1vZHVsZSBGeXJlVk17XHJcbiAgICBcclxuXHRleHBvcnQgY29uc3QgZW51bSBFbmdpbmVTdGF0ZSB7XHJcblx0XHRsb2FkZWQgPSAxLFxyXG5cdFx0cnVubmluZyA9IDIsXHJcblx0XHRjb21wbGV0ZWQgPSAxMDAsXHJcblx0XHRlcnJvciA9IC0xMDAsXHJcblx0XHJcblx0XHR3YWl0aW5nRm9yTGluZUlucHV0ID0gNTEsXHJcblx0XHR3YWl0aW5nRm9yS2V5SW5wdXQgPSA1MixcclxuXHRcdHdhaXRpbmdGb3JHYW1lU2F2ZWRDb25maXJtYXRpb24gPSA1MyxcclxuXHRcdHdhaXRpbmdGb3JMb2FkU2F2ZUdhbWUgPSA1NFx0XHJcblx0fVxyXG5cdFxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgRW5naW5lV3JhcHBlclN0YXRlIHtcclxuXHRcdHN0YXRlOiBFbmdpbmVTdGF0ZSxcclxuXHRcdGNoYW5uZWxEYXRhPzogQ2hhbm5lbERhdGEsXHJcblx0XHRlcnJvck1lc3NhZ2U/OiBzdHJpbmcsXHJcbiAgICAgICAgZ2FtZUJlaW5nU2F2ZWQ/OiBRdWV0emFsXHJcblx0fVxyXG5cdFxyXG5cdGV4cG9ydCBjbGFzcyBFbmdpbmVXcmFwcGVye1xyXG5cclxuXHRcdHByaXZhdGUgZW5naW5lOiBFbmdpbmVcclxuICAgICAgICBcclxuICAgICAgICBwcml2YXRlIGNhblNhdmVHYW1lcyA6IGJvb2xlYW5cclxuICAgICAgICBcclxuICAgICAgICBjb25zdHJ1Y3RvcihnYW1lSW1hZ2U6IE1lbW9yeUFjY2VzcywgY2FuU2F2ZUdhbWVzOiBib29sZWFuID0gZmFsc2Upe1xyXG4gICAgICAgICAgICB0aGlzLmNhblNhdmVHYW1lcyA9IGNhblNhdmVHYW1lc1xyXG4gICAgICAgICAgICBsZXQgZW5naW5lID0gdGhpcy5lbmdpbmUgPSBuZXcgRW5naW5lKG5ldyBVbHhJbWFnZShnYW1lSW1hZ2UpKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gc2V0IHVwIHRoZSBjYWxsYmFja3NcclxuICAgICAgICAgICAgZW5naW5lLm91dHB1dFJlYWR5ID0gXHJcbiAgICAgICAgICAgICAgICAoY2hhbm5lbERhdGEpID0+IHsgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFubmVsRGF0YSA9IGNoYW5uZWxEYXRhIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBlbmdpbmUua2V5V2FudGVkID1cclxuICAgICAgICAgICAgICAgIChjYikgPT4gdGhpcy53YWl0U3RhdGUoY2IsIEVuZ2luZVN0YXRlLndhaXRpbmdGb3JLZXlJbnB1dClcclxuICAgICAgICAgICAgZW5naW5lLmxpbmVXYW50ZWQgPVxyXG4gICAgICAgICAgICAgICAgKGNiKSA9PiB0aGlzLndhaXRTdGF0ZShjYiwgRW5naW5lU3RhdGUud2FpdGluZ0ZvckxpbmVJbnB1dClcclxuICAgICAgICAgICAgZW5naW5lLnNhdmVSZXF1ZXN0ZWQgPVxyXG4gICAgICAgICAgICAgICAgKHF1ZXR6YWwsIGNiKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNhblNhdmVHYW1lcykgeyByZXR1cm4gY2IoZmFsc2UpOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53YWl0U3RhdGUoY2IsIEVuZ2luZVN0YXRlLndhaXRpbmdGb3JHYW1lU2F2ZWRDb25maXJtYXRpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lQmVpbmdTYXZlZCA9IHF1ZXR6YWwgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgZW5naW5lLmxvYWRSZXF1ZXN0ZWQgPVxyXG4gICAgICAgICAgICAgICAgKGNiKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5jYW5TYXZlR2FtZXMpIHsgcmV0dXJuIGNiKG51bGwpOyB9IFxyXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLndhaXRTdGF0ZShjYiwgRW5naW5lU3RhdGUud2FpdGluZ0ZvckxvYWRTYXZlR2FtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8qKiBcclxuICAgICAgICAgKiBjb252ZW5pZW5jZSBtZXRob2QgdG8gY29uc3RydWN0IGZyb20gYW4gQXJyYXlCdWZmZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgbG9hZEZyb21BcnJheUJ1ZmZlcihhcnJheUJ1ZmZlcjogQXJyYXlCdWZmZXIsIGNhblNhdmVHYW1lczogYm9vbGVhbiA9IGZhbHNlKSA6IEVuZ2luZVdyYXBwZXIge1xyXG4gICAgICAgICAgICBsZXQgaW1hZ2UgPSBuZXcgRnlyZVZNLk1lbW9yeUFjY2VzcygwLDApXHJcbiAgICAgICAgICAgIGltYWdlLmJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKVxyXG5cdFx0ICAgIGltYWdlWydtYXhTaXplJ10gPSBhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRW5naW5lV3JhcHBlcihpbWFnZSwgY2FuU2F2ZUdhbWVzKVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb252ZW5pZW5jZSBtZXRob2QgdG8gY29uc3RydWN0IGZyb20gYSBGaWxlUmVhZGVyRXZlbnRcclxuICAgICAgICAgKiAod2hpY2ggaXMgc3VwcG9zZWQgdG8gaGF2ZSBiZWVuIHN1Y2Nlc3NmdWwpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGxvYWRGcm9tRmlsZVJlYWRlckV2ZW50KGV2LCBjYW5TYXZlR2FtZXM6IGJvb2xlYW4gPSBmYWxzZSkgOiBFbmdpbmVXcmFwcGVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIEVuZ2luZVdyYXBwZXIubG9hZEZyb21BcnJheUJ1ZmZlcihldi50YXJnZXRbJ3Jlc3VsdCddLCBjYW5TYXZlR2FtZXMpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAvKipcclxuICAgICAgICAgKiBjb252ZW5pZW5jZSBtZXRob2QgdG8gY29uc3RydWN0IGZyb20gYSBCYXNlNjQgZW5jb2RlZCBzdHJpbmcgY29udGFpbmluZyB0aGUgZ2FtZSBpbWFnZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXRpYyBsb2FkRnJvbUJhc2U2NChiYXNlNjQ6IHN0cmluZywgY2FuU2F2ZUdhbWVzOiBib29sZWFuID0gZmFsc2UpIDogRW5naW5lV3JhcHBlciB7XHJcbiAgICAgICAgICAgIHJldHVybiBFbmdpbmVXcmFwcGVyLmxvYWRGcm9tQXJyYXlCdWZmZXIoQmFzZTY0LnRvQnl0ZUFycmF5KGJhc2U2NCkuYnVmZmVyLCBjYW5TYXZlR2FtZXMpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIHdoZW4gdGhlIGVuZ2luZSByZXR1cm5zIGZyb20gcHJvY2Vzc2luZ1xyXG4gICAgICAgIC8vIChiZWNhdXNlIGl0IGlzIHdhaXRpbmcgZm9yIG1vcmUgaW5wdXQpXHJcbiAgICAgICAgLy8gaXQgd2lsbCBoYXZlIGludm9rZWQgb25lIG9mIHNldmVyYWwgY2FsbGJhY2tzXHJcbiAgICAgICAgLy8gd2UgdXNlIHRoZXNlIHRvIGNhbGN1bGF0ZSB0aGUgRW5naW5lU3RhdGVcclxuICAgICAgICAvLyBhbmQgc3RvcmUgdGhlIGNhbGxiYWNrIHVzZWQgdG8gcmVzdW1lIHByb2Nlc3NpbmdcclxuICAgICAgICBcclxuICAgIFx0cHJpdmF0ZSByZXN1bWVDYWxsYmFjaztcclxuICAgIFxyXG5cdFx0cHJpdmF0ZSBlbmdpbmVTdGF0ZTogRW5naW5lU3RhdGU7XHJcblx0ICAgIFxyXG4gICAgICAgIHByaXZhdGUgY2hhbm5lbERhdGE6IENoYW5uZWxEYXRhO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHByaXZhdGUgZ2FtZUJlaW5nU2F2ZWQ6IFF1ZXR6YWw7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSB3YWl0U3RhdGUocmVzdW1lQ2FsbGJhY2ssIHN0YXRlOiBFbmdpbmVTdGF0ZSl7XHJcbiAgICAgICAgICAgIHRoaXMucmVzdW1lQ2FsbGJhY2sgPSByZXN1bWVDYWxsYmFja1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZVN0YXRlID0gc3RhdGVcclxuICAgICAgICB9XHJcblx0XHRcclxuXHRcdFxyXG5cdFx0cnVuKCkgOiBFbmdpbmVXcmFwcGVyU3RhdGV7XHJcblx0XHRcdHRoaXMuZW5naW5lU3RhdGU9RW5naW5lU3RhdGUucnVubmluZztcclxuICAgICAgICAgICAgdGhpcy5lbmdpbmUucnVuKCk7XHJcblx0XHRcdHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSgpO1xyXG5cdFx0fVxyXG4gICAgICAgIFxyXG4gICAgICAgIHByaXZhdGUgY3VycmVudFN0YXRlKCkgOiBFbmdpbmVXcmFwcGVyU3RhdGUge1xyXG4gICAgICAgICAgICAvLyBjaGVjayBpZiB0aGUgZ2FtZSBpcyBvdmVyXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVuZ2luZVN0YXRlID09PSBFbmdpbmVTdGF0ZS5ydW5uaW5nXHJcbiAgICAgICAgICAgICAgJiYgISB0aGlzLmVuZ2luZVsncnVubmluZyddICl7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuZW5naW5lU3RhdGUgPSBFbmdpbmVTdGF0ZS5jb21wbGV0ZWQ7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgc3dpdGNoKHRoaXMuZW5naW5lU3RhdGUpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSBFbmdpbmVTdGF0ZS5jb21wbGV0ZWQ6XHJcbiAgICAgICAgICAgICAgICBjYXNlIEVuZ2luZVN0YXRlLndhaXRpbmdGb3JLZXlJbnB1dDpcclxuICAgICAgICAgICAgICAgIGNhc2UgRW5naW5lU3RhdGUud2FpdGluZ0ZvckxpbmVJbnB1dDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZTogdGhpcy5lbmdpbmVTdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbm5lbERhdGE6IHRoaXMuY2hhbm5lbERhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBFbmdpbmVTdGF0ZS53YWl0aW5nRm9yR2FtZVNhdmVkQ29uZmlybWF0aW9uOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiB0aGlzLmVuZ2luZVN0YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lQmVpbmdTYXZlZDogdGhpcy5nYW1lQmVpbmdTYXZlZFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgRW5naW5lU3RhdGUud2FpdGluZ0ZvckxvYWRTYXZlR2FtZTpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZTogdGhpcy5lbmdpbmVTdGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgVW5leHBlY3RlZCBlbmdpbmUgc3RhdGU6ICR7dGhpcy5lbmdpbmVTdGF0ZX1gKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiB0aGlzLmVuZ2luZVN0YXRlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cdFx0XHJcblx0XHRyZWNlaXZlTGluZShsaW5lOiBzdHJpbmcpIDogRW5naW5lV3JhcHBlclN0YXRle1xyXG5cdFx0XHRpZiAodGhpcy5lbmdpbmVTdGF0ZSAhPT0gRW5naW5lU3RhdGUud2FpdGluZ0ZvckxpbmVJbnB1dClcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIHN0YXRlLCBlbmdpbmUgaXMgbm90IHdhaXRpbmcgZm9yIGxpbmUgaW5wdXRcIik7XHJcblx0XHRcdHRoaXMuZW5naW5lU3RhdGUgPSBFbmdpbmVTdGF0ZS5ydW5uaW5nO1xyXG5cdFx0XHR0aGlzLnJlc3VtZUNhbGxiYWNrKGxpbmUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZWNlaXZlS2V5KGxpbmU6IHN0cmluZykgOiBFbmdpbmVXcmFwcGVyU3RhdGV7XHJcblx0XHRcdGlmICh0aGlzLmVuZ2luZVN0YXRlICE9PSBFbmdpbmVTdGF0ZS53YWl0aW5nRm9yS2V5SW5wdXQpXHJcblx0XHRcdCAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIHN0YXRlLCBlbmdpbmUgaXMgbm90IHdhaXRpbmcgZm9yIGtleSBpbnB1dFwiKTtcclxuXHJcblx0XHRcdHRoaXMuZW5naW5lU3RhdGUgPSBFbmdpbmVTdGF0ZS5ydW5uaW5nO1xyXG5cdFx0XHR0aGlzLnJlc3VtZUNhbGxiYWNrKGxpbmUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmVjZWl2ZVNhdmVkR2FtZShxdWV0emFsOiBRdWV0emFsKTogRW5naW5lV3JhcHBlclN0YXRle1xyXG5cdFx0XHRpZiAodGhpcy5lbmdpbmVTdGF0ZSAhPT0gRW5naW5lU3RhdGUud2FpdGluZ0ZvckxvYWRTYXZlR2FtZSlcclxuXHRcdFx0ICAgIHRocm93IG5ldyBFcnJvcihcIklsbGVnYWwgc3RhdGUsIGVuZ2luZSBpcyBub3Qgd2FpdGluZyBmb3IgYSBzYXZlZCBnYW1lIHRvIGJlIGxvYWRlZFwiKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0dGhpcy5lbmdpbmVTdGF0ZSA9IEVuZ2luZVN0YXRlLnJ1bm5pbmc7XHJcblx0XHRcdHRoaXMucmVzdW1lQ2FsbGJhY2socXVldHphbCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzYXZlR2FtZURvbmUoc3VjY2VzczogYm9vbGVhbikgOiBFbmdpbmVXcmFwcGVyU3RhdGV7XHJcblx0XHRcdGlmICh0aGlzLmVuZ2luZVN0YXRlICE9PSBFbmdpbmVTdGF0ZS53YWl0aW5nRm9yR2FtZVNhdmVkQ29uZmlybWF0aW9uKVxyXG5cdFx0XHQgICAgdGhyb3cgbmV3IEVycm9yKFwiSWxsZWdhbCBzdGF0ZSwgZW5naW5lIGlzIG5vdCB3YWl0aW5nIGZvciBhIGdhbWUgdG8gYmUgc2F2ZWRcIik7XHJcblx0XHRcdFx0XHJcblx0XHRcdHRoaXMuZ2FtZUJlaW5nU2F2ZWQgPSBudWxsO1xyXG5cdFx0XHR0aGlzLmVuZ2luZVN0YXRlID0gRW5naW5lU3RhdGUucnVubmluZztcclxuXHRcdFx0dGhpcy5yZXN1bWVDYWxsYmFjayhzdWNjZXNzKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Z2V0SUZoZCgpOiBVaW50OEFycmF5e1xyXG5cdFx0ICAgIHJldHVybiB0aGlzLmVuZ2luZVsnaW1hZ2UnXVsnbWVtb3J5J10uY29weSgwLCAxMjgpLmJ1ZmZlcjtcclxuXHRcdH1cclxuICAgICAgICBcclxuICAgICAgICBnZXRVbmRvU3RhdGUoKSA6IFF1ZXR6YWwge1xyXG4gICAgICAgICAgICBsZXQgdW5kb0J1ZmZlcnMgPSB0aGlzLmVuZ2luZVsndW5kb0J1ZmZlcnMnXTtcclxuICAgICAgICAgICAgaWYgKHVuZG9CdWZmZXJzICYmIHVuZG9CdWZmZXJzW3VuZG9CdWZmZXJzLmxlbmd0aC0xXSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kb0J1ZmZlcnNbdW5kb0J1ZmZlcnMubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb252ZW5pZW5jZSBtZXRob2QgdG8gcnVuIFwicmVzdG9yZVwiIGFuZCB0aGVuXHJcbiAgICAgICAgICogZmVlZCBpdCB0aGUgZ2l2ZW4gc2F2ZWdhbWVcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXN0b3JlU2F2ZUdhbWUocXVldHphbDogUXVldHphbCkgOiBFbmdpbmVXcmFwcGVyU3RhdGV7XHJcbiAgICAgICAgICAgIGxldCBzdGF0ZSA9IHRoaXMucmVjZWl2ZUxpbmUoXCJyZXN0b3JlXCIpXHJcbiAgICAgICAgICAgIGlmIChzdGF0ZS5zdGF0ZSAhPT0gRW5naW5lU3RhdGUud2FpdGluZ0ZvckxvYWRTYXZlR2FtZSlcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIklsbGVnYWwgc3RhdGUsIGVuZ2luZSBkaWQgbm90IHJlc3BvbmQgdG8gUkVTVE9SRSBjb21tYW5kXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWNlaXZlU2F2ZWRHYW1lKHF1ZXR6YWwpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnZlbmllbmNlIG1ldGhvZCB0byBydW4gXCJzYXZlXCJcclxuICAgICAgICAgKi9cclxuICAgICAgICBzYXZlR2FtZSgpIDogUXVldHphbCB7XHJcbiAgICAgICAgICAgIGxldCBzdGF0ZSA9IHRoaXMucmVjZWl2ZUxpbmUoXCJzYXZlXCIpXHJcbiAgICAgICAgICAgIGlmIChzdGF0ZS5zdGF0ZSAhPT0gRW5naW5lU3RhdGUud2FpdGluZ0ZvckdhbWVTYXZlZENvbmZpcm1hdGlvbilcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIklsbGVnYWwgc3RhdGUsIGVuZ2luZSBkaWQgbm90IHJlc3BvbmQgdG8gU0FWRSBjb21tYW5kXCIpO1xyXG4gICAgICAgICAgICBsZXQgZ2FtZSA9IHN0YXRlLmdhbWVCZWluZ1NhdmVkXHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZUdhbWVEb25lKHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybiBnYW1lXHJcbiAgICAgICAgfVxyXG5cdH1cclxufSIsIi8qXHJcbiBGeXJlVk1XZWIudHNcclxuXHJcbiBNYWluIE1vZHVsZSB0byBydW4gRnlyZVZNIHdlYiBlbmdpbmUgKGdsdWx4LXR5cGVzY3JpcHQpLlxyXG5cclxuIEV4cG9zZXMgT3V0cHV0UmVhZHkgZXZlbnQgZm9yIHdlYiBwYWdlIHRvIGdldCBkYXRhLlxyXG4gRXhwb3NlcyBzZW5kQ29tbWFuZCBmdW5jdGlvbiBmb3Igd2ViIHBhZ2VzIHRvIGV4ZWN1dGUgY29tbWFuZC5cclxuXHJcbiAqL1xyXG5cclxuIC8vLyA8cmVmZXJlbmNlIHBhdGg9J2dsdWx4LXR5cGVzY3JpcHQvY29yZS9FbmdpbmVXcmFwcGVyLnRzJyAvPlxyXG5cclxudmFyIGZ5cmV2bSA9IHt9O1xyXG5cclxuZnVuY3Rpb24gaXNFbnRlcktleShlKSB7XHJcbiAgICByZXR1cm4gZS5jb2RlID09IFwiRW50ZXJcIjtcclxufVxyXG5cclxubW9kdWxlIEZ5cmVWTVdlYiB7XHJcblxyXG4gICAgZXhwb3J0IGVudW0gU3RhdGVzIHtcclxuICAgICAgICBJTklULFxyXG4gICAgICAgIFJFU1RPUkVfU0VTU0lPTixcclxuICAgICAgICBORVdfU0VTU0lPTixcclxuICAgICAgICBXQUlUSU5HX0ZPUl9LRVksXHJcbiAgICAgICAgV0FJVElOR19GT1JfTElORSxcclxuICAgICAgICBDT01NQU5ELFxyXG4gICAgICAgIFNBVkUsXHJcbiAgICAgICAgVVBEQVRFX1NFU1NJT05cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZW51bSBTdG9yeVN0YXR1cyB7XHJcbiAgICAgICAgQ09OVElOVUUsXHJcbiAgICAgICAgRU5ERURcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgTWFuYWdlciB7XHJcblxyXG4gICAgICAgIENoYW5uZWxEYXRhOiBGeXJlVk0uQ2hhbm5lbERhdGE7XHJcbiAgICAgICAgU3RhdGU6IFN0YXRlcztcclxuICAgICAgICBTdGF0dXM6IFN0b3J5U3RhdHVzO1xyXG4gICAgICAgIE91dHB1dFJlYWR5OiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIElucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSB3cmFwcGVyOiBGeXJlVk0uRW5naW5lV3JhcHBlcjtcclxuICAgICAgICBwcml2YXRlIGNvbnRlbnREZWZpbml0aW9uOiBzdHJpbmdbXTtcclxuICAgICAgICBwcml2YXRlIGlmaWQ6IHN0cmluZztcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBTZXRTdGF0ZShzdGF0ZTogU3RhdGVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuU3RhdGUgPSBzdGF0ZTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaChzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZXMuSU5JVDpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGVzLk5FV19TRVNTSU9OOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuTmV3U2Vzc2lvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZXMuUkVTVE9SRV9TRVNTSU9OOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuUmVzdG9yZVNlc3Npb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGVzLldBSVRJTkdfRk9SX0xJTkU6XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFN0YXRlcy5DT01NQU5EOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuU2VuZENvbW1hbmQodGhpcy5JbnB1dEVsZW1lbnQudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZXMuU0FWRTpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlNhdmVHYW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBMb2FkU3RvcnkodXJsOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuSW5wdXRFbGVtZW50ID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJGeXJlVk0uTWFuYWdlci5JbnB1dEVsZW1lbnQgbXVzdCBiZSBkZWZpbmVkIGJlZm9yZSBsb2FkaW5nIGEgc3RvcnkuXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuSW5wdXRFbGVtZW50Lm9ua2V5cHJlc3MgPSAoZSk9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5TdGF0ZSA9PSBTdGF0ZXMuV0FJVElOR19GT1JfS0VZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5TZXRTdGF0ZShTdGF0ZXMuQ09NTUFORCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuU3RhdGUgPT0gU3RhdGVzLldBSVRJTkdfRk9SX0xJTkUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzIHx8IGlzRW50ZXJLZXkoZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TZXRTdGF0ZShTdGF0ZXMuQ09NTUFORCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICByZWFkZXIub3BlbignR0VUJywgdXJsKTtcclxuICAgICAgICAgICAgcmVhZGVyLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XHJcbiAgICAgICAgICAgIHJlYWRlci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVhZGVyLnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndyYXBwZXIgPSBGeXJlVk0uRW5naW5lV3JhcHBlci5sb2FkRnJvbUFycmF5QnVmZmVyKHJlYWRlci5yZXNwb25zZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJ1biA9IHRoaXMud3JhcHBlci5ydW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlByb2Nlc3NSZXN1bHQocnVuKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLlNldFN0YXRlKFN0YXRlcy5JTklUKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZWFkZXIuc2VuZCgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIEdldFNhdmVEYXRhKCkge1xyXG4gICAgICAgICAgICBsZXQgc2F2ZUtleSA9IHRoaXMuU2F2ZUtleSgpO1xyXG4gICAgICAgICAgICBsZXQgc2F2ZURhdGEgPSBsb2NhbFN0b3JhZ2Vbc2F2ZUtleV07XHJcbiAgICAgICAgICAgIGlmIChzYXZlRGF0YSkgeyBzYXZlRGF0YSA9IEpTT04ucGFyc2Uoc2F2ZURhdGEpOyB9XHJcbiAgICAgICAgICAgIHJldHVybiBzYXZlRGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgSW5pdCgpIHtcclxuICAgICAgICAgICAgbGV0IHNhdmVEYXRhID0gdGhpcy5HZXRTYXZlRGF0YSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzYXZlRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5TZXRTdGF0ZShTdGF0ZXMuTkVXX1NFU1NJT04pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5TZXRTdGF0ZShTdGF0ZXMuUkVTVE9SRV9TRVNTSU9OKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBOZXdTZXNzaW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgc2F2ZUtleSA9IHRoaXMuU2F2ZUtleSgpO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Vbc2F2ZUtleV0gPSBKU09OLnN0cmluZ2lmeSh0aGlzLk5ld1NhdmVHYW1lKCkpO1xyXG4gICAgICAgICAgICB0aGlzLlVwZGF0ZVR1cm5EYXRhKCk7XHJcbiAgICAgICAgICAgIHRoaXMuT3V0cHV0UmVhZHkoKTtcclxuICAgICAgICAgICAgdGhpcy5TZXRTdGF0ZShTdGF0ZXMuV0FJVElOR19GT1JfTElORSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIFJlc3RvcmVTZXNzaW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy53cmFwcGVyLnJlY2VpdmVMaW5lKCdyZXN0b3JlJyk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdGUgIT0gRnlyZVZNLkVuZ2luZVN0YXRlLndhaXRpbmdGb3JMb2FkU2F2ZUdhbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHJlc3RvcmluZyBzYXZlZCBnYW1lJywgcmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5Mb2FkU2F2ZWRHYW1lKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnN0YXRlICE9IEZ5cmVWTS5FbmdpbmVTdGF0ZS53YWl0aW5nRm9yTGluZUlucHV0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciByZXN0b3Jpbmcgc2F2ZWQgZ2FtZScsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuU2V0U3RhdGUoU3RhdGVzLldBSVRJTkdfRk9SX0xJTkUpO1xyXG4gICAgICAgICAgICB0aGlzLlVwZGF0ZVR1cm5EYXRhKCk7XHJcbiAgICAgICAgICAgIHRoaXMuT3V0cHV0UmVhZHkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBQcm9jZXNzUmVzdWx0KHJlc3VsdDogRnlyZVZNLkVuZ2luZVdyYXBwZXJTdGF0ZSkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmNoYW5uZWxEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNoYW5uZWxEYXRhID0gcmVzdWx0LmNoYW5uZWxEYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuVXBkYXRlQ29udGVudCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBTZW5kQ29tbWFuZChjb21tYW5kOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5VcGRhdGVDb21tYW5kKGNvbW1hbmQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjb21tYW5kKTtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMud3JhcHBlci5yZWNlaXZlTGluZShjb21tYW5kKTtcclxuICAgICAgICAgICAgdGhpcy5Qcm9jZXNzQ29tbWFuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIFByb2Nlc3NDb21tYW5kKHJlc3VsdDogRnlyZVZNLkVuZ2luZVdyYXBwZXJTdGF0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLlN0YXR1cyA9IEZ5cmVWTVdlYi5TdG9yeVN0YXR1cy5DT05USU5VRTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuUHJvY2Vzc1Jlc3VsdChyZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuU3RhdGUgPT0gU3RhdGVzLkNPTU1BTkQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuVXBkYXRlU3RvcnkocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuVXBkYXRlVHVybkRhdGEoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuT3V0cHV0UmVhZHkoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAocmVzdWx0LnN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEZ5cmVWTS5FbmdpbmVTdGF0ZS53YWl0aW5nRm9yS2V5SW5wdXQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuU3RhdGUgPT0gU3RhdGVzLkNPTU1BTkQpIHsgdGhpcy5TZXRTdGF0ZShTdGF0ZXMuU0FWRSk7IH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHsgdGhpcy5TZXRTdGF0ZShTdGF0ZXMuV0FJVElOR19GT1JfS0VZKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBGeXJlVk0uRW5naW5lU3RhdGUud2FpdGluZ0ZvckxpbmVJbnB1dDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5TdGF0ZSA9PSBTdGF0ZXMuQ09NTUFORCkgeyB0aGlzLlNldFN0YXRlKFN0YXRlcy5TQVZFKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgeyB0aGlzLlNldFN0YXRlKFN0YXRlcy5XQUlUSU5HX0ZPUl9MSU5FKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBGeXJlVk0uRW5naW5lU3RhdGUuY29tcGxldGVkOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuU3RhdHVzID0gRnlyZVZNV2ViLlN0b3J5U3RhdHVzLkVOREVEO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBGeXJlVk0uRW5naW5lU3RhdGUud2FpdGluZ0ZvckxvYWRTYXZlR2FtZTpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkxvYWRTYXZlZEdhbWUoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgRnlyZVZNLkVuZ2luZVN0YXRlLndhaXRpbmdGb3JHYW1lU2F2ZWRDb25maXJtYXRpb246XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5VcGRhdGVTYXZlZEdhbWUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBOZXdTYXZlR2FtZSgpIHtcclxuICAgICAgICAgICAgbGV0IHN0b3J5SW5mbyA9IEpTT04ucGFyc2UodGhpcy5DaGFubmVsRGF0YVsnSU5GTyddKTtcclxuICAgICAgICAgICAgbGV0IGlmaWQgPSB0aGlzLkdldElGSUQoKTtcclxuICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSBgPGI+VGl0bGU6IDwvYj4ke3N0b3J5SW5mb1snc3RvcnlUaXRsZSddfTxici8+XHJcbiAgICAgICAgICAgICAgICA8Yj5IZWFkbGluZTogPC9iPiR7c3RvcnlJbmZvWydzdG9yeUhlYWRsaW5lJ119YDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzdG9yeToge1xyXG4gICAgICAgICAgICAgICAgICAgICdpZmlkJzogaWZpZCxcclxuICAgICAgICAgICAgICAgICAgICAndGl0bGUnOiBzdG9yeUluZm9bJ3N0b3J5VGl0bGUnXSxcclxuICAgICAgICAgICAgICAgICAgICAnc3RvcnlJbmZvJzogc3RvcnlJbmZvLFxyXG4gICAgICAgICAgICAgICAgICAgICdzdG9yeUZpbGUnOiAnJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdzZXNzaW9ucyc6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdzZXNzaW9uJzogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3R1cm5zJzogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ICd0dXJuJzogMSwgJ2NvbW1hbmQnOiAnJywgJ2NvbnRlbnQnOiBjb250ZW50IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGEnOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgU2F2ZUdhbWUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuUHJvY2Vzc0NvbW1hbmQodGhpcy53cmFwcGVyLnJlY2VpdmVMaW5lKCdzYXZlJykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBMb2FkU2F2ZWRHYW1lKCkge1xyXG4gICAgICAgICAgICBsZXQgc2F2ZURhdGEgPSB0aGlzLkdldFNhdmVEYXRhKCk7XHJcbiAgICAgICAgICAgIGxldCB0dXJucyA9IHNhdmVEYXRhWydzZXNzaW9ucyddWzBdWyd0dXJucyddO1xyXG4gICAgICAgICAgICBsZXQgc2F2ZUdhbWVEYXRhID0gc2F2ZURhdGFbJ3Nlc3Npb25zJ11bMF1bJ2RhdGEnXVt0dXJuc11bJ2RhdGEnXTtcclxuICAgICAgICAgICAgbGV0IHF1ZXR6YWxEYXRhID0gRnlyZVZNLlF1ZXR6YWwubG9hZChCYXNlNjQudG9CeXRlQXJyYXkoc2F2ZUdhbWVEYXRhKSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndyYXBwZXIucmVjZWl2ZVNhdmVkR2FtZShxdWV0emFsRGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIFVwZGF0ZVNhdmVkR2FtZShyZXN1bHQpIHtcclxuICAgICAgICAgICAgbGV0IHNhdmVLZXkgPSB0aGlzLlNhdmVLZXkoKTtcclxuICAgICAgICAgICAgbGV0IHNhdmVEYXRhU3RyID0gbG9jYWxTdG9yYWdlW3NhdmVLZXldO1xyXG4gICAgICAgICAgICBsZXQgc2F2ZURhdGEgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzYXZlRGF0YVN0cikge1xyXG4gICAgICAgICAgICAgICAgc2F2ZURhdGEgPSB0aGlzLk5ld1NhdmVHYW1lKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzYXZlRGF0YSA9IEpTT04ucGFyc2Uoc2F2ZURhdGFTdHIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgdHVybnMgPSBzYXZlRGF0YVsnc2Vzc2lvbnMnXVswXVsndHVybnMnXTtcclxuICAgICAgICAgICAgc2F2ZURhdGFbJ3Nlc3Npb25zJ11bMF1bJ2RhdGEnXVt0dXJuc10gPSB7XHJcbiAgICAgICAgICAgICAgICAndHVybic6IHR1cm5zLCAnZGF0YSc6IHJlc3VsdC5nYW1lQmVpbmdTYXZlZC5iYXNlNjRFbmNvZGUoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlW3NhdmVLZXldID0gSlNPTi5zdHJpbmdpZnkoc2F2ZURhdGEpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5Qcm9jZXNzQ29tbWFuZCh0aGlzLndyYXBwZXIuc2F2ZUdhbWVEb25lKHRydWUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgTG9hZFNlc3Npb24oKSB7XHJcbiAgICAgICAgICAgIGxldCBzYXZlS2V5ID0gdGhpcy5TYXZlS2V5KCk7XHJcbiAgICAgICAgICAgIGxldCBzYXZlRGF0YSA9IGxvY2FsU3RvcmFnZVtzYXZlS2V5XTtcclxuICAgICAgICAgICAgc2F2ZURhdGEgPSBKU09OLnBhcnNlKHNhdmVEYXRhKTtcclxuICAgICAgICAgICAgbGV0IHNlc3Npb24gPSBzYXZlRGF0YVsnc2Vzc2lvbnMnXVswXTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlc3Npb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIFNhdmVTZXNzaW9uKHNlc3Npb24pIHtcclxuICAgICAgICAgICAgbGV0IHNhdmVLZXkgPSB0aGlzLlNhdmVLZXkoKTtcclxuICAgICAgICAgICAgbGV0IHNhdmVEYXRhID0gbG9jYWxTdG9yYWdlW3NhdmVLZXldO1xyXG4gICAgICAgICAgICBzYXZlRGF0YSA9IEpTT04ucGFyc2Uoc2F2ZURhdGEpO1xyXG4gICAgICAgICAgICBzYXZlRGF0YVsnc2Vzc2lvbnMnXVswXSA9IHNlc3Npb247XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVtzYXZlS2V5XSA9IEpTT04uc3RyaW5naWZ5KHNhdmVEYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgVXBkYXRlQ29tbWFuZChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgIGxldCBzZXNzaW9uID0gdGhpcy5Mb2FkU2Vzc2lvbigpO1xyXG5cclxuICAgICAgICAgICAgc2Vzc2lvblsndHVybnMnXSsrO1xyXG5cclxuICAgICAgICAgICAgc2Vzc2lvblsnY29udGVudCddLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdHVybjogc2Vzc2lvblsndHVybnMnXSxcclxuICAgICAgICAgICAgICAgIGNvbW1hbmQ6IGNvbW1hbmQsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiAnJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuU2F2ZVNlc3Npb24oc2Vzc2lvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIFVwZGF0ZVN0b3J5KHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmNoYW5uZWxEYXRhICYmIHJlc3VsdC5jaGFubmVsRGF0YVsnTUFJTiddKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudCA9IHJlc3VsdC5jaGFubmVsRGF0YVsnTUFJTiddO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlc3Npb24gPSB0aGlzLkxvYWRTZXNzaW9uKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHVybiA9IHNlc3Npb25bJ3R1cm5zJ107XHJcbiAgICAgICAgICAgICAgICBzZXNzaW9uWydjb250ZW50J11bdHVybi0xXVsnY29udGVudCddID0gY29udGVudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuU2F2ZVNlc3Npb24oc2Vzc2lvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgVXBkYXRlVHVybkRhdGEoKSB7XHJcbiAgICAgICAgICAgIGxldCBzYXZlS2V5ID0gdGhpcy5TYXZlS2V5KCk7XHJcbiAgICAgICAgICAgIGxldCBzYXZlRGF0YSA9IGxvY2FsU3RvcmFnZVtzYXZlS2V5XTtcclxuICAgICAgICAgICAgaWYgKCFzYXZlRGF0YSkgeyByZXR1cm47IH1cclxuICAgICAgICAgICAgc2F2ZURhdGEgPSBKU09OLnBhcnNlKHNhdmVEYXRhKTtcclxuICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSBzYXZlRGF0YVsnc2Vzc2lvbnMnXVswXVsnY29udGVudCddO1xyXG4gICAgICAgICAgICBmeXJldm1bJ2NvbnRlbnQnXSA9IGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIFNhdmVLZXkoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkdldElGSUQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgR2V0SUZJRCgpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlmaWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWZpZCA9IHRoaXMuQ2hhbm5lbERhdGFbJ0lGSUQnXS5yZXBsYWNlKC9cXC8vZywgJycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlmaWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIEdldENoYW5uZWxOYW1lKHg6bnVtYmVyKXtcclxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoXHJcbiAgICAgICAgICAgICAgICB4ID4+IDI0LFxyXG4gICAgICAgICAgICAgICAgKHggPj4gMTYpICYgMHhGRixcclxuICAgICAgICAgICAgICAgICh4ID4+IDgpICYgMHhGRixcclxuICAgICAgICAgICAgICAgIHggJiAweEZGKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgVXBkYXRlQ29udGVudCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuQ2hhbm5lbERhdGFbXCJDTUdUXCJdICE9IHVuZGVmaW5lZCB8fCB0aGlzLmNvbnRlbnREZWZpbml0aW9uICE9IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyBXZSBvbmx5IGdldCB0aGUgY29udGVudCBkZWZpbml0aW9uIG9uIGZpcnN0IHR1cm4uLi4gKG1heSBuZWVkIHRvIHJldmlzaXQgdGhpcylcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250ZW50RGVmaW5pdGlvbiA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnREZWZpbml0aW9uID0gSlNPTi5wYXJzZSh0aGlzLkNoYW5uZWxEYXRhW1wiQ01HVFwiXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgY2hhbm5lbE5hbWUgaW4gdGhpcy5DaGFubmVsRGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBjaD0wOyBjaCA8IHRoaXMuY29udGVudERlZmluaXRpb24ubGVuZ3RoOyBjaCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGFubmVsRGVmID0gdGhpcy5jb250ZW50RGVmaW5pdGlvbltjaF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGFuTmFtZSA9IHRoaXMuR2V0Q2hhbm5lbE5hbWUoY2hhbm5lbERlZlsnaWQnXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGFuTmFtZSA9PSBjaGFubmVsTmFtZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoY2hhbm5lbERlZlsnY29udGVudFR5cGUnXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0ZXh0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ5cmV2bVtjaGFubmVsRGVmWydjb250ZW50TmFtZSddXSA9IHRoaXMuQ2hhbm5lbERhdGFbY2hhbm5lbE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ5cmV2bVtjaGFubmVsRGVmWydjb250ZW50TmFtZSddXSA9IE51bWJlcih0aGlzLkNoYW5uZWxEYXRhW2NoYW5uZWxOYW1lXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJqc29uXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ5cmV2bVtjaGFubmVsRGVmWydjb250ZW50TmFtZSddXSA9IEpTT04ucGFyc2UodGhpcy5DaGFubmVsRGF0YVtjaGFubmVsTmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiY3NzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ5cmV2bVtjaGFubmVsRGVmWydjb250ZW50TmFtZSddXSA9IHRoaXMuQ2hhbm5lbERhdGFbY2hhbm5lbE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=