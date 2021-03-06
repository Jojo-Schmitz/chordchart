//=============================================================================
//  MuseScore
//  Linux Music Score Editor
//  $Id:$
//
//  Chord Chart plugin
//
//  Copyright (C)2008 Werner Schweer and others
//  Copyright (C)2012 Marc Sabatella & Joachim Schmitz
//
//  This program is free software; you can redistribute it and/or modify
//  it under the terms of the GNU General Public License version 2.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program; if not, write to the Free Software
//  Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
//=============================================================================

//
//    This is ECMAScript code (ECMA-262 aka "Java Script")
//

//---------------------------------------------------------
//    init
//    this function will be called on startup of
//    mscore
//---------------------------------------------------------

function init()
{
}

var chordTypes = [
            1,   2,   3,   4,   5,   6,   7,   8,   9,
      10,  11,  12,  13,  14,  15,  16,  17,  18,  19,
      20,  21,  22,  23,  24,  25,  26,  27,  28,  29,
                32,  33,  34,
      40,
                                    56,  57,  58,  59,
      60,                 64,  65,  66,  67,  68,  69,
      70,       72,  73,  74,  75,  76,  77,  78,  79,
      80,  81,  82,  83,  84,  85,  86,  87,  88,  89,
      90,  91,  92,  93,  94,  95,  96,  97,  98,  99,
     100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
     110, 111, 112, 113,
                                             128, 129,
     130, 131, 132, 133, 134, 135, 136, 137, 138, 139,
     140, 141, 142, 143, 144, 145, 146, 147, 148, 149,
     150, 151, 152, 153, 154, 155, 156, 157, 158, 159,
     160, 161, 162, 163, 164, 165, 166, 167, 168, 169,
     170, 171, 172, 173, 174, 175, 176, 177,
                         184, 185, 186, 187, 188, 189,
     190, 191, 192, 193, 194, 195, 196, 197, 198, 199,
     200, 201, 202, 203, 204, 205, 206, 207,
     210, 211, 212, 213, 214, 215, 216, 217,
     220, 221, 222, 223,
     230,
     240, 241
      ];

function addChord(i, score, cursor, duration)
{
      var chord      = new Chord(score);
      chord.tickLen  = duration;
      cursor.add(chord);

      var note       = new Note(score);
      note.pitch     = 60 // C4, good for basing chord on.
      note.visible   = false; // Hide note head for now
      note.velocity  = 1; // and make it pretty silent.
      chord.addNote(note); // Needed for chord.addHarmony() to work.
      chord.noStem   = true; // Hide stem for now.

      var h  = new Harmony(score);
      h.root = note.tpc;
      h.id   = chordTypes[i];
      chord.addHarmony(h);

      var text = new Text(score);
      text.text = "ID " + h.id;
      text.yOffset = 5;
      cursor.putStaffText(text);
}

function run()
{
      var chordStyle = QFileDialog.getOpenFileName(this,
	   "MuseScore: Chord Style file", "styles", "XML file (*.xml)");
      if(! chordStyle)
            return;
            
      var score   = new Score();
      score.name  = "chordchart"; // Doesn't work, nor is documented anymore.
      score.title = "Chord Chart"; // Gets overwritten a few lines down.
      score.appendPart("");

      var fi = new QFileInfo(chordStyle);
      score.title = fi.baseName();
      score.setStyle("chordDescriptionFile", chordStyle);
      score.setStyle("lastSystemFillLimit", 0.0);

      var n = chordTypes.length;
      var systems = Math.floor((n + 7) / 8); // 8 chords per line
      var measures = systems * 8; // in 8 measures each, so 1 per measure
      score.appendMeasures(measures);
      var cursor = new Cursor(score);
      cursor.staff = 0;
      cursor.voice = 0;
      cursor.rewind();

      for (var i = 0; i < n; ++i) {
            addChord(i, score, cursor, 480*4); // 480 == quarter note (crochet)
            cursor.next();
      }

      cursor.rewind();
      var i = 1;
      while (!cursor.eos()) {
            var m = cursor.measure();
            if (i % 8 == 0) { // Line break every 8 measures.
                  m.lineBreak = true;
            } else { // Really needed? Shouldn't harm though.
                  m.lineBreak = false;
            }
            cursor.nextMeasure();
            i++;
      }
}

//---------------------------------------------------------
//    menu:  defines were the function will be placed
//           in the menu structure
//---------------------------------------------------------

var mscorePlugin = {
      menu: 'Plugins.Lead Sheet.Create Chord Chart',
      init: init,
      run:  run
};

mscorePlugin;
