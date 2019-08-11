export default
{
    projectName: "Fresher",
    markdown:
        `
            # h1 title
            paragraph
        `,
    data: {
        sections: [
            {
                component: "module1",
                title: "Section 1",
                intro: "Doloremque alias cum. Enim libero et atque nihil culpa animi. Vel nisi officiis sunt non sunt qui modi quia.",
                components: [
                    {
                        component: "person",
                        props: {
                            name: "Dog Nuttall",
                            role: "Lead front-end developer"
                        }
                    },
                    {
                        component: "quote",
                        props: {
                            text: "It's been great!",
                            author: {
                                image: "murray-nuttall.jpg",
                                name: "Murray Nuttall",
                                role: "Lead front-end developer"
                            }
                        }
                    }
                ]
            },
            {
                component: "module2",
                title: "Section 2",
                intro: "Voluptatibus provident ipsum tenetur debitis reprehenderit. Nesciunt ut similique eligendi facilis modi. Officiis rerum nisi et facere est voluptatibus. Iste quia doloribus recusandae est non quaerat. Occaecati dolorem nisi dolorem error aut labore voluptates natus est."
            },
            {
                component: "module1",
                title: "Section 3",
                intro: "Recusandae aliquid blanditiis et esse qui. Expedita vitae molestiae omnis et consequatur vero harum."
            },
            {
                component: "module1",
                title: "Section 4",
                intro: "Rerum ipsa accusamus quae dolorem laudantium illo velit repudiandae. Itaque et quis qui doloremque vitae laborum. Consequatur cupiditate sit vitae commodi et."
            }
        ]
    }
}
