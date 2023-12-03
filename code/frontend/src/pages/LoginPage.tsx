import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useQueryClient, useMutation } from 'react-query';
import { loginUser } from '../api/AuthApi';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/userAuth';

function LoginPage() {

  const navigate = useNavigate()

  const { login } = useAuth();

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
  })

  const queryClient = useQueryClient();

  const signIn = useMutation({
    mutationFn: (credentials: {username: string, password: string}) =>
      loginUser(credentials),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (response.access_token) {
        localStorage.setItem("access_token", JSON.stringify(response.access_token));
      }
      navigate('/main')
    },
    onError: (error) => {
        //TODO: handle when error or when user already exists
        console.log(error)
    }
});

  return (
    <div className="bg-white h-screen flex justify-start items-center">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                    signIn.mutate(values)
                }}
            >
                {({ errors }) => (
                    <div className="mx-40 w-1/4 flex flex-col items-center">
                      <h1 className="text-6xl font-bold mb-3 text-dijo-blue">DIJO</h1>
                      <h2 className="text-4xl font-medium mb-3 text-dijo-dark-grey">Welcome Back</h2>
                      <h3 className="text-dijo-dark-grey mb-8">Please enter your details</h3>
                      <Form className="max-w-xs w-full">
                          <div className="form-control">
                              <label className="label">
                                  <span className="label-text text-dijo-dark-grey">Username</span>
                              </label>
                              <Field type="text" id="username" name="username" className="inline-block input bg-white input-bordered"/>
                          </div>
                          <div className="form-control">
                              <label className="label">
                                  <span className="label-text text-dijo-dark-grey">Password</span>
                              </label>
                              <Field type="password" id="password" name="password" className="mb-2 inline-block input bg-white input-bordered"/>
                          </div>
                          <button
                              className="bg-dijo-orange w-full text-white font-bold my-2 py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                              type="submit"
                          >Login
                          </button>
                          <a className="w-full text-sm text-dijo-dark-grey" href="/register">
                              Register
                          </a>
                          {Object.keys(errors).length > 0 && (
                              <div className='text-red-500 rounded-lg px-4 py-2'>
                                  <ErrorMessage name="username" component="div" />
                                  <ErrorMessage name="password" component="div" />
                              </div>
                          )}
                      </Form>
                    </div>
                    )}
            </Formik>
        </div>
  );
}

export default LoginPage;


// login end point returns session cookie - store in local and send cookie in header each request