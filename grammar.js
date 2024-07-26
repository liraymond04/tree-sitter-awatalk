/* eslint-disable require-jsdoc */
module.exports = grammar({
  name: 'awatalk',

  extras: $ => [
    /[^ awaAWA]+/, // Ignore all characters that are not part of " awa" or "awa" patterns
  ],

  rules: {
    source_file: $ => seq(
      /awa/i,
      repeat(
        choice(
          $.label,
          $.instruction,
        ),
      ),
    ),

    label: $ => $.lbl,

    instruction: $ => field('op', choice(
      $.nop,
      $.prn,
      $.pr1,
      $.red,
      $.r3d,
      $.blo,
      $.sbm,
      $.p0p,
      $.dpl,
      $.srn,
      $.mrg,
      $.add,
      $.sub,
      $.mul,
      $.div,
      $.cnt,
      // $.lbl,
      $.jmp,
      $.eql,
      $.lss,
      $.gr8,
      $.lib,
      $.trm,
    )),

    // standard awa5.0
    nop: $ => seq(...mapHex($, '0x00')),
    prn: $ => seq(...mapHex($, '0x01')),
    pr1: $ => seq(...mapHex($, '0x02')),
    red: $ => seq(...mapHex($, '0x03')),
    r3d: $ => seq(...mapHex($, '0x04')),
    blo: $ => seq(...mapHex($, '0x05'), field('arg', $.argument_8bit)),
    sbm: $ => seq(...mapHex($, '0x06'), field('arg', $.argument_5bit)),
    p0p: $ => seq(...mapHex($, '0x07')),
    dpl: $ => seq(...mapHex($, '0x08')),
    srn: $ => seq(...mapHex($, '0x09'), field('arg', $.argument_5bit)),
    mrg: $ => seq(...mapHex($, '0x0A')),
    add: $ => seq(...mapHex($, '0x0B')),
    sub: $ => seq(...mapHex($, '0x0C')),
    mul: $ => seq(...mapHex($, '0x0D')),
    div: $ => seq(...mapHex($, '0x0E')),
    cnt: $ => seq(...mapHex($, '0x0F')),
    lbl: $ => seq(...mapHex($, '0x10'), field('arg', $.argument_5bit)),
    jmp: $ => seq(...mapHex($, '0x11'), field('arg', $.argument_5bit)),
    eql: $ => seq(...mapHex($, '0x12')),
    lss: $ => seq(...mapHex($, '0x13')),
    gr8: $ => seq(...mapHex($, '0x14')),
    trm: $ => seq(...mapHex($, '0x1F')),

    // awa5_rs instructions
    lib: $ => seq(...mapHex($, '0x17')),

    argument_8bit: $ => seq(...mapBits($, 8)),

    argument_5bit: $ => seq(...mapBits($, 5)),

    binary_token: $ => choice(
      $.zero,
      $.one,
    ),

    // TODO: allow ignored characters in-between token chars
    // currently, ignored characters are allowed between tokens,
    // but if put inside of a token, will not be recognized
    zero: $ => / awa/i,

    one: $ => /wa/i,
  },
});

function mapHex($, hexNumber) {
  const binaryString = parseInt(hexNumber, 16).toString(2).padStart(5, '0');

  const sequence = [];
  for (const char of binaryString) {
    if (char === '0') {
      sequence.push($.zero);
    } else {
      sequence.push($.one);
    }
  }

  return sequence;
};

function mapBits($, bits) {
  const sequence = [];

  for (let i = 0; i < bits; i++) {
    sequence.push($.binary_token);
  }

  return sequence;
}
