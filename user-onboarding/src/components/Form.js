import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

import { IoIosArrowDown } from "react-icons/io";

const UserForm = ({ values, errors, touched, status, isSubmitting }) => {
    const [users, setUsers] = useState([]);

    console.log("errors:", errors);
    console.log("touched:", touched);

    useEffect(() => {
        console.log("status has changed:", status);
        status && setUsers(users => [...users, status]);
    }, [status]);

    return (
        <div>
            <Form>
                <Field type="text" name="name" placeholder="Name here" />
                {touched.name && errors.name && (
                    <p className="errors">{`*${errors.name}`}</p>
                )}

                <Field type="email" name="email" placeholder="Email here" />
                {touched.email && errors.email && (
                    <p className="errors">{`* ${errors.email}`}</p>
                )}
                {users.find(user => user.email === values.email) && (
                    <p className="errors">
                        * There is already a user with this email
                    </p>
                )}

                <Field
                    type="password"
                    name="password"
                    placeholder="Password here"
                />
                {touched.password && errors.password && (
                    <p className="errors">{`* ${errors.password}`}</p>
                )}

                <div className="role-container">
                    <Field as="select" className="role" name="role">
                        <option disabled>Select a role</option>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="business">Business/Organization</option>
                    </Field>
                    <IoIosArrowDown />
                </div>

                <label className="checkbox-container">
                    <Field
                        type="checkbox"
                        name="acceptedTerms"
                        checked={values.acceptedTerms}
                    />
                    Agree to Terms of Service
                    <span className="checkmark" />
                </label>
                {touched.acceptedTerms && errors.acceptedTerms && (
                    <p className="errors">
                        * You must accept the Terms of Service
                    </p>
                )}

                <button type="submit" disabled={isSubmitting}>
                    Submit
                </button>
            </Form>
            {users.map(user => {
                return (
                    <ul key={user.id}>
                        <li>Name: {user.name}</li>
                        <li>Email: {user.email}</li>
                    </ul>
                );
            })}
        </div>
    );
};

const FormikForm = withFormik({
    mapPropsToValues(props) {
        return {
            name: props.name || "",
            email: props.email || "",
            password: props.password || "",
            acceptedTerms: props.acceptedTerms || false,
            role: props.role || "Select a role"
        };
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().required(),
        password: Yup.string()
            .min(8, "Too Short!")
            .required(),
        acceptedTerms: Yup.boolean()
            .required()
            .oneOf([true], "You must accept the terms and conditions."),
        role: Yup.string()
            .required()
            .oneOf(["student", "teacher", "business"], "Invalid role")
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
