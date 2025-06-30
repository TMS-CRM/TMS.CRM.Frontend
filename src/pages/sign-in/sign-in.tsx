import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Box, Button, Divider, Grid, IconButton, InputAdornment, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import logo from '../../assets/leaf.svg';
import './sign-in.css';
import TextFieldController from '../../components/form/text-field-controller';
import { useAuth } from '../../hooks/use-auth';

type SignInFormValues = {
  email: string;
  password: string;
};

type DefinePasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [session, setSession] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');

  const { signIn, definePassword } = useAuth();

  const handleToggleVisibility = (): void => setShowPassword((prev) => !prev);

  const signInSchema = yup.object({
    email: yup.string().required('Email is required'),
    password: yup.string().required('Password is required'),
  });

  const definePasswordSchema = yup.object({
    newPassword: yup.string().required('New password is required').min(6, 'Minimum 6 characters'),
    confirmPassword: yup
      .string()
      .required('Confirm your password')
      .oneOf([yup.ref('newPassword')], 'Passwords must match'),
  });

  const signInForm = useForm<SignInFormValues>({
    resolver: yupResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const definePasswordForm = useForm<DefinePasswordFormValues>({
    resolver: yupResolver(definePasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (session) {
      signInForm.reset();
    }
  }, [session, signInForm]);

  // Limpar mensagens automaticamente após 4s
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
      }, 4000);
      return (): void => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  // Submit login
  async function onSubmitSignIn(): Promise<void> {
    console.log('sign-in');
    console.log('formData', signInForm.getValues());

    // signInForm.handleSubmit(async (data): Promise<void> => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const data = signInForm.getValues();
      const result = await signIn({ email: data.email, password: data.password });
      console.log('SIGN IN RESULT', result);

      if (result.success) {
        void navigate('/');
      } else if (result.session) {
        setSession(result.session);
        setEmail(data.email);
        setErrorMessage('New password required to continue. Please define a new password.');
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      setErrorMessage('Unexpected error during sign-in. Please try again.');
      console.error(error);
    }
    // });
  }

  // Submit para definir nova senha
  function onSubmitDefinePassword(): void {
    definePasswordForm.handleSubmit(async (data): Promise<void> => {
      setErrorMessage(null);
      setSuccessMessage(null);

      if (!session) {
        setErrorMessage('Session expired, please login again.');
        setSession(null);
        return;
      }

      try {
        const success = await definePassword({
          email,
          password: data.newPassword,
          session,
        });

        if (success) {
          definePasswordForm.reset();
          setSession(null);
          setEmail('');
          setSuccessMessage('Password defined successfully. Please log in.');
        } else {
          setErrorMessage('Failed to define password. Please try again.');
        }
      } catch {
        setErrorMessage('Failed to define password. Please try again.');
      }
    });
  }

  return (
    <Grid container className="layout-grid">
      <Grid size={{ xs: 12, sm: 12, md: 8 }} className="left-panel">
        <div className="branding-container">
          <div className="crm-container">
            <img src={logo} alt="Logo" className="logo-leaf" />
            <Typography className="text-CRM">CRM</Typography>
          </div>

          <Divider className="divider" />

          <Typography className="text-description">Simplify your workflow—organize customers, deals, and tasks in one place</Typography>
        </div>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}

          <Box className="sign-in-page-container">
            <Paper elevation={3} className="grid-container-sign-in">
              {!session ? (
                <FormProvider {...signInForm} key="sign-in">
                  <Typography variant="h4" className="title-login" color="primary">
                    Sign In
                  </Typography>

                  <TextFieldController name="email" label="Email" type="email" />
                  <TextFieldController
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleToggleVisibility} edge="end">
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    className="submit-button-sign-in"
                    // disabled={!signInForm.formState.isDirty || signInForm.formState.isSubmitting}
                    onClick={() => {
                      void onSubmitSignIn();
                    }}
                  >
                    Sign In
                  </Button>
                </FormProvider>
              ) : (
                <FormProvider {...definePasswordForm} key="define-password">
                  <form
                    onSubmit={() => {
                      void onSubmitDefinePassword();
                    }}
                  >
                    <Typography variant="h4" className="title-login" color="primary">
                      Define your new password
                    </Typography>

                    <TextFieldController
                      name="newPassword"
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleToggleVisibility} edge="end">
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextFieldController
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleToggleVisibility} edge="end">
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Button
                      type="submit"
                      className="submit-button-sign-in"
                      disabled={!definePasswordForm.formState.isDirty || definePasswordForm.formState.isSubmitting}
                      onClick={() => {
                        console.log('Sign In Form Values:', signInForm.getValues());
                      }}
                    >
                      Define Password
                    </Button>
                  </form>
                </FormProvider>
              )}
            </Paper>
          </Box>
        </>
      </Grid>
    </Grid>
  );
};

export default SignIn;
