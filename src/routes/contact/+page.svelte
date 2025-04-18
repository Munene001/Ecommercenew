<script>
  
  import coImage from "$lib/images/ecomabout.jpg?enhanced";
  import Icon from "@iconify/svelte";
  
</script>



<div class="contactuno">
  <enhanced:img src={coImage} alt="background image" class="back-img">
  </enhanced:img>
</div>
<div class="conthead">
  <div class="minmumhead">Contact with us</div>
  <div class="midhead">Get In Touch</div>
  <div class="maximumhead">
    In hac habitasse platea dictumst. Pellentesque viverra sem nec orci lacinia,
    in bibendum urna mollis. Quisque nunc lacus, varius vel leo a, pretium
    lobortis metus.
  </div>
</div>
<div class="contactsec2">
  <div class="section1">
    <div class="shortinput">
      <div class="input">
        <label for="name">Your name*</label>
        <input type="name" id="name" name="name" required />
      </div>
      <div class="input" style="margin-left:30px">
        <label for="email">Your email*</label>
        <input type="name" id="name" name="name" required />
      </div>
    </div>
    <div class="inputmid">
      <label for="subject">Subject*</label>
      <input type="subject" id="subject" name="subject" required />
    </div>
    <div class="textarea">
      <label for="Your message">Your message*</label>
      <textarea id="message" name="message" required></textarea>
    </div>
    <button class="submit">Send Message</button>
  </div>

  <div class="section2">
    <div class="store">
      <div class="iconif"><Icon icon="streamline:store-1" /></div>
      <div class="text">
        <b>Cloyta store</b> <br /><br /> Kenya -785 15h street, office 478/B
        <br />
        Green Mall Nairobi<br /><br /> phone: +254715067768<br /> email:
        <span style="color:#f04f43; ;">lawrencemunenex@gmail.com</span>
      </div>
    </div>
    <div class="hours">
      <div class="iconify">
        <Icon icon="material-symbols:door-open-outline" />
      </div>
      <div class="actualhours">
        <b>Opening Hours</b><br />
        <span
          >Monday-Saturday : 8am - 6pm<span
            ><br />
            <span>Weekend closed</span>
          </span></span
        >
      </div>
    </div>
  </div>
</div>
<div class="location">
  <iframe
   title="Cloyta shop, Acra road, greenmall room 3B firstfloor"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3396.7278495292544!2d36.82431287496564!3d-1.2830223987047777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f112a25055c17%3A0xa30249a429100045!2sAccra%20Rd%2C%20Nairobi!5e1!3m2!1sen!2ske!4v1731365829431!5m2!1sen!2ske"
    width="100%"
    height="420px"
    style="border:0;"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
  ></iframe>
</div>


<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
  .contactuno {
    height: 310px;
    max-width: 100%;
    background-size: cover;
  }
  .back-img {
    position: relative;
    height: 310px;
    width: 100%;
    z-index: -1;
    object-fit: cover;
  }
  .conthead {
    position: absolute;
    top: 304px;
    left: 0%;
    z-index: 20;
    background-color: white;
    width: 72vw;
    height: 186px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-left: 13px;
  }
  .minmumhead {
    font-size: 18px;
    font-weight: 400;
    line-height: 21.6px;
    color: rgb(238, 64, 61);
  }
  .midhead {
    margin-top: 4px;
    font-size: 40px;
    font-weight: 500;
    line-height: 48px;
  }
  .maximumhead {
    margin-top: 10px;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    width: 64vw;
  }
  .contactsec2 {
    display: flex;
    flex-direction: row;
    padding: 35px 13px;
  }
  .section1 {
    flex: 0 0 70%;
    display: flex;
    flex-direction: column;
  }
  .shortinput {
    display: flex;
    flex-direction: row;
  }
  .input {
    display: flex;
    flex-direction: column;
  }
  .input label {
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
  }
  .input input {
    width: 390px;
    height: 42px;
    padding: 0.5em;
    box-sizing: border-box;
  }
  .input input:focus {
    outline: none;
    border-color: #1a4845;
  }
  .inputmid {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
  }
  .inputmid label {
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
  }
  .inputmid input {
    width: 819px;
    height: 42px;
    padding: 0.5em;
    box-sizing: border-box;
  }
  .inputmid input:focus {
    outline: none;
    border-color: #1a4845;
  }
  .textarea {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
  }
  .textarea label {
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
  }
  .textarea textarea {
    width: 819px;
    height: 150px;
    padding: 0.5em;
    box-sizing: border-box;
  }
  .submit {
    margin-top: 30px;
    height: 42px;
    width: 120px;
    font-size: 15px;
    font-weight: 500;
    line-height: 22.5px;
    background-color: #efefef;
    border-radius: 5px;
    margin-bottom: 30px;
  }
  .submit:hover {
    background-color: #d0cdc1;
  }
  .section2 {
    flex: 0 0 23%;
    margin-left: 100px;
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    margin-top: 30px;
    border-bottom: 2px solid rgba(128, 128, 128, 0.2);
  }
  .store {
    display: flex;
    flex-direction: row;
  }
  .iconif {
    color: #f04f43;
    font-size: 28px;
    margin-right: 10px;
  }
  .iconify {
    color: #f04f43;
    font-size: 32px;
    margin-right: 4px;
  }
  .hours {
    display: flex;
    flex-direction: row;
    margin-top: 45px;
  }
  .actualhours {
    display: flex;
    flex-direction: column;
  }
  .location {
    padding: 0px 13px;
    margin-bottom: 7px;
    
  }
  @media (max-width: 768px) {
    .contactuno {
      height: 128px;
    }
    .back-img {
      height: 128px;
    }
    .conthead {
      position: relative;
      top: 0px;
      left: 0px;
      width: 100%;
      padding: 0 13px;
      z-index: -1;
      width: calc(100% - 26px);
    }

    .maximumhead {
      width: 100%;
    }
    .midhead {
      font-size: 30px;
      line-height: 36px;
      font-weight: 500;
    }
    .contactsec2 {
      display: flex;
      flex-direction: column;
    }
    .shortinput {
      flex-direction: column;
    }
    .input:nth-child(2) {
      margin-left: 0 !important;
      margin-top: 20px;
    }
    .input input {
      width: 100%;
      border-radius: 1px;
    }
    .inputmid input {
      width: 100%;
      border-radius: 5px;
    }
    .textarea textarea {
      width: 100%;
      border-radius: 5px;
    }
    .inputmid,
    .textarea,
    .submit {
      margin-top: 27px;
    }
    .section2 {
      margin-left: 0px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    
    .hours {
      margin-top: 35px;
      margin-bottom: 20px;
    }
    .location{
      margin-bottom: 15px;
    }
  }
</style>
