import React, { Component } from 'react';
import isEmail from 'validator/lib/isEmail';
import firebase from "firebase"
import DefaultTemplate from '../../templates/default';
import { HowItWorks, Plans } from '../../components';
import './styles.scss';
import db from '../../config';
import backgroundImg from '../../assets/images/business-back.png';
import icCheck from '../../assets/icons/ic_check.png'
import img1 from '../../assets/images/partner_benefit_nolongterm.png';
import img2 from '../../assets/images/partner_benefit_multiple.png';
import img3 from '../../assets/images/partner_benefit_track.png';

const styles = {
    back: {
        backgroundImage: `url(${backgroundImg})`
    }
}
 
class FreeBusinessInvitationScreen extends Component {
    state = {
            isSubmitted: false,
            firstName: '',
            lastName: '',
            businessName: '',
            phoneNumber: '',
            email: '',
            errors: {},
            isAgreedToTerms: false 
        }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    isMobilePhone =  phone => phone.length === 10 && [...phone].every(ch => ch >= 0 && ch <= 9 )

    validateForm = (name, value) => {
        let errors = {};

        switch (name) {
            case 'firstName': 
                if (value === '') {
                    errors.firstName = 'Enter your first name.';
                } else {
                    errors.firstName = null;
                }
                break;
            case 'lastName':
                if (value === '') {
                    errors.lastName = 'Enter your last name.';
                } else {
                    errors.lastName = null;
                }
                break;
            case 'businessName':
                if (value === '') {
                    errors.businessName = 'Enter your business name.';
                } else {
                    errors.businessName = null;
                }
                break;
            case 'phoneNumber':
                if (value === '') {
                    errors.phoneNumber = 'Enter your phone number.';
                } else if (!this.isMobilePhone(value)){
                    errors.phoneNumber = 'invalid phone number.';
                } else {
                    errors.phoneNumber = null;
                }
                break;
            case 'email':
                if (value === '') {
                    errors.email = 'Enter your email address.';
                } else if (!isEmail(value)){
                    errors.email = 'Invalid email address.';
                } else {
                    errors.email = null;
                }
                break;
            default:
                break;
        }
        return errors;
    } 

    isFormValid = errors => (errors.firstName === null && errors.lastName === null && errors.businessName === null && errors.phoneNumber === null && errors.email === null)

    handleChange = event => {
        event.preventDefault();
        const { name, value } = event.target;
        const error = this.validateForm(name, value);
        this.setState({errors: {...this.state.errors, ...error} , [name]: value});
    }

    onSubmit = () => {
        let errors = this.state.errors;
        
        if (!this.state.isAgreedToTerms) {
            errors.isAgreedToTerms = 'You should agree to terms and conditions.'
        }

        if (this.isFormValid(errors) && this.state.isAgreedToTerms) {
            const {firstName, lastName, businessName, phoneNumber, email} = this.state;
            const data = {firstName, lastName, businessName, phoneNumber, email};
            const uid = new Date().getTime()
            const createdAt = firebase.firestore.FieldValue.serverTimestamp();
            const customer = {uid, createdAt, data};
            db.collection("customers").doc(`${uid}`)
              .set(customer)
              .then(() => this.setState({isSubmitted: true}))
              .catch(error => console.error(error))



            // const ref = database.ref('free-business-invitation').push();
            // ref.set({
            //     firstName: this.state.firstName,
            //     lastName: this.state.lastName,
            //     businessName: this.state.businessName,
            //     phoneNumber: this.state.phoneNumber,
            //     email: this.state.email,
            //     id: ref.key
            // }).then(() => {
            //     this.setState({isSubmitted: true});
            // }).catch(error => {
            //     console.log(error);
            // })

        } else {
            this.setState({errors})
        }
    }

    toggleChange = () => {
        this.setState({
          isAgreedToTerms: !this.state.isAgreedToTerms,
        });
    }

    render() {
        let errors = this.state.errors;
        return (
            <DefaultTemplate path="free-business-invitation">
                <div className="business-back" style={styles.back}/>
                <div className="mnph-main-container">
                    <div className="b-main-frame">
                        <span className="title">Free Business Invitation:</span>
                        <div className="business-invitation">
                            <div className="business-invitation-form">
                            {
                                this.state.isSubmitted ? (
                                    <div className="bi-content">
                                        <div className="has-border" align="center">
                                            <img src={icCheck} alt="success" />
                                            <div className="content">
                                                <span className="title">Success!</span>
                                                <p>Thank you for submitting your information. One of our representatives will be contacting you within the next couple of business days with next steps. In the meantime, if you have questions please get in touch with us at <a href="mailto:sales@momnpophub.com">sales@momnpophub.com</a></p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bi-content">
                                        <div className="mnph-row">
                                            <div className="mnph-col row-gap">
                                                <div className="form-input">
                                                    {
                                                        this.state.errors.firstName ? (
                                                            <input className="npmh-input invalid" value={this.state.firstName} type="text" placeholder="First Name" name="firstName" onChange={(event) => this.handleChange(event)}/>
                                                        ) : (
                                                            <input className={this.state.errors.firstName === undefined ? "npmh-input" : "npmh-input valid"} value={this.state.firstName} type="text" placeholder="First Name" name="firstName" onChange={(event) => this.handleChange(event)}/>
                                                        )
                                                    }
                                                    <span className="input-error">{this.state.errors.firstName}</span>
                                                </div>
                                            </div>
                                            <div className="mnph-col row-gap">
                                                <div className="form-input">
                                                    {
                                                        this.state.errors.lastName ? (
                                                            <input className="npmh-input invalid" value={this.state.lastName} type="text" placeholder="Last Name" name="lastName" onChange={(event) => this.handleChange(event)}/>
                                                        ) : (
                                                            <input className={this.state.errors.lastName === undefined ? "npmh-input" : "npmh-input valid"} value={this.state.lastName} type="text" placeholder="Last Name" name="lastName" onChange={(event) => this.handleChange(event)}/>
                                                        )
                                                    }
                                                    <span className="input-error">{this.state.errors.lastName}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mnph-row">
                                            <div className="mnph-col row-gap">
                                                <div className="form-input">
                                                    {
                                                        this.state.errors.businessName ? (
                                                            <input className="npmh-input invalid" value={this.state.businessName} type="text" placeholder="Business Name" name="businessName" onChange={(event) => this.handleChange(event)}/>
                                                        ) : (
                                                            <input className={this.state.errors.businessName === undefined ? "npmh-input" : "npmh-input valid"} value={this.state.businessName} type="text" placeholder="Business Name" name="businessName" onChange={(event) => this.handleChange(event)}/>
                                                        )
                                                    }
                                                    <span className="input-error">{this.state.errors.businessName}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mnph-row">
                                            <div className="mnph-col row-gap">
                                                <div className="form-input">
                                                    {
                                                        this.state.errors.phoneNumber ? (
                                                            <input className="npmh-input invalid" value={this.state.phoneNumber} type="text" placeholder="Business Phone" name="phoneNumber" onChange={(event) => this.handleChange(event)}/>
                                                        ) : (
                                                            <input className={this.state.errors.phoneNumber === undefined ? "npmh-input" : "npmh-input valid"} value={this.state.phoneNumber} type="text" placeholder="Business Phone" name="phoneNumber" onChange={(event) => this.handleChange(event)}/>
                                                        )
                                                    }
                                                    <span className="input-error">{this.state.errors.phoneNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mnph-row">
                                            <div className="mnph-col row-gap">
                                                <div className="form-input">
                                                    {
                                                        this.state.errors.email ? (
                                                            <input className="npmh-input invalid" value={this.state.email} type="email" placeholder="Email Address" name="email" onChange={(event) => this.handleChange(event)}/>
                                                        ) : (
                                                            <input className={this.state.errors.email === undefined ? "npmh-input" : "npmh-input valid"} value={this.state.email} type="email" placeholder="Email Address" name="email" onChange={(event) => this.handleChange(event)}/>
                                                        )
                                                    }
                                                    <span className="input-error">{this.state.errors.email}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mnph-row">
                                            <div className="mnph-col">
                                                <div className="form-input">
                                                    <label className={this.state.errors.isAgreedToTerms === undefined ? "mnph-checkbox" : "mnph-checkbox invalid"}>
                                                        I agree to terms and conditions.
                                                        <input type="checkbox" checked={this.state.isAgreedToTerms} onChange={this.toggleChange}/>
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="actions">
                                            <button 
                                                className={errors.firstName === null && errors.lastName === null && errors.businessName === null && errors.phoneNumber === null && errors.email === null && this.state.isAgreedToTerms ? "submit" : "submit gray"} 
                                                onClick={() => this.onSubmit()}>Submit information</button>
                                        </div>
                                    </div>
                                )
                            }
                            </div>
                            
                            <div className="business-invitation-desc">
                                <p>We would love to have your business on Mom n Pop Hub. We are currently inviting selected businesses into our platform and you are can submit your business information for a free business invite.<br/><br/><span className="warning">WE’LL GET BACK TO YOU WITHIN 2-3 BUSINESS DAYS WITH NEXT STEPS AND MORE INFORMATION.</span><br /><br />Requesting an invite doesn't enroll your business into our platform, it just gives you a chance to talk to our team and ensure it's a right fit for your business.<br /><br />Shoot us an email at <a href="mailto:sales@momnpophub.com">sales@momnpophub.com</a> if you’ve got any questions, we’d love to hear from you!</p>
                            </div>
                        </div>
                    </div>

                    <div className="benefits-partner-frame" align="center">
                        <span className="title">Benefits of partnering with us</span>
                        <div className="benefits-content">
                            <div className="benefit-item" align="center">
                                <img src={img1} alt="No long term commitments or contract." />
                                <p>No long term commitments or contract.</p>
                            </div>
                            <div className="benefit-item" align="center">
                                <img src={img2} alt="Market multiple products and services simultaneously." />
                                <p>Market multiple products and services simultaneously.</p>
                            </div>
                            <div className="benefit-item" align="center">
                                <img src={img3} alt="Track real time customer behavior across multiple channels." />
                                <p>Track real time customer behavior across multiple channels.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <HowItWorks />
                <Plans path="free-business-invitation"/>
            </DefaultTemplate>
        )
    }
}

export default FreeBusinessInvitationScreen;