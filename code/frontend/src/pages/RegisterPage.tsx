import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { User } from '../types/User';
import { useQueryClient, useMutation } from 'react-query'
import { createUser } from '../api/AuthApi';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate()

    const initialValues: User = {
        username: '',
        email: '',
        password: '',
    };

    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
    })

    const queryClient = useQueryClient();

    const registerUser = useMutation({
        mutationFn: (user: User) =>
          createUser(user),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['users'] });
          navigate('/login')
        },
        onError: (error) => {
            //TODO: handle when error or when user already exists
            console.log(error)
        }
    });

    return (
        <div className="bg-white h-screen flex justify-end items-center">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                    registerUser.mutate(values)
                }}
            >
                {({ errors }) => (
                    <div className="mx-40 p-16 flex flex-col items-center w-4/12">
                    <h1 className="text-6xl font-bold mb-3 text-dijo-blue">DIJO</h1>
                    <h2 className="text-4xl font-medium mb-3 text-dijo-dark-grey">Create an account</h2>
                    <h3 className="text-dijo-dark-grey mb-8">Please enter your details</h3>
                            <Form className="w-full">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-dijo-dark-grey">Username</span>
                                    </label>
                                    <Field type="text" id="username" name="username" className="inline-block input bg-white input-bordered"/>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-dijo-dark-grey">Email</span>
                                    </label>
                                    <Field type="email" id="email" name="email" className="bg-white border rounded-lg w-full py-3 my-2 px-5 text-dijo-light-grey leading-tight focus:outline-none focus:shadow-outline" />
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
                                >Register
                                </button>
                                <a className="w-full text-sm text-dijo-dark-grey" href="/login">
                                    Already have an account? 
                                </a>
                                {Object.keys(errors).length > 0 && (
                                    <div className='text-red-500 rounded-lg px-4 py-2'>
                                        <ErrorMessage name="firstName" component="div" />
                                        <ErrorMessage name="lastName" component="div" />
                                        <ErrorMessage name="email" component="div" />
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