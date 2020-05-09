import React from 'react';
import {Grow, Typography, TextField, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as API from "../../../_actions/user_actions";
import {store} from "react-notifications-component";
import {
    Button,
  } from 'antd';
// Style
const useStyles = makeStyles(theme => ({
    forgotContainer: {
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
        background: 'white',
        borderRadius: '12px',
        padding: theme.spacing(3),
        
    },
    
    topContainerLogo: {
        margin: theme.spacing(-3),
        padding: theme.spacing(3),
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',

    },
    signupButton: {
        margin: theme.spacing(3, 0, 3, 0),
        borderRadius: '10px !important',
        color: 'black',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    signupItem: {
        textAlign: 'right !important',
    }
}));


export default function ResetPassword(props) {
    const classes = useStyles();

    // Warnings after validation
    const [validationErrors, setValidationErrors] = React.useState({ err_username: false, err_password: false, err_password_confirm : false });

    // State input TextFields
    const [fieldValue, setTextFieldsValues] = React.useState({ username: '', password: '', password_confirm: ''})

    /* Input onChange -> Update value, store it in state(setTextFieldsValues), if user has a previous warnings then dismiss it with false */
    const handleChange = (event) => {
        const { err_username, err_password, err_password_confirm } = validationErrors;
        if (event.target.id === "username" && err_username)
            setValidationErrors({...validationErrors, err_username: false});
        if (event.target.id === "password" && err_password)
            setValidationErrors({...validationErrors, err_password: false});
        if (event.target.id === "password_confirm" && err_password_confirm)
            setValidationErrors({...validationErrors, err_password: false});
        setTextFieldsValues({...fieldValue, [event.target.id]: event.target.value });
    };

    const handleResetClicked = (e) => {
        e.preventDefault();
        const errors = { username: false, password: false, password_confirm: false }

        // if (!VALIDATION.validateUsername(fieldValue.username))
        //     errors.username = 'Please use valid username';
        // if (!fieldValue.password.length)
        //     errors.password = 'Password required';
        // if (fieldValue.password !== fieldValue.password_confirm)
        //     errors.password_confirm = 'Passwords must match';
        // else if (!VALIDATION.validatePassword(fieldValue.password))
        //     errors.password = 'Please use strong password';
        setValidationErrors({ err_password: errors.password, err_username: errors.username , err_password_confirm: errors.password_confirm});
        if (!errors.username && !errors.password && !errors.password_confirm) {
           
            API.resetPassword(props.match.params.tokenConf, fieldValue.password, fieldValue.password_confirm, fieldValue.username)
                .then(response => {
                    if (response.status === 200){
                        store.addNotification({
                            message: "Your password was successfully reset",
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
                        console.log("GOOD")
                          props.history.push('/')
                    }
                })
                .catch(err => {
                    if (err.response && err.response.data && err.response.data.errors)
                        setValidationErrors({err_password: err.response.data.errors.password, err_password_confirm: err.response.data.errors.password_confirm,});
                    else {
                        store.addNotification({
                            message: "An error occurred with token",
                            insert: "top",
                            type: 'success',
                            container: "top-right",
                            animationIn: ["animated", "fadeIn"],
                            animationOut: ["animated", "fadeOut"],
                            dismiss: {
                                duration: 5000,
                                onScreen: true
                            }
                        });console.log("NOT GOOD")
                          props.history.push('/')
                    }
                });
        }
    };

    return (
        <div className="loginbg">
        <div className={classes.forgotContainer}>
            <Grow in={true}>
                <Container className={classes.login} component="main" maxWidth="xs">
                    <div className={classes.topContainerLogo}>
                        
                    </div>
                    {/* <CssBaseline /> */}
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Reset password
                        </Typography>
                        <form className={classes.form} onSubmit={handleResetClicked} noValidate>
                            <Grid alignContent="center" alignItems="center" container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        onChange={handleChange}
                                        helperText={validationErrors.err_username}
                                        error={Boolean(validationErrors.err_username)}
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        autoComplete="username"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        onChange={handleChange}
                                        helperText={validationErrors.err_password}
                                        error={Boolean(validationErrors.err_password) || Boolean(validationErrors.err_username)}
                                        variant="filled"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        value={fieldValue.password_confirm || ''}
                                        helperText={validationErrors.err_password_confirm}
                                        error={Boolean(validationErrors.err_password_confirm)}
                                        onChange={handleChange}
                                        variant="filled"
                                        required
                                        fullWidth
                                        name="password_confirm"
                                        label="Password Confirm"
                                        type="password"
                                        id="password_confirm"
                                        autoComplete="current-password"
                                        className={classes.textfield}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                type="primary"
                                color="primary"
                                className={classes.signupButton}
                                onClick={handleResetClicked}
                            >
                                Reset password
                            </Button>
                        </form>
                    </div>
                </Container>
            </Grow>
        </div>
        </div>
    );
}