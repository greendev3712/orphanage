
export class Orphonage {
    id :any;
    name !:string;
    email !:string;
    students !:number;
    phone_no !:string;
    location :any;
    activities :string="";
    paypal_info  = {paypal_info : ''};
    social_media_links = {social_media_links : ''};
    story !:string;
    money_uses !:string;
    photos_links:any[] = [];
    bank_info :string ="";
    actId !:string;
    acttype !:string;
    country :string="";
    good_work: string="";
    monthly_donation :string="";
    registration_certificate: string="";
    blog_link: string="";
    // oskar
    bene_heading: string = "";
    bene_content: string = "";
  }