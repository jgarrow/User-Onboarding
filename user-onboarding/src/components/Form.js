import React, { useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Name
// Email
// Password
// Terms of Service (checkbox)
// A Submit button to send our form data to the server

const UserForm = ({ values, errors, touched, status }) => {
    console.log("errors:", errors);
    console.log("touched:", touched);

    // useEffect(() => {
    //     console.log("status has changed:", status);
    //     status && setAnimals(animals => [...animals, status]);
    // }, [status]);

    return (
        <div>
            <Form>
                <Field type="text" name="name" placeholder="Name here" />
                {touched.name && errors.name && (
                    <p className="errors">{errors.name}</p>
                )}

                <Field type="email" name="email" placeholder="Email here" />
                {touched.email && errors.email && (
                    <p className="errors">{errors.email}</p>
                )}

                <Field
                    type="password"
                    name="password"
                    placeholder="Password here"
                />
                {touched.password && errors.password && (
                    <p className="errors">{errors.password}</p>
                )}

                <label className="checkbox-container">
                    Agree to Terms of Service
                    <Field
                        type="checkbox"
                        name="terms"
                        checked={values.terms}
                    />
                    <span className="checkmark" />
                </label>

                <button type="submit">Submit</button>
            </Form>
        </div>
    );
};

const FormikForm = withFormik({
    mapPropsToValues(props) {
        return {
            name: props.name || "",
            email: props.email || "",
            password: props.password || "",
            terms: props.terms || false
        };
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().required(),
        password: Yup.string().required()
    }),
    handleSubmit(values, { setStatus, resetForm }) {
        console.log("submitting", values);
        axios
            .post("https://reqres.in/api/users/", values)
            .then(res => {
                console.log("success", res);
                setStatus(res.data);
                resetForm();
            })
            .catch(err => console.log(err.response));
    }
})(UserForm);
export default FormikForm;
