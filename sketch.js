let lines;
let rg;
let font, sound;
let counter1 = 0;
let monkey_no = 0;
let crying_counter = 0;
let should_change = false;
let should_cry = false;
let current_lines_recorded = true;
let y_open, y_half, y_closed, b_open, b_half, b_closed, l1, l2, r1, r2;
let y_t = [];
let b_t = [];
let current_img;
let current_eye_c = 'y';
let crying_trigger = [];
let redtext_trigger = [];
let bigtext_trigger = [];
let redtext_list = [];
let bigtext_list = [];
let checked_monkey = [];
let loaded = false;
let t_s = 18;
let image_s = [];
let save_button, tweet_button;
let l_arrow, r_arrow;
let gra;
let last5lines = [];
let displaying_lines = 0;
class Button {
  constructor(name, x, y, ts, fo) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.ts = ts * 0.8;
    this.f = fo;
  }

  cursor_in() {
    push();
    textFont(this.f);
    textSize(this.ts);
    let w = textWidth(this.name) * 1.1;
    let h = (textAscent() + textDescent()) * 1.1;
    pop();
    return (mouseX > this.x - w / 2 && mouseX < this.x + w / 2 && mouseY > this.y - h / 2 && mouseY < this.y + h / 2);
  }

  display() {
    let w = textWidth(this.name) * 1.1;
    let h = (textAscent() + textDescent()) * 1.1;
    if (this.cursor_in()) {
      push();
      rectMode(CENTER);
      fill(255);
      noStroke();
      textSize(this.ts);
      textFont(this.f);
      rect(this.x, this.y, w, h);
      fill(0);
      for (let i = 0; i < 200; i++) {
        let tem = random([
          [random(this.x - w / 2, this.x + w / 2), this.y - h / 2],
          [random(this.x - w / 2, this.x + w / 2), this.y + h / 2],
          [this.x - w / 2, random(this.y - h / 2, this.y + h / 2)],
          [this.x + w / 2, random(this.y - h / 2, this.y + h / 2)]
        ]);
        let d = random(3);
        ellipse(tem[0], tem[1], d);
      }
      textAlign(CENTER, CENTER);
      text(this.name, this.x, this.y);
      pop();
    } else {
      push();
      textAlign(CENTER, CENTER);
      textSize(this.ts);
      textFont(this.f);
      fill(255);
      text(this.name, this.x, this.y);
      pop();
    }
  }

  update(input1, input2, input3) {
    this.x = input1;
    this.ts = input2 * 0.8;
    this.y = input3;
  }
} // the <button> element is too ugly

class Arrow_button {
  constructor(direction, x, y, w, h) {
    this.direction = direction;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  cursor_in() {
    return (mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2);
  }

  display() {
    let i1, i2;
    push();
    imageMode(CENTER);
    if (this.direction == 'left') {
      i1 = l1;
      i2 = l2;
    } else if (this.direction == 'right') {
      i1 = r1;
      i2 = r2;
    }
    if (this.cursor_in()) {
      if (millis() % 500 < 250) {
        image(i1, this.x, this.y, this.w, this.h);
      } else {
        image(i2, this.x, this.y, this.w, this.h);
      }
    } else {
      image(i1, this.x, this.y, this.w, this.h);
    }
    pop();
  }

  update(in1, in2, in3, in4) {
    this.x = in1;
    this.y = in2;
    this.w = in3;
    this.h = in4;
  }
}

function preload() {
  font = loadFont("carbon_type.ttf");
  sound = loadSound("typewriter.mp3");
  sound.rate(2);
  //A font by Vic Fieger and a sound from freesound.org by pakasit21
  y_open = loadImage("y_open.jpg");
  y_half = loadImage("y_half.jpg");
  y_closed = loadImage("y_closed.jpg");
  b_open = loadImage("b_open.jpg");
  b_half = loadImage("b_half.jpg");
  b_closed = loadImage("b_closed.jpg");
  l1 = loadImage("l1.png");
  l2 = loadImage("l2.png");
  r1 = loadImage("r1.png");
  r2 = loadImage("r2.png");
  for (let i = 0; i < 7; i++) {
    let tem1 = "y_tear" + str(i + 1) + ".jpg";
    let tem2 = "b_tear" + str(i + 1) + ".jpg";
    y_t[i] = loadImage(tem1);
    b_t[i] = loadImage(tem2);
  }
  //something I draw
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  t_s = max(18, width / 70);
  frameRate(24);
  background(0);
  textFont(font);
  textSize(t_s);
  textAlign(CENTER);
  rectMode(CENTER);
  imageMode(CENTER);
  fill(255);
  noStroke();
  current_img = y_open;
  rg = new RiGrammar();
  rg.loadFrom("grammar.json", rg_ready);
  lines = ["Click", "To", "Check", "How the Apes Are Doing"];
  crying_trigger = ["tear", "cry", "sadly", "mourn", "sob", "crying", "sobing", "Sadly,", "tear,", "sad", "tears"];
  redtext_trigger = ["blood", "red", "rose", "Rosy", "rosy", "Red", "roses"];
  bigtext_trigger = ["big", "huge", "oversize", "large", "Big", "Large", "Huge"];
  image_size = [max(current_img.width / 2, current_img.width * (height * 0.375) / current_img.height), max(current_img.height / 2, height * 0.375)];
  save_button = new Button("Download This", max(width / 3, ((width - image_size[0]) / 2 + image_size[0] / 6)), height * 9 / 10, t_s, font);
  tweet_button = new Button("Tweet This", min(width * 2 / 3, width - ((width - image_size[0]) / 2 + image_size[0] / 6)), height * 9 / 10, t_s, font);
  l_arrow = new Arrow_button("left", lerp(0, max(width / 3, ((width - image_size[0]) / 2 + image_size[0] / 6)), 0.4), height * 9 / 10, max(75, width / 35), max(75 * 0.66, width / 35 * 0.66));
  r_arrow = new Arrow_button("right", min(width * 2 / 3, width - ((width - image_size[0]) / 2 + image_size[0] / 6)) + lerp(0, max(width / 3, ((width - image_size[0]) / 2 + image_size[0] / 6)), 0.6), height * 9 / 10, max(75, width / 35), max(75 * 0.66, width / 35 * 0.66));
}

function draw() {
  textSize(t_s);
  background(0, 150);
  let img_y = height / 2 - image_size[1] / 2;
  image(current_img, width / 2, img_y, image_size[0], image_size[1]);
  fill(255);
  if (should_change) {
    if (counter1 <= 24) {
      let output = rg.expand();
      let tem = output.split("%");
      for (let i = 0; i < lines.length; i++) {
        lines[i] = tem[i];
      }
      monkey_no = int(random(100000));
      norepeat();
      blinking();
      //main_display(lines);
    } else {
      if (current_eye_c == 'y') {
        current_eye_c = 'b';
      } else if (current_eye_c == 'b') {
        current_eye_c = 'y';
      }
      let tem = split(lines[0], " ");
      checked_monkey.push([monkey_no, tem[2]]);
      should_change = false;
      sound.stop();
    }
    counter1++;
  } else {
    if (lines[0] == "Click") {
      check_should_cry(lines);
    } else {
      check_should_cry(last5lines[last5lines.length - 1 + displaying_lines]);
    }
    if (should_cry) {
      crying();
    }
  }

  if (!current_lines_recorded && lines[0] != "Click") {
    let t = join(lines, '@');
    last5lines.push(split(t, '@'));
    if (last5lines.length > 5) {
      last5lines.shift();
    }
    current_lines_recorded = true;
  }

  if (loaded) {
    if (lines[0] == "Click" || should_change) {
      main_display(lines);
    } else {
      main_display(last5lines[last5lines.length - 1 + displaying_lines]);
    }
  } else {
    if (millis() % 900 < 300) {
      text("loading the interface.  ", width / 2, height / 2 + t_s);
    } else if (millis() % 900 < 600) {
      text("loading the interface.. ", width / 2, height / 2 + t_s);
    } else {
      text("loading the interface...", width / 2, height / 2 + t_s);
    }
  }
  //console.log(last5lines[0] + '@' + last5lines[1]+'@'+last5lines.length);
  if (lines[0].length > 6) {
    save_button.display();
    tweet_button.display();
    if (displaying_lines > -(last5lines.length - 1)) {
      l_arrow.display();
    }
    r_arrow.display();
  }
}

function mouseClicked() {
  if (window.screen.availWidth >= 1280) {
    if (!sound.isPlaying() && loaded) {
      if (save_button.cursor_in() && lines[0].length > 6) {
        downl(last5lines[last5lines.length - 1 + displaying_lines]);
      } else if (tweet_button.cursor_in() && lines[0].length > 6) {
        //sorry = true;
        tweet(last5lines[last5lines.length - 1 + displaying_lines]);
      } else if (l_arrow.cursor_in() && lines[0].length > 6 && displaying_lines > -(last5lines.length - 1)) {
        displaying_lines--;
        should_cry = false;
        should_change = true;
        sound.play();
        counter1 = 0;
        crying_counter = 0;
      } else if (r_arrow.cursor_in() && lines[0].length > 6) {
        if (displaying_lines < 0) {
          displaying_lines++;
          should_cry = false;
          should_change = true;
          sound.play();
          counter1 = 0;
          crying_counter = 0;
        } else {
          should_change = true;
          should_cry = false;
          current_lines_recorded = false;
          crying_counter = 0;
          counter1 = 0;
          sound.play();
        }
      } else if (lines[0] == "Click") {
        should_change = true;
        should_cry = false;
        crying_counter = 0;
        current_lines_recorded = false;
        counter1 = 0;
        sound.play();
      }
    }
  }
}

function touchEnded() {
  if (window.screen.availWidth < 1280) {
    if (!sound.isPlaying() && loaded) {
      if (save_button.cursor_in() && lines[0].length > 6) {
        downl(last5lines[last5lines.length - 1 + displaying_lines]);
      } else if (tweet_button.cursor_in() && lines[0].length > 6) {
        //sorry = true;
        tweet(last5lines[last5lines.length - 1 + displaying_lines]);
      } else if (l_arrow.cursor_in() && lines[0].length > 6 && displaying_lines > -(last5lines.length - 1)) {
        displaying_lines--;
        should_cry = false;
        should_change = true;
        sound.play();
        counter1 = 0;
        crying_counter = 0;
      } else if (r_arrow.cursor_in() && lines[0].length > 6) {
        if (displaying_lines < 0) {
          displaying_lines++;
          should_cry = false;
          should_change = true;
          sound.play();
          counter1 = 0;
          crying_counter = 0;
        } else {
          should_change = true;
          should_cry = false;
          current_lines_recorded = false;
          crying_counter = 0;
          counter1 = 0;
          sound.play();
        }
      } else if (lines[0] == "Click") {
        should_change = true;
        should_cry = false;
        crying_counter = 0;
        current_lines_recorded = false;
        counter1 = 0;
        sound.play();
      }
    }
  }
} // to support mobile devices 

//though on my phone mouseClicked works well but one of my friends found it didn't work on her iphone X so I add the touchEnded function

// I use the available screen width to distinguish device type. I know that's tricky but I believe that nowadays no more computer is runing at resolution < 1280*800 (in fact, if so, the touchEnded function would still work in many browsers anyway, just a little bit different) and normal phones do not have a 4k screen (and fortunately, if those 4k phones are running Andriod, the mouseClicked function would work in most cases)

function blinking() {
  if (current_eye_c == 'y') {
    if (counter1 < 6) {
      current_img = y_half;
    } else if (counter1 < 12) {
      current_img = y_closed;
    } else if (counter1 < 18) {
      current_img = b_half;
    } else if (counter1 < 24) {
      current_img = b_open;
    }
  }

  if (current_eye_c == 'b') {
    if (counter1 < 6) {
      current_img = b_half;
    } else if (counter1 < 12) {
      current_img = b_closed;
    } else if (counter1 < 18) {
      current_img = y_half;
    } else if (counter1 < 24) {
      current_img = y_open;
    }
  }
}

//when the gennerated text contains certain worlds, crying animation play
function crying() {
  if (current_eye_c == 'y') {
    if (crying_counter < 6) {

    } else if (crying_counter < 12) {
      current_img = y_t[0];
    } else if (crying_counter < 18) {
      current_img = y_t[1];
    } else if (crying_counter < 24) {
      current_img = y_t[2];
    } else if (crying_counter % 24 < 6) {
      current_img = y_t[3];
    } else if (crying_counter % 24 < 12) {
      current_img = y_t[6];
    } else if (crying_counter % 24 < 18) {
      current_img = y_t[4];
    } else if (crying_counter % 24 >= 18) {
      current_img = y_t[5];
    }
  } else if (current_eye_c == 'b') {
    if (crying_counter < 6) {

    } else if (crying_counter < 12) {
      current_img = b_t[0];
    } else if (crying_counter < 18) {
      current_img = b_t[1];
    } else if (crying_counter < 24) {
      current_img = b_t[2];
    } else if (crying_counter % 24 < 6) {
      current_img = b_t[3];
    } else if (crying_counter % 24 < 12) {
      current_img = b_t[6];
    } else if (crying_counter % 24 < 18) {
      current_img = b_t[4];
    } else if (crying_counter % 24 >= 18) {
      current_img = b_t[5];
    }
  }
  crying_counter++;
}

function rg_ready() {
  loaded = true;
} // sometimes it's slow to load the strings

function line1w5(n) {
  if (n % 10 == 1 && n % 100 != 11) {
    return "st";
  } else if (n % 10 == 2 && n % 100 != 12) {
    return "nd";
  } else if (n % 10 == 3 && n % 100 != 13) {
    return "rd";
  } else {
    return "th";
  }
}

function recheck_monkeys() {
  if (checked_monkey.length > 99) {
    let tem = checked_monkey.reverse();
    tem.pop();
    checked_monkey = tem.reverse();
  }
}

function norepeat() {
  let tem = split(lines[0], ' ');
  for (let i = 0; i < checked_monkey.length; i++) {
    while (monkey_no == checked_monkey[i][0] && tem[2] == checked_monkey[i][1]) {
      monkey_no = int(random(100000));
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  t_s = max(18, width / 70);
  image_size = [max(current_img.width / 2, current_img.width * (height * 0.375) / current_img.height), max(current_img.height / 2, height * 0.375)];
  save_button.update(max(width / 3, ((width - image_size[0]) / 2 + image_size[0] / 6)), t_s, height * 9 / 10);
  tweet_button.update(min(width * 2 / 3, width - ((width - image_size[0]) / 2 + image_size[0] / 6)), t_s, height * 9 / 10);
  l_arrow.update(lerp(0, max(width / 3, ((width - image_size[0]) / 2 + image_size[0] / 6)), 0.4), height * 9 / 10, max(75, width / 35), max(75 * 0.66, width / 35 * 0.66));
  r_arrow.update(min(width * 2 / 3, width - ((width - image_size[0]) / 2 + image_size[0] / 6)) + lerp(0, max(width / 3, ((width - image_size[0]) / 2 + image_size[0] / 6)), 0.6), height * 9 / 10, max(75, width / 35), max(75 * 0.66, width / 35 * 0.66));
}

function tweet(inp) {
  let url = "https://twitter.com/intent/tweet?text=" + join(inp, "%0D%0A") + "%0D%0A" + "By Electronic Typing Monkey @ https://johncheung.feedia.co"
  window.open(url);
}

function downl(inp) {
  let tem = split(inp[0], ' ');
  let n = tem[2] + " work.png";
  if (tem[0] != "Click") {
    gra = createGraphics(1280, 720);
    gra.background(0);
    gra.textFont(font);
    gra.textSize(t_s);
    gra.textAlign(CENTER);
    gra.rectMode(CENTER);
    gra.imageMode(CENTER);
    gra.fill(255);
    gra.noStroke();
    let img_y = gra.height / 2 - current_img.height / 4;
    let should_c = false;
    for (let i = 0; i < inp.length; i++) {
      let redline = false;
      let bigline = false;
      let gra_red_list = [];
      let gra_big_list = [];
      for (let i = 0; i < inp.length; i++) {
        for (let j = 0; j < crying_trigger.length; j++) {
          let tem = split(inp[i], ' ');
          for (let k = 0; k < tem.length; k++) {
            if (tem[k] == crying_trigger[j]) {
              should_c = true;
              break;
            }
          }
        }
      }
      for (let j = 0; j < redtext_trigger.length; j++) {
        let tem = split(inp[i], ' ');
        for (let k = 0; k < tem.length; k++) {
          if (tem[k] == redtext_trigger[j]) {
            gra_red_list.push(k);
            redline = true;
          }
        }
      }
      for (let j = 0; j < bigtext_trigger.length; j++) {
        let tem = split(inp[i], ' ');
        for (let k = 0; k < tem.length; k++) {
          if (tem[k] == bigtext_trigger[j]) {
            gra_big_list.push(k);
            bigline = true;
          }
        }
      }
      for (let j = 0; j < gra_red_list.length; j++) {
        let word_index = gra_red_list[j];
        if (redline) {
          let tem = split(inp[i], ' ');
          let space_num = tem[word_index].length;
          let space = [];
          for (let l = 0; l < space_num; l++) {
            space.push(' ');
          }
          let new_tem = concat(concat(tem.slice(0, word_index), join(space, "")), tem.slice(word_index + 1, tem.length));
          let new_line = join(new_tem, ' ');
          gra.text(new_line, gra.width / 2, gra.height / 2 + t_s + i * 60);
          let w = textWidth(join(concat(tem.slice(0, word_index), ''), ' '));
          let w2 = textWidth(new_line);
          gra.push();
          gra.textFont(font);
          gra.textAlign(LEFT);
          gra.textSize(t_s);
          gra.fill(255, 50, 50);
          gra.noStroke();
          gra.text(tem[word_index], (gra.width - w2) / 2 + w, gra.height / 2 + t_s + i * 60);
          gra.pop();
        }
      }
      for (let j = 0; j < gra_big_list.length; j++) {
        let word_index = gra_big_list[j];
        if (bigline) {
          let tem = split(inp[i], ' ');
          let space_num = tem[word_index].length * 1.5;
          let space = [];
          for (let l = 0; l < space_num; l++) {
            space.push(' ');
          }
          let new_tem = concat(concat(tem.slice(0, word_index), join(space, "")), tem.slice(word_index + 1, tem.length));
          let new_line = join(new_tem, ' ');
          gra.text(new_line, gra.width / 2, gra.height / 2 + t_s + i * 60);
          let w = textWidth(join(concat(tem.slice(0, word_index), ''), ' '));
          let w2 = textWidth(new_line);
          gra.push();
          gra.textFont(font);
          gra.textAlign(LEFT);
          gra.textSize(1.5 * t_s);
          gra.noStroke();
          gra.text(tem[word_index], (gra.width - w2) / 2 + w, gra.height / 2 + t_s + i * 60);
          gra.pop();
        }
      }
      if (!bigline && !redline && i != 0) {
        gra.text(inp[i], gra.width / 2, gra.height / 2 + t_s + i * 60);
      } else if (i == 0) {
        gra.push();
        //textSize(20);
        gra.text(inp[i], gra.width / 2, gra.height / 2 + t_s + i * 60);
        gra.pop();
      }
    }
    let pic;
    if (should_c) {
      pic = random([y_t[5], y_t[6], b_t[5], b_t[6]]);
    } else {
      pic = random([b_open, y_open]);
    }
    gra.image(pic, gra.width / 2, img_y, image_size[0], image_size[1]);
    gra.textSize(15);
    gra.textAlign(RIGHT, BOTTOM);
    gra.text("John C 2020", gra.width - 20, gra.height - 10);
    gra.text("Electronic Typing Monkey", gra.width - 20, gra.height - 30);
    gra.textFont('Arial');
    gra.text("©", gra.width - 150, gra.height - 10);
    save(gra, n);
    gra.remove();
  }
} // this function will create and save a image sized 1280*720 nomatter what size the current window is

function check_should_cry(inp) {
  for (let i = 0; i < inp.length; i++) {
    for (let j = 0; j < crying_trigger.length; j++) {
      let tem = split(inp[i], ' ');
      for (let k = 0; k < tem.length; k++) {
        if (tem[k] == crying_trigger[j]) {
          should_cry = true;
          break;
        }
      }
    }
  }
}

function main_display(inp) {
  for (let i = 0; i < inp.length; i++) {
    let redline = false;
    let bigline = false;
    let red_list = [];
    let big_list = [];
    for (let j = 0; j < redtext_trigger.length; j++) {
      let tem = split(inp[i], ' ');
      for (let k = 0; k < tem.length; k++) {
        if (tem[k] == redtext_trigger[j]) {
          red_list.push(k);
          redline = true;
        }
      }
    }
    for (let j = 0; j < bigtext_trigger.length; j++) {
      let tem = split(inp[i], ' ');
      for (let k = 0; k < tem.length; k++) {
        if (tem[k] == bigtext_trigger[j]) {
          big_list.push(k);
          bigline = true;
        }
      }
    }
    for (let j = 0; j < red_list.length; j++) {
      let word_index = red_list[j];
      if (redline) {
        let tem = split(inp[i], ' ');
        let space_num = tem[word_index].length;
        let space = [];
        for (let l = 0; l < space_num; l++) {
          space.push(' ');
        }
        let new_tem = concat(concat(tem.slice(0, word_index), join(space, "")), tem.slice(word_index + 1, tem.length));
        let new_line = join(new_tem, ' ');
        text(new_line, width / 2, height / 2 + t_s + i * 60);
        let w = textWidth(join(concat(tem.slice(0, word_index), ''), ' '));
        let w2 = textWidth(new_line);
        push();
        textFont(font);
        textAlign(LEFT);
        textSize(t_s);
        fill(255, 50, 50);
        noStroke();
        text(tem[word_index], (width - w2) / 2 + w, height / 2 + t_s + i * 60);
        pop();
      }
    }
    for (let j = 0; j < big_list.length; j++) {
      let word_index = big_list[j];
      if (bigline) {
        let tem = split(inp[i], ' ');
        let space_num = tem[word_index].length * 1.5;
        let space = [];
        for (let l = 0; l < space_num; l++) {
          space.push(' ');
        }
        let new_tem = concat(concat(tem.slice(0, word_index), join(space, "")), tem.slice(word_index + 1, tem.length));
        let new_line = join(new_tem, ' ');
        text(new_line, width / 2, height / 2 + t_s + i * 60);
        let w = textWidth(join(concat(tem.slice(0, word_index), ''), ' '));
        let w2 = textWidth(new_line);
        push();
        textFont(font);
        textAlign(LEFT);
        textSize(1.5 * t_s);
        noStroke();
        text(tem[word_index], (width - w2) / 2 + w, height / 2 + t_s + i * 60);
        pop();
      }
    }
    if (!bigline && !redline && i != 0) {
      text(inp[i], width / 2, height / 2 + t_s + i * 60);
    } else if (i == 0) {
      push();
      //textSize(20);
      text(inp[i], width / 2, height / 2 + t_s + i * 60);
      pop();
    }
  }
}