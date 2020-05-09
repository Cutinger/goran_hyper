import React, { useState } from 'react';
import {Grow, Typography, TextField, Container, Grid, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as API from "../../../_actions/user_actions";
import {store} from "react-notifications-component";
import {
    Button,
  } from 'antd';
const useStyles = makeStyles(theme => ({
    loginContainer: {
        padding: '9em 0 0 0',
        margin: 'auto',
    },
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: theme.spacing(5),
    },
    login: {
        marginTop: 'auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: theme.spacing(3),
        //  boxShadow: '1px 1px 42px rgba(238, 28, 115,0.2);',
    },
  
    topContainerLogo: {
        // background: 'linear-gradient(-317deg, #207af4 -25%, #0b1123, #0b1123 70%, #f02678 160% )',
        margin: theme.spacing(-3),
        padding: theme.spacing(3),
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',

    },
    signupButton: {
        // background: 'linear-gradient(-317deg, #207af4 -25%, #0b1123, #0b1123 70%, #f02678 160% )',
        margin: theme.spacing(3, 0, 3, 0),
        borderRadius: '10px !important',
        color: 'black',
    },
    textfield: {
        '& fieldset': {
            borderRadius: '10px !important',
        }
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    }
  }));


  export default function ForgotPassword(props) {
    const classes = useStyles();
    const [mounted, setMounted] = useState(true);
    const [validationErrors, setValidationErrors] = useState({err_email: false});
    const [value, setValue] = useState(false);

    const handleRedirectSignup = (e) => {
        setMounted(!mounted);
        e.preventDefault();
        props.history.push('/register'); 
    };

      const handleChange = (event) => {
          const { err_email } = validationErrors;
          if (event.target.id === "email" && err_email)
              setValidationErrors({err_email: false});
          setValue({[event.target.id]: event.target.value });
      };

    const handleMailSend = () => {
        if (value && value.email && value.email.length){
            if (!validationErrors.err_email){
                API.sendResetMail(value.email)
                    .then(res => {
                        if (res.status === 200)
                            store.addNotification({
                                message: "A mail confirmation was send.",
                                insert: "top",
                                type: 'success',
                                container: "top-right",
                                animationIn: ["animated", "fadeIn"],
                                animationOut: ["animated", "fadeOut"],
                                dismiss: {
                                    duration: 5000,
                                    onScreen: true
                                }
                            });
                        props.history.push('/login');
                    })
            }
        }
        else
            setValidationErrors({err_mail: 'Please use valid email'});
    };
    
    return (
        <div className="loginbg">
        <div className={classes.loginContainer}>
            <Grow in={mounted}>
                <Container className={classes.login} component="main" maxWidth="xs">
                    <div className={classes.topContainerLogo}>
                        
                    </div>
                    {/* <CssBaseline /> */}
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Forgot Password
                        </Typography>
                        <form className={classes.form} noValidate>
                            <Grid alignContent="center" alignItems="center" container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        className={classes.textfield}
                                        value={value.email || ''}
                                        helperText={validationErrors.err_email}
                                        error={Boolean(validationErrors.err_email)}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                color="primary"
                                type="primary"
                                className={classes.signupButton}
                                onClick={handleMailSend}
                                
                            >
                                Send reset mail
                            </Button>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link onClick={handleRedirectSignup} href="#" variant="body2">
                                        Don't have an account? Sign up
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Container>
            </Grow>
        </div>
        </div>
        );
    }

    