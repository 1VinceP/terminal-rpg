import inquirer from "inquirer";

export default async () => {
   const { confirmed } = await inquirer.prompt([{
      name: 'confirmed',
      type: 'confirm',
      message: 'Are you sure you want to quit without saving?'
   }]);

   if (confirmed) process.exit(0);
};
